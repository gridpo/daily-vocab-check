import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const teacherPassword = await bcrypt.hash("teacher123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      name: "Teacher",
      email: "teacher@example.com",
      password: teacherPassword,
      role: "TEACHER"
    }
  });

  await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      name: "Student",
      email: "student@example.com",
      password: studentPassword,
      role: "STUDENT"
    }
  });

  const seedWords = [
    ["apple", "苹果", "Unit1"],
    ["bridge", "桥", "Unit1"],
    ["careful", "小心的", "Unit1"],
    ["discover", "发现", "Unit2"],
    ["energy", "能量", "Unit2"]
  ];

  for (const [spelling, meaningZh, unit] of seedWords) {
    await prisma.word.create({
      data: { spelling, meaningZh, unit, createdBy: teacher.id, difficulty: 1 }
    }).catch(() => null);
  }

  return NextResponse.json({
    ok: true,
    users: ["teacher@example.com / teacher123", "student@example.com / student123"]
  });
}
