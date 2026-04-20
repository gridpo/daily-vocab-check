import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <form
      className="space-y-4 rounded-xl bg-white p-6 shadow"
      action={async (formData) => {
        "use server";
        await signIn("credentials", {
          email: formData.get("email"),
          password: formData.get("password"),
          redirectTo: "/student/quiz"
        });
      }}
    >
      <h1 className="text-xl font-semibold">登录</h1>
      <input name="email" placeholder="邮箱" className="w-full rounded border p-2" />
      <input name="password" type="password" placeholder="密码" className="w-full rounded border p-2" />
      <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white">
        进入系统
      </button>
    </form>
  );
}
