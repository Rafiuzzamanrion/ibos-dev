"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IExam } from "@/types/exam.types";
import { IQuestion } from "@/types/question.types";

interface EmployerExamCardProps {
  exam: IExam;
  onViewCandidates: (examId: string) => void;
}

export function EmployerExamCard({ exam, onViewCandidates }: EmployerExamCardProps) {
  const questionCount = Array.isArray(exam.questionSets)
    ? exam.questionSets.length
    : 0;

  const hasQuestionObjects =
    exam.questionSets.length > 0 &&
    typeof exam.questionSets[0] === "object";

  const questionSetsCount = hasQuestionObjects
    ? new Set(
        (exam.questionSets as IQuestion[]).map((q) => q.type)
      ).size
    : questionCount;

  return (
    <Card className="border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          {exam.title}
        </h3>

        <div className="mb-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-1.5">
            <Image
              src="/user-group.png"
              alt="Candidates"
              width={16}
              height={16}
              className="opacity-60"
            />
            <span className="text-xs text-muted-foreground">Candidates:</span>
            <span className="text-xs font-semibold text-foreground">
              {exam.totalCandidates?.toLocaleString() || "Not Set"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Image
              src="/file-02.png"
              alt="Question Set"
              width={16}
              height={16}
              className="opacity-60"
            />
            <span className="text-xs text-muted-foreground">Question Set:</span>
            <span className="text-xs font-semibold text-foreground">
              {questionSetsCount || "Not Set"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Image
              src="/timeline.png"
              alt="Exam Slots"
              width={16}
              height={16}
              className="opacity-60"
            />
            <span className="text-xs text-muted-foreground">Exam Slots:</span>
            <span className="text-xs font-semibold text-foreground">
              {exam.totalSlots || "Not Set"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewCandidates(exam._id)}
          className="border-primary text-primary hover:bg-[#EDE8FF] rounded-full px-5 h-9"
          id={`view-candidates-${exam._id}`}
        >
          View Candidates
        </Button>
      </CardContent>
    </Card>
  );
}
