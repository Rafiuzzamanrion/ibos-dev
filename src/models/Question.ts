import mongoose, { Schema, Document } from "mongoose";

interface OptionSubdocument {
  text: string;
  isCorrect: boolean;
}

export interface QuestionDocument extends Document {
  examId: mongoose.Types.ObjectId;
  title: string;
  type: "checkbox" | "radio" | "text";
  options: OptionSubdocument[];
  score: number;
  createdAt: Date;
}

const OptionSchema = new Schema<OptionSubdocument>(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
);

const QuestionSchema = new Schema<QuestionDocument>({
  examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["checkbox", "radio", "text"], required: true },
  options: [OptionSchema],
  score: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

const Question =
  mongoose.models.Question ||
  mongoose.model<QuestionDocument>("Question", QuestionSchema);

export default Question;
