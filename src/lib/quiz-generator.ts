import { prisma } from "@/lib/prisma";

const DAILY_QUIZ_SIZE = 20;

export async function generateTodayQuiz(studentId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.quiz.findUnique({
    where: { studentId_date: { studentId, date: today } },
    include: { items: true }
  });
  if (existing) return existing;

  const mistakes = await prisma.mistake.findMany({
    where: { studentId },
    include: { word: true },
    orderBy: [{ wrongCount: "desc" }, { lastWrongAt: "desc" }],
    take: 10
  });
  const mistakeWords = mistakes.map((m) => m.word);

  const freshWords = await prisma.word.findMany({
    where: { id: { notIn: mistakeWords.map((w) => w.id) } },
    take: Math.max(0, DAILY_QUIZ_SIZE - mistakeWords.length)
  });

  const selected = [...mistakeWords, ...freshWords].slice(0, DAILY_QUIZ_SIZE);

  const quiz = await prisma.quiz.create({
    data: {
      studentId,
      date: today,
      items: {
        create: selected.map((word) => ({
          wordId: word.id,
          questionType: "SPELLING",
          prompt: word.meaningZh,
          correctAnswer: word.spelling
        }))
      }
    },
    include: { items: { include: { word: true } } }
  });

  return quiz;
}

export function gradeAnswer(correct: string, answer: string) {
  return correct.trim().toLowerCase() === answer.trim().toLowerCase();
}
