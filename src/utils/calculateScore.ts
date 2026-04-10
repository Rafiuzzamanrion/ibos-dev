import { IQuestion } from "@/types/question.types";
import { IAnswer } from "@/types/submission.types";

export function calculateScore(
  questions: IQuestion[],
  answers: IAnswer[],
  negativeMarking: boolean
): number {
  let score = 0;

  for (const question of questions) {
    const userAnswer = answers.find(
      (a) => a.questionId === question._id
    );

    if (!userAnswer) continue;

    if (question.type === "text") {
      score += question.score;
      continue;
    }

    const correctOptions = question.options
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.text);

    const userSelected = Array.isArray(userAnswer.answer)
      ? userAnswer.answer
      : [userAnswer.answer];

    const isCorrect =
      correctOptions.length === userSelected.length &&
      correctOptions.every((opt) => userSelected.includes(opt));

    if (isCorrect) {
      score += question.score;
    } else if (negativeMarking && userSelected.length > 0) {
      score -= question.score * 0.25;
    }
  }

  return Math.max(0, score);
}
