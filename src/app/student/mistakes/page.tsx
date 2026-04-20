import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MistakesPage() {
  const session = await auth();
  if (!session?.user?.id) return <p>请先登录。</p>;

  const mistakes = await prisma.mistake.findMany({
    where: { studentId: session.user.id },
    include: { word: true },
    orderBy: [{ wrongCount: "desc" }, { lastWrongAt: "desc" }]
  });

  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold">错词本</h1>
      {mistakes.map((m) => (
        <div key={m.id} className="rounded bg-white p-3 shadow">
          <p className="font-medium">{m.word.spelling}</p>
          <p className="text-sm text-gray-600">{m.word.meaningZh}</p>
          <p className="text-xs text-red-500">错误次数：{m.wrongCount}</p>
        </div>
      ))}
    </section>
  );
}
