import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4 rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">每日单词检查系统</h1>
      <p className="text-sm text-gray-600">手机优先设计，支持学生每日自测、错词复习与老师看板。</p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-white">
          登录
        </Link>
        <Link href="/student/quiz" className="rounded border px-4 py-2">
          学生入口
        </Link>
      </div>
    </section>
  );
}
