"use client";

import { useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IQuestion } from "@/types/question.types";

interface QuestionRendererProps {
  question: IQuestion;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer: string | string[] | undefined;
  onAnswer: (questionId: string, answer: string | string[]) => void;
}

export function QuestionRenderer({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswer,
}: QuestionRendererProps) {
  const handleRadioChange = useCallback(
    (value: string) => {
      onAnswer(question._id, value);
    },
    [question._id, onAnswer]
  );

  const handleCheckboxChange = useCallback(
    (optionText: string, checked: boolean) => {
      const currentSelection = Array.isArray(currentAnswer)
        ? currentAnswer
        : [];
      const updated = checked
        ? [...currentSelection, optionText]
        : currentSelection.filter((v) => v !== optionText);
      onAnswer(question._id, updated);
    },
    [question._id, currentAnswer, onAnswer]
  );

  const handleTextChange = useCallback(
    (value: string) => {
      onAnswer(question._id, value);
    },
    [question._id, onAnswer]
  );

  const selectedRadio = useMemo(
    () => (typeof currentAnswer === "string" ? currentAnswer : ""),
    [currentAnswer]
  );

  const selectedCheckboxes = useMemo(
    () => (Array.isArray(currentAnswer) ? currentAnswer : []),
    [currentAnswer]
  );

  return (
    <div>
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-base font-semibold text-foreground">
          Q{questionNumber}.
        </span>
        <div
          className="prose prose-sm max-w-none text-base font-semibold text-foreground"
          dangerouslySetInnerHTML={{ __html: question.title }}
        />
      </div>

      {question.type === "radio" && (
        <RadioGroup
          value={selectedRadio}
          onValueChange={handleRadioChange}
          className="space-y-3 gap-0"
        >
          {question.options.map((option, index) => {
            const isSelected = selectedRadio === option.text;
            return (
              <Label
                key={index}
                className={`flex cursor-pointer items-center border-b border-gray-200 px-4 py-4 transition-colors ${
                  isSelected
                    ? "bg-[#EDE8FF]"
                    : "hover:bg-gray-50"
                }`}
                htmlFor={`option-${question._id}-${index}`}
              >
                <RadioGroupItem
                  value={option.text}
                  id={`option-${question._id}-${index}`}
                  className="mr-3"
                />
                <span
                  className="prose prose-sm max-w-none flex-1 text-sm font-normal text-foreground pt-0.5"
                  dangerouslySetInnerHTML={{ __html: option.text }}
                />
              </Label>
            );
          })}
        </RadioGroup>
      )}

      {question.type === "checkbox" && (
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isChecked = selectedCheckboxes.includes(option.text);
            return (
              <div
                key={index}
                className={`flex items-center border-b border-gray-200 px-4 py-4 transition-colors ${
                  isChecked
                    ? "bg-[#EDE8FF]"
                    : "hover:bg-gray-50"
                }`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.text, checked as boolean)
                  }
                  id={`checkbox-${question._id}-${index}`}
                  className="mr-3"
                />
                <Label
                  htmlFor={`checkbox-${question._id}-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  <span
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: option.text }}
                  />
                </Label>
              </div>
            );
          })}
        </div>
      )}

      {question.type === "text" && (
        <textarea
          value={typeof currentAnswer === "string" ? currentAnswer : ""}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type your answer here.."
          className="w-full min-h-[150px] resize-none rounded-lg border border-gray-200 p-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          id={`text-answer-${question._id}`}
        />
      )}
    </div>
  );
}
