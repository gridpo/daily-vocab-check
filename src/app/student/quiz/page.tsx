"use client";

import { useEffect, useMemo, useState } from "react";

type QuizItem = { id: string; prompt: string; word: { spelling: string } };
type Quiz = { id: string; items: QuizItem[]; status: "IN_PROGRESS" | "SUBMITTED"; totalScore: number };

export default function StudentQuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startAt, setStartAt] = useState<number>(Date.now());
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/quiz/today")
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data);
        setStartAt(Date.now());
      });
  }, []);

  const answered = useMemo(
    () => Object.values(answers).filter((v) => v.trim().length > 0).length,
    [answers]
  );

  if (!quiz) return <p>加载中...</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">今日单词测验</h1>
      <p className="text-sm text-gray-600">已作答 {answered}/{quiz.items.length}</p>

      {quiz.items.map((item, index) => (
        <div key={item.id} className="rounded bg-white p-3 shadow">
          <p className="mb-2 text-sm font-medium">
            {index + 1}. 根据中文写英文：{item.prompt}
          </p>
          <input
            className="w-full rounded border p-2"
            value={answers[item.id] ?? ""}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))}
            placeholder="输入英文拼写"
          />
        </div>
      ))}

      <button
        className="w-full rounded bg-blue-600 p-2 text-white"
        onClick={async () => {
          const duration = Math.round((Date.now() - startAt) / 1000);
          const result = await fetch("/api/quiz/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quizId: quiz.id, answers, duration })
          }).then((res) => res.json());
          setScore(result.totalScore);
        }}
      >
        提交测验
      </button>

      {score !== null && <p className="rounded bg-green-50 p-3 text-green-700">本次得分：{score}</p>}
    </section>
  );
}
