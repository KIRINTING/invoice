import DocumentForm from "@/components/DocumentForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await prisma.document.findUnique({ 
    where: { id },
    include: { items: true }
  });
  
  if (!document) return notFound();

  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">แก้ไขเอกสาร</h1>
      <DocumentForm initialData={document} clients={clients} />
    </div>
  )
}

