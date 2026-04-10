import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import Exam from "@/models/Exam";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "employer") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { examId, questions } = body;

    if (Array.isArray(questions)) {
      const createdQuestions = await Question.insertMany(
        questions.map((q: Record<string, unknown>) => ({ ...q, examId }))
      );

      const questionIds = createdQuestions.map((q) => q._id);
      await Exam.findByIdAndUpdate(examId, {
        $push: { questionSets: { $each: questionIds } },
      });

      return NextResponse.json(
        { success: true, data: createdQuestions },
        { status: 201 }
      );
    }

    const question = await Question.create({ ...body, examId });
    await Exam.findByIdAndUpdate(examId, {
      $push: { questionSets: question._id },
    });

    return NextResponse.json(
      { success: true, data: question },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
