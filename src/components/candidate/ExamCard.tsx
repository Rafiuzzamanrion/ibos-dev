"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IExam } from "@/types/exam.types";
import { IQuestion } from "@/types/question.types";
import { Clock, FileText, XCircle } from "lucide-react";

interface CandidateExamCardProps {
  exam: IExam;
  onStart: (examId: string) => void;
}

export function CandidateExamCard({ exam, onStart }: CandidateExamCardProps) {
  const now = new Date();
  const startTime = new Date(exam.startTime);
  const endTime = new Date(exam.endTime);
  const isWithinWindow = now >= startTime && now <= endTime;

  const questionCount = Array.isArray(exam.questionSets)
    ? exam.questionSets.length
    : 0;

  return (
    <Card className="border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          {exam.title}
        </h3>

        <div className="mb-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Duration:</span>
            <span className="text-xs font-semibold">{exam.duration} min</span>
          </div>

          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Question:</span>
            <span className="text-xs font-semibold">{questionCount}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Negative Marking:
            </span>
            <span className="text-xs font-semibold">
              {exam.negativeMarking ? "-0.25/wrong" : "None"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onStart(exam._id)}
          disabled={!isWithinWindow}
          className="border-primary text-primary hover:bg-[#EDE8FF] disabled:opacity-50 rounded-full px-5 h-9"
          id={`start-exam-${exam._id}`}
        >
          Start
        </Button>
      </CardContent>
    </Card>
  );
}
