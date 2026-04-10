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
        text: z.string().min(1, "Option text is required"),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
}).refine(
  (data) => {
    if (data.type === "radio" || data.type === "checkbox") {
      return data.options && data.options.some((opt) => opt.isCorrect);
    }
    return true;
  },
  {
    message: "At least one correct answer must be selected",
    path: ["options"],
  }
);

export type QuestionFormData = z.infer<typeof questionFormSchema>;
