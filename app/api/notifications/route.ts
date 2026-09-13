import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { startOfDay } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const today = startOfDay(new Date());

  // Find documents that are due soon or overdue
  // e.g. DRAFT or SENT (not PAID) and dueDate < today or dueDate <= 3 days from now
  const next3Days = new Date(today);
  next3Days.setDate(today.getDate() + 3);

  const notifications = await prisma.document.findMany({
    where: {
      status: { in: ['DRAFT', 'SENT', 'OVERDUE'] },
      dueDate: { lte: next3Days }
    },
    include: { client: true },
    orderBy: { dueDate: 'asc' }
  });

  return NextResponse.json(notifications);
}

