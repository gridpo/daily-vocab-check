import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const wordSchema = z.object({
  spelling: z.string().min(1),
  meaningZh: z.string().min(1),
  pos: z.string().optional(),
  example: z.string().optional(),
  difficulty: z.number().int().min(1).max(5).default(1),
  unit: z.string().min(1)
});

export async function GET() {
  const words = await prisma.word.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(words);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await request.json();
  const parsed = wordSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const word = await prisma.word.create({
    data: {
      ...parsed.data,
      createdBy: session.user.id
    }
  });

  return NextResponse.json(word);
}
