import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import PDFModal from "@/components/PDFModal";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const documents = await prisma.document.findMany({ 
    orderBy: { createdAt: 'desc' },
    include: { client: true, items: true }
  });

  const settingsArray = await prisma.setting.findMany();
  const settings = settingsArray.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {});

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-red-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'QUOTATION': return 'ใบเสนอราคา';
      case 'INVOICE': return 'ใบแจ้งหนี้';
      case 'RECEIPT': return 'ใบเสร็จรับเงิน';
      default: return type;
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">เอกสารทั้งหมด</h1>
        <Link href="/dashboard/documents/new">
          <Button>สร้างเอกสารใหม่</Button>
        </Link>
      </div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>เลขที่เอกสาร</TableHead>
              <TableHead>ประเภท</TableHead>
              <TableHead>ลูกค้า</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>ยอดรวม (บาท)</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map(doc => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.number}</TableCell>
                <TableCell>{getTypeLabel(doc.type)}</TableCell>
                <TableCell>{doc.client.name}</TableCell>
                <TableCell>{format(new Date(doc.date), 'dd MMM yyyy', { locale: th })}</TableCell>
                <TableCell>{doc.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </TableCell>
                <TableCell className="space-x-3">
                  <Link href={`/dashboard/documents/${doc.id}`} className="text-blue-600 hover:underline text-sm mr-2">แก้ไข</Link>
                  <PDFModal document={doc} settings={settings} />
                </TableCell>
              </TableRow>
            ))}
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">ไม่มีข้อมูลเอกสาร</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

