import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import Exam from "@/models/Exam";
import "@/models/Question";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    let exams;
    if (session.user.role === "employer") {
      exams = await Exam.find({ createdBy: session.user.id })
        .populate("questionSets")
        .sort({ createdAt: -1 });
    } else {
      exams = await Exam.find({ status: "published" })
        .populate("questionSets")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, data: exams }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

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
    const exam = await Exam.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json({ success: true, data: exam }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
