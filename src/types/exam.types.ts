import { IQuestion } from "./question.types";

export type ExamStatus = "draft" | "published";

export interface IExam {
  _id: string;
  title: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: IQuestion[] | string[];
  questionType: string;
  startTime: string;
  endTime: string;
  duration: number;
  negativeMarking: boolean;
  createdBy: string;
  status: ExamStatus;
  createdAt?: Date;
}

export interface IExamForm {
  title: string;
  totalCandidates: number;
  totalSlots: number;
  totalQuestionSets: number;
  questionType: string;
  startTime: string;
  endTime: string;
  duration: number;
  negativeMarking: boolean;
}
