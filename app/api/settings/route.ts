import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const settings = await prisma.setting.findMany();
  const config = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  
  // body is an object of key: value
  const promises = Object.entries(body).map(([key, value]) => {
    return prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });
  });

  await Promise.all(promises);
  
  return NextResponse.json({ success: true });
}

