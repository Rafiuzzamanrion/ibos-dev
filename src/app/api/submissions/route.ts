import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import Question from "@/models/Question";
import Exam from "@/models/Exam";
import { calculateScore } from "@/utils/calculateScore";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "candidate") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { examId, answers, tabSwitchCount, fullscreenExitCount, isAutoSubmitted } =
      body;

    const existingSubmission = await Submission.findOne({
      examId,
      candidateId: session.user.id,
    });

    if (existingSubmission) {
      return NextResponse.json(
        { success: false, message: "Already submitted" },
        { status: 400 }
      );
    }

    const questions = await Question.find({ examId });
    const exam = await Exam.findById(examId);

    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    const score = calculateScore(
      questions.map((q) => ({
        _id: q._id.toString(),
        examId: q.examId.toString(),
        title: q.title,
        type: q.type,
        options: q.options,
        score: q.score,
        createdAt: q.createdAt,
      })),
      answers,
      exam.negativeMarking
    );

    const submission = await Submission.create({
      examId,
      candidateId: session.user.id,
      answers,
      score,
      tabSwitchCount: tabSwitchCount || 0,
      fullscreenExitCount: fullscreenExitCount || 0,
      isAutoSubmitted: isAutoSubmitted || false,
    });

    return NextResponse.json(
      { success: true, data: submission },
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "employer") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("examId");

    if (!examId) {
      return NextResponse.json(
        { success: false, message: "examId is required" },
        { status: 400 }
      );
    }

    const submissions = await Submission.find({ examId })
      .populate("candidateId", "name email")
      .sort({ submittedAt: -1 });

    return NextResponse.json(
      { success: true, data: submissions },
      { status: 200 }
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
