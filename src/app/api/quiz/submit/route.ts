import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { gradeAnswer } from "@/lib/quiz-generator";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId, answers, duration } = await request.json();
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { items: true }
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  let totalScore = 0;
  for (const item of quiz.items) {
    const answer = String(answers[item.id] ?? "");
    const isCorrect = gradeAnswer(item.correctAnswer, answer);
    if (isCorrect) totalScore += 5;

    await prisma.quizItem.update({
      where: { id: item.id },
      data: { studentAnswer: answer, isCorrect }
    });

    if (!isCorrect) {
      await prisma.mistake.upsert({
        where: { studentId_wordId: { studentId: session.user.id, wordId: item.wordId } },
        create: { studentId: session.user.id, wordId: item.wordId, wrongCount: 1 },
        update: { wrongCount: { increment: 1 }, lastWrongAt: new Date() }
      });
    }
  }

  const result = await prisma.quiz.update({
    where: { id: quiz.id },
    data: { status: "SUBMITTED", totalScore, duration: Number(duration || 0) }
  });

  return NextResponse.json(result);
}
