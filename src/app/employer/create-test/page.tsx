"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { AppHeader } from "@/components/shared/AppHeader";
import { AppFooter } from "@/components/shared/AppFooter";
import { CreateTestStepper } from "@/components/employer/CreateTestStepper";
import { StepBasicInfo } from "@/components/employer/StepBasicInfo";
import { StepQuestionSets } from "@/components/employer/StepQuestionSets";
import { QuestionModal } from "@/components/employer/QuestionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { basicInfoSchema, BasicInfoFormData } from "@/schemas/examSchema";
import { IQuestionForm } from "@/types/question.types";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreateTestPage() {
  const router = useRouter();
  const { currentStep, next, back } = useMultiStepForm(2);
  const [questions, setQuestions] = useState<IQuestionForm[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: "",
      totalCandidates: 0,
      totalSlots: 0,
      totalQuestionSets: 0,
      questionType: "",
      startTime: "",
      endTime: "",
      duration: 0,
    },
  });

  const handleStepOneNext = useCallback(() => {
    form.handleSubmit(() => {
      next();
    })();
  }, [form, next]);

  const handleAddQuestion = useCallback(() => {
    setEditingIndex(null);
    setModalOpen(true);
  }, []);

  const handleEditQuestion = useCallback((index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  }, []);

  const handleDeleteQuestion = useCallback((index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSaveQuestion = useCallback(
    (data: IQuestionForm) => {
      if (editingIndex !== null) {
        setQuestions((prev) =>
          prev.map((q, i) => (i === editingIndex ? data : q))
        );
      } else {
        setQuestions((prev) => [...prev, data]);
      }
      setModalOpen(false);
      setEditingIndex(null);
    },
    [editingIndex]
  );

  const handleSaveAndAddMore = useCallback(
    (data: IQuestionForm) => {
      if (editingIndex !== null) {
        setQuestions((prev) =>
          prev.map((q, i) => (i === editingIndex ? data : q))
        );
      } else {
        setQuestions((prev) => [...prev, data]);
      }
      setEditingIndex(null);
    },
    [editingIndex]
  );

  const handleSubmitAll = useCallback(async () => {
    const formData = form.getValues();
    setIsSubmitting(true);
    try {
      const examResponse = await api.post("/exams", {
        title: formData.title,
        totalCandidates: formData.totalCandidates,
        totalSlots: formData.totalSlots,
        questionType: formData.questionType,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        duration: formData.duration,
        negativeMarking: false,
        status: "published",
      });

      const examId = examResponse.data.data._id;

      if (questions.length > 0) {
        await api.post("/questions", {
          examId,
          questions: questions.map((q) => ({
            title: q.title,
            type: q.type,
            options: q.options,
            score: q.score,
          })),
        });
      }

      toast.success("Test created successfully!");
      router.push("/employer/dashboard");
    } catch {
      toast.error("Failed to create test");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, questions, router]);

  return (
    <AuthGuard requiredRole="employer">
      <div className="flex min-h-screen flex-col">
        <AppHeader title="Online Test" />

        <main className="flex-1 bg-[#f8f8fc] px-4 py-8 md:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="mb-6 border-gray-200 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mb-3 text-lg font-bold">Manage Online Test</h2>
                  <CreateTestStepper
                    currentStep={currentStep}
                    steps={["Basic Info", "Questions"]}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/employer/dashboard")}
                  id="back-to-dashboard"
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6 md:p-8">
                {currentStep === 1 && <StepBasicInfo form={form} />}

                {currentStep === 2 && (
                  <StepQuestionSets
                    questions={questions}
                    onAddQuestion={handleAddQuestion}
                    onEditQuestion={handleEditQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                  />
                )}
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? () => router.back() : back}
                className="w-32"
              >
                Cancel
              </Button>

              {currentStep === 1 ? (
                <Button
                  onClick={handleStepOneNext}
                  className="w-44 bg-primary text-white hover:bg-primary/90"
                  id="save-and-continue"
                >
                  Save & Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitAll}
                  disabled={isSubmitting}
                  className="w-44 bg-primary text-white hover:bg-primary/90"
                  id="submit-test"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save & Continue"
                  )}
                </Button>
              )}
            </div>
          </div>
        </main>

        <QuestionModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingIndex(null);
          }}
          onSave={handleSaveQuestion}
          onSaveAndAddMore={handleSaveAndAddMore}
          editingQuestion={
            editingIndex !== null ? questions[editingIndex] : null
          }
          questionNumber={
            editingIndex !== null ? editingIndex + 1 : questions.length + 1
          }
        />

        <AppFooter />
      </div>
    </AuthGuard>
  );
}
