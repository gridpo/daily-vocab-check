import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateTodayQuiz } from "@/lib/quiz-generator";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quiz = await generateTodayQuiz(session.user.id);
  return NextResponse.json(quiz);
}
