"use client";

import { useEffect, useState } from "react";

type Word = {
  id: string;
  spelling: string;
  meaningZh: string;
  unit: string;
  difficulty: number;
};

export default function TeacherWordsPage() {
  const [words, setWords] = useState<Word[]>([]);

  async function loadWords() {
    const data = await fetch("/api/words").then((res) => res.json());
    setWords(data);
  }

  useEffect(() => {
    loadWords();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">单词库管理</h1>
      <form
        className="grid gap-2 rounded bg-white p-4 shadow"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const payload = {
            spelling: (form.elements.namedItem("spelling") as HTMLInputElement).value,
            meaningZh: (form.elements.namedItem("meaningZh") as HTMLInputElement).value,
            unit: (form.elements.namedItem("unit") as HTMLInputElement).value,
            difficulty: Number((form.elements.namedItem("difficulty") as HTMLInputElement).value || 1)
          };
          await fetch("/api/words", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          form.reset();
          loadWords();
        }}
      >
        <input name="spelling" placeholder="单词" className="rounded border p-2" required />
        <input name="meaningZh" placeholder="中文释义" className="rounded border p-2" required />
        <input name="unit" placeholder="分组/单元" className="rounded border p-2" required />
        <input name="difficulty" type="number" min={1} max={5} defaultValue={1} className="rounded border p-2" />
        <button type="submit" className="rounded bg-blue-600 p-2 text-white">
          新增单词
        </button>
      </form>
      <ul className="space-y-2">
        {words.map((word) => (
          <li key={word.id} className="rounded bg-white p-3 shadow">
            <p className="font-medium">{word.spelling}</p>
            <p className="text-sm text-gray-600">
              {word.meaningZh} · {word.unit} · 难度 {word.difficulty}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
