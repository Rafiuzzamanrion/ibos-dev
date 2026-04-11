export type QuestionType = "checkbox" | "radio" | "text";

export interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  _id: string;
  examId: string;
  title: string;
  type: QuestionType;
  options: IOption[];
  score: number;
  createdAt: Date;
}

export interface IQuestionForm {
  title: string;
  type: QuestionType;
  options: IOption[];
  score: number;
}
