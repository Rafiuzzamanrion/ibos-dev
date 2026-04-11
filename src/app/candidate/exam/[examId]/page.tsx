"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { AppHeader } from "@/components/shared/AppHeader";
import { AppFooter } from "@/components/shared/AppFooter";
import { ExamTimer } from "@/components/candidate/ExamTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTimer } from "@/hooks/useTimer";
import { useSubmission } from "@/hooks/useSubmission";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAnswer, resetSubmission, restoreAnswers } from "@/store/slices/submissionSlice";
import api from "@/lib/axios";
import { IExam } from "@/types/exam.types";
import { IQuestion } from "@/types/question.types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { saveAnswersOffline, loadAnswersOffline } from "@/utils/offlineStorage";
import { CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";

const QuestionRenderer = dynamic(
  () =>
    import("@/components/candidate/QuestionRenderer").then(
      (mod) => mod.QuestionRenderer
    ),
  { loading: () => <Skeleton className="h-64 w-full rounded-xl" /> }
);

const BehaviorTracker = dynamic(
  () =>
    import("@/components/candidate/BehaviorTracker").then(
      (mod) => mod.BehaviorTracker
    ),
  { ssr: false }
);

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const examId = params.examId as string;

  const [exam, setExam] = useState<IExam | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);

  const answers = useAppSelector((state) => state.submission.answers);
  const isSubmitted = useAppSelector((state) => state.submission.isSubmitted);
  const { submitting, submitAnswers } = useSubmission();

  const handleExpire = useCallback(async () => {
    if (!isSubmitted) {
      setShowTimeout(true);
      await submitAnswers(examId, answers, true);
      try {
        const prev = JSON.parse(localStorage.getItem("submitted_exams") || "[]");
        if (!prev.includes(examId)) localStorage.setItem("submitted_exams", JSON.stringify([...prev, examId]));
      } catch (err) {}
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [isSubmitted, submitAnswers, examId, answers]);

  const { formattedTime, isExpired } = useTimer(
    exam?.duration || 30,
    handleExpire
  );

  useEffect(() => {
    async function fetchExam() {
      try {
        const response = await api.get(`/exams/${examId}`);
        const examData = response.data.data;
        setExam(examData);
        setQuestions(examData.questionSets || []);
      } catch {
        toast.error("Failed to load exam");
        router.push("/candidate/dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchExam();
  }, [examId, router]);

  useEffect(() => {
    async function restoreOfflineAnswers() {
      const saved = await loadAnswersOffline();
      if (saved && Object.keys(saved).length > 0) {
        dispatch(restoreAnswers(saved));
        toast.info("Your previous answers have been restored");
      }
    }
    restoreOfflineAnswers();
    return () => {
      dispatch(resetSubmission());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!loading && exam) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, [loading, exam]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (Object.keys(answers).length > 0) {
        saveAnswersOffline(answers);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [answers]);

  useEffect(() => {
    function handleOnline() {
      if (isExpired && !isSubmitted) {
        submitAnswers(examId, answers, true).then(() => {
          try {
            const prev = JSON.parse(localStorage.getItem("submitted_exams") || "[]");
            if (!prev.includes(examId)) localStorage.setItem("submitted_exams", JSON.stringify([...prev, examId]));
          } catch (err) {}
        });
      }
    }
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [isExpired, isSubmitted, submitAnswers, examId, answers]);

  const handleAnswer = useCallback(
    (questionId: string, answer: string | string[]) => {
      dispatch(setAnswer({ questionId, answer }));
    },
    [dispatch]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleSkipQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleManualSubmit = useCallback(async () => {
    await submitAnswers(examId, answers, false);
    try {
      const prev = JSON.parse(localStorage.getItem("submitted_exams") || "[]");
      if (!prev.includes(examId)) localStorage.setItem("submitted_exams", JSON.stringify([...prev, examId]));
    } catch (err) {}
    setShowCompleted(true);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [submitAnswers, examId, answers]);

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="h-16 bg-[#1e1b4b]" />
        <div className="flex-1 bg-[#f8f8fc] p-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (showCompleted || (isSubmitted && !showTimeout)) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader title="Akij Resource" />
        <main className="flex flex-1 items-center justify-center bg-[#f8f8fc]">
          <Card className="mx-4 w-full max-w-2xl">
            <CardContent className="flex flex-col items-center py-16">
              <Image
                src="/successOFSubmit.png"
                alt="Test Completed"
                width={80}
                height={80}
                className="mb-6 object-contain"
              />
              <h2 className="mb-3 text-xl font-bold">Test Completed</h2>
              <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
                Congratulations! {session?.user?.name}, You have completed your
                exam. Thank you for participating.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/candidate/dashboard")}
                id="back-to-dashboard-completed"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <AppFooter />
      </div>
    );
  }

  if (showTimeout) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader title="Akij Resource" />
        <main className="flex flex-1 items-center justify-center bg-[#f8f8fc]">
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="mx-4 w-full max-w-md">
              <CardContent className="flex flex-col items-center py-12">
                <Image
                  src="/Group (1).png"
                  alt="Timeout"
                  width={64}
                  height={64}
                  className="mb-4"
                />
                <h2 className="mb-3 text-xl font-bold">Timeout!</h2>
                <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
                  Dear {session?.user?.name}, Your exam time has been finished.
                  Thank you for participating.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/candidate/dashboard")}
                  id="back-to-dashboard-timeout"
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="candidate">
      <div className="flex min-h-screen flex-col">
        <AppHeader title="Akij Resource" />
        <BehaviorTracker />

        <main className="flex-1 bg-[#f8f8fc] px-4 py-8 md:px-8">
          <div className="mx-auto max-w-3xl">
            <Card className="mb-6">
              <CardContent className="flex items-center justify-between p-4 md:p-6">
                <h3 className="text-base font-semibold">
                  Question ({currentQuestionIndex + 1}/{questions.length})
                </h3>
                <ExamTimer formattedTime={formattedTime} />
              </CardContent>
            </Card>

            <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
              {currentQuestion && (
                <QuestionRenderer
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  currentAnswer={answers[currentQuestion._id]}
                  onAnswer={handleAnswer}
                />
              )}

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleSkipQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="border-gray-300"
                  id="skip-question"
                >
                  Skip this Question
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-primary text-white hover:bg-primary/90"
                    id="save-and-continue-exam"
                  >
                    Save & Continue
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={submitting}
                        className="bg-primary text-white hover:bg-primary/90"
                        id="submit-exam"
                      >
                        Submit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to submit your exam? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleManualSubmit}
                          className="bg-primary text-white hover:bg-primary/90"
                        >
                          Confirm Submit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>
    </AuthGuard>
  );
}
