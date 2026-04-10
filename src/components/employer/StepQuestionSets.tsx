"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IQuestionForm } from "@/types/question.types";
import { Check, Pencil, Trash2 } from "lucide-react";

interface StepQuestionSetsProps {
  questions: IQuestionForm[];
  onAddQuestion: () => void;
  onEditQuestion: (index: number) => void;
  onDeleteQuestion: (index: number) => void;
}

export function StepQuestionSets({
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: StepQuestionSetsProps) {
  const typeLabels: Record<string, string> = {
    radio: "MCQ",
    checkbox: "Checkbox",
    text: "Text",
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Question {index + 1}</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {typeLabels[question.type] || question.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {question.score} pt
              </Badge>
            </div>
          </div>

          <div
            className="mb-4 rounded border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-medium prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: question.title }}
          />

          {question.options && question.options.length > 0 && (
            <div className="mb-4 space-y-2">
              {question.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className={`flex items-center justify-between rounded px-3 py-2 text-sm ${
                    option.isCorrect
                      ? "bg-green-50 text-green-800"
                      : "text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {String.fromCharCode(65 + optIndex)}.
                    <span
                      className="prose prose-sm max-w-none inline"
                      dangerouslySetInnerHTML={{ __html: option.text }}
                    />
                  </span>
                  {option.isCorrect && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          )}

          <Separator className="mb-3" />

          <div className="flex items-center justify-between">
            <button
              onClick={() => onEditQuestion(index)}
              className="text-sm font-medium text-primary hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteQuestion(index)}
              className="text-sm font-medium text-red-500 hover:underline"
            >
              Remove From Exam
            </button>
          </div>
        </div>
      ))}

      <Button
        onClick={onAddQuestion}
        className="mt-2 w-full bg-primary h-11 text-sm font-medium text-white hover:bg-primary/90"
        id="add-question-button"
      >
        Add Question
      </Button>
    </div>
  );
}
