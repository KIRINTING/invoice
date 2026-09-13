import ClientForm from "@/components/ClientForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  
  if (!client) return notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">แก้ไขข้อมูลลูกค้า</h1>
      <ClientForm initialData={client} />
    </div>
  )
}

