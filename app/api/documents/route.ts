import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const documents = await prisma.document.findMany({ 
    orderBy: { createdAt: 'desc' },
    include: { client: true }
  });
  return NextResponse.json(documents);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { items, ...documentData } = body;
    
    documentData.userId = session.user.id;
    
    const document = await prisma.document.create({ 
      data: {
        ...documentData,
        items: {
          create: items
        }
      },
      include: { items: true, client: true }
    });
    return NextResponse.json(document);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error creating document", { status: 500 });
  }
}

