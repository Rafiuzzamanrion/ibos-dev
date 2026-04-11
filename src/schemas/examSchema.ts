import { z } from "zod";

export const basicInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  totalCandidates: z.number().min(1, "At least 1 candidate required"),
  totalSlots: z.number().min(1, "At least 1 slot required"),
  totalQuestionSets: z.number().min(1, "At least 1 question set required"),
  questionType: z.string().min(1, "Question type is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  duration: z.number().min(1, "Duration is required"),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

export const questionFormSchema = z.object({
  title: z.string().min(1, "Question title is required"),
  type: z.enum(["radio", "checkbox", "text"]),
  score: z.number().min(1, "Score must be at least 1"),
  options: z
    .array(
      z.object({
        text: z.string().optional(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
}).superRefine((data, ctx) => {
  if (data.type === "radio" || data.type === "checkbox") {
    let hasCorrect = false;
    let allHaveText = true;
    
    data.options?.forEach((opt) => {
      if (opt.isCorrect) hasCorrect = true;
      if (!opt.text || opt.text.trim() === "") allHaveText = false;
    });

    if (!allHaveText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All option texts must be filled",
        path: ["options"],
      });
    }

    if (!hasCorrect) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one correct answer must be selected",
        path: ["options"],
      });
    }
  }
});

export type QuestionFormData = z.infer<typeof questionFormSchema>;
