import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6 md:max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}
