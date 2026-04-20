"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalSubmitted: number;
  avgScore: number;
  weakWords: { word: string; wrongCount: number }[];
};

export default function TeacherDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats/teacher")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>加载中...</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">老师看板</h1>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded bg-white p-3 shadow">
          <p className="text-xs text-gray-500">已提交测验</p>
          <p className="text-xl font-bold">{stats.totalSubmitted}</p>
        </div>
        <div className="rounded bg-white p-3 shadow">
          <p className="text-xs text-gray-500">平均分</p>
          <p className="text-xl font-bold">{stats.avgScore}</p>
        </div>
      </div>
      <div className="rounded bg-white p-4 shadow">
        <p className="mb-2 font-medium">薄弱词 Top 10</p>
        <ul className="space-y-1 text-sm">
          {stats.weakWords.map((item) => (
            <li key={item.word}>
              {item.word}（错误 {item.wrongCount} 次）
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
