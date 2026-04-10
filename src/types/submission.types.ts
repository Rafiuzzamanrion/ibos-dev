export interface IAnswer {
  questionId: string;
  answer: string | string[];
}

export interface ISubmission {
  _id: string;
  examId: string;
  candidateId: string;
  answers: IAnswer[];
  score: number;
  submittedAt: Date;
  tabSwitchCount: number;
  fullscreenExitCount: number;
  isAutoSubmitted: boolean;
}
