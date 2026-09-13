import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const document = await prisma.document.findUnique({ 
    where: { id },
    include: { items: true, client: true, user: true }
  });
  return NextResponse.json(document);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { items, ...documentData } = body;
    
    await prisma.item.deleteMany({ where: { documentId: id } });
    
    const document = await prisma.document.update({ 
      where: { id }, 
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
    return new NextResponse("Error updating document", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    await prisma.document.delete({ where: { id } });
    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error deleting document", { status: 500 });
  }
}

