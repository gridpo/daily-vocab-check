 HEAD
# daily-vocab-check
# Daily Vocab Check

一个面向英语老师的每日单词检查网页（手机优先），支持：

- 老师端：单词库管理、班级学习看板
- 学生端：每日测验、自动判分、错词本复习
- 账号体系：老师/学生角色登录

## Tech Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Credentials)

## Quick Start

1. 安装依赖
   - `npm install`
2. 配置环境变量
   - 复制 `.env.example` 为 `.env`
3. 初始化数据库
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`
4. 启动项目
   - `npm run dev`
5. 初始化演示账号和单词
   - `POST /api/setup`

## Default Demo Accounts

- `teacher@example.com / teacher123`
- `student@example.com / student123`

## Main Routes

- `/login`
- `/teacher/words`
- `/teacher/dashboard`
- `/student/quiz`
- `/student/mistakes`

## Deployment (Vercel)

1. 将代码推送到 Git 平台
2. 在 Vercel 导入项目
3. 配置环境变量：
   - `DATABASE_URL`
   - `AUTH_SECRET`
4. 执行 Prisma Migration（CI 或手动）
5. 部署后调用一次 `POST /api/setup`（或改为正式导入脚本）
 89082c8 (init daily-vocab-check)
