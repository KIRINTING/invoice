import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PDFClient from "./PDFClient";

export default async function DocumentPDFPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await prisma.document.findUnique({ 
    where: { id },
    include: { items: true, client: true }
  });
  
  if (!document) return notFound();

  return <PDFClient data={document} />
}
