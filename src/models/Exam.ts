import mongoose, { Schema, Document } from "mongoose";

export interface ExamDocument extends Document {
  title: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: mongoose.Types.ObjectId[];
  questionType: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  negativeMarking: boolean;
  createdBy: mongoose.Types.ObjectId;
  status: "draft" | "published";
  createdAt: Date;
}

const ExamSchema = new Schema<ExamDocument>({
  title: { type: String, required: true },
  totalCandidates: { type: Number, required: true },
  totalSlots: { type: Number, required: true },
  questionSets: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  questionType: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  negativeMarking: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

const Exam =
  mongoose.models.Exam || mongoose.model<ExamDocument>("Exam", ExamSchema);

export default Exam;
