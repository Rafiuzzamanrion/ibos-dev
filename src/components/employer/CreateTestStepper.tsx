"use client";

import { Check } from "lucide-react";

interface CreateTestStepperProps {
  currentStep: number;
  steps: string[];
}

export function CreateTestStepper({ currentStep, steps }: CreateTestStepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isCurrent = currentStep === stepNumber;

        return (
          <div key={label} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={`h-px w-16 md:w-28 ${
                  isCompleted ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}

            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepNumber}
              </div>
              <span
                className={`text-sm font-medium ${
                  isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
