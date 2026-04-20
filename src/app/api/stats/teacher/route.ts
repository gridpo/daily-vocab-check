import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    where: { status: "SUBMITTED" },
    include: { student: true, items: { include: { word: true } } }
  });

  const total = quizzes.length;
  const avgScore = total ? Math.round(quizzes.reduce((sum, q) => sum + q.totalScore, 0) / total) : 0;

  const weakMap = new Map<string, number>();
  quizzes.forEach((q) =>
    q.items.forEach((item) => {
      if (!item.isCorrect) {
        const key = item.word.spelling;
        weakMap.set(key, (weakMap.get(key) ?? 0) + 1);
      }
    })
  );

  const weakWords = [...weakMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, wrongCount]) => ({ word, wrongCount }));

  return NextResponse.json({ totalSubmitted: total, avgScore, weakWords });
}
