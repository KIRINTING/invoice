import DocumentForm from "@/components/DocumentForm";
import prisma from "@/lib/prisma";

export default async function NewDocumentPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">สร้างเอกสารใหม่</h1>
      <DocumentForm clients={clients} />
    </div>
  )
}

