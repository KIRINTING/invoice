import DocumentForm from "@/components/DocumentForm";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NewDocumentPage({ searchParams }: { searchParams: Promise<{ type?: string, fromId?: string }> }) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'ADMIN';

  const { type, fromId } = await searchParams;
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } });
  
  const sourceDocs = await prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: true }
  });

  let initialData = null;
  if (fromId) {
    const sourceDoc = await prisma.document.findUnique({
      where: { id: fromId },
      include: { items: true }
    });
    
    if (sourceDoc) {
      initialData = {
        ...sourceDoc,
        id: undefined, // undefined so it creates a new document
        number: "", 
        type: type || (sourceDoc.type === 'QUOTATION' ? 'INVOICE' : 'RECEIPT'),
        status: "DRAFT",
        date: new Date().toISOString(),
        dueDate: null
      };
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">สร้างเอกสารใหม่ {initialData && "(คัดลอกข้อมูลเดิม)"}</h1>
      <DocumentForm key={fromId || 'new'} clients={clients} initialData={initialData} isAdmin={isAdmin} sourceDocs={sourceDocs} />
    </div>
  )
}

