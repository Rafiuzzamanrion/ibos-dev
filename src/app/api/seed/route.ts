import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    await connectDB();

    const existingEmployer = await User.findOne({ email: "employer@test.com" });
    const existingCandidate = await User.findOne({ email: "candidate@test.com" });

    const results: string[] = [];

    if (!existingEmployer) {
      await User.create({
        name: "Arif Hossain",
        email: "employer@test.com",
        password: "password123",
        role: "employer",
      });
      results.push("Employer created");
    } else {
      results.push("Employer already exists");
    }

    if (!existingCandidate) {
      await User.create({
        name: "Jhon Smith",
        email: "candidate@test.com",
        password: "password123",
        role: "candidate",
      });
      results.push("Candidate created");
    } else {
      results.push("Candidate already exists");
    }

    return NextResponse.json(
      { success: true, message: results.join(", ") },
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
