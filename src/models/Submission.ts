import mongoose, { Schema, Document } from "mongoose";

interface AnswerSubdocument {
  questionId: mongoose.Types.ObjectId;
  answer: string | string[];
}

export interface SubmissionDocument extends Document {
  examId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  answers: AnswerSubdocument[];
  score: number;
  submittedAt: Date;
  tabSwitchCount: number;
  fullscreenExitCount: number;
  isAutoSubmitted: boolean;
}

const AnswerSchema = new Schema<AnswerSubdocument>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    answer: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<SubmissionDocument>({
  examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  answers: [AnswerSchema],
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  tabSwitchCount: { type: Number, default: 0 },
  fullscreenExitCount: { type: Number, default: 0 },
  isAutoSubmitted: { type: Boolean, default: false },
});

const Submission =
  mongoose.models.Submission ||
  mongoose.model<SubmissionDocument>("Submission", SubmissionSchema);

export default Submission;
