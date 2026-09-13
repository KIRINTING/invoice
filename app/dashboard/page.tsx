import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, AlertCircle, CheckCircle2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const clientsCount = await prisma.client.count();
  
  const documents = await prisma.document.findMany();
  
  const unpaidInvoices = documents.filter(d => d.type === 'INVOICE' && (d.status === 'SENT' || d.status === 'DRAFT' || d.status === 'OVERDUE'));
  const totalUnpaid = unpaidInvoices.reduce((sum, doc) => sum + doc.total, 0);

  const paidInvoices = documents.filter(d => d.type === 'INVOICE' && d.status === 'PAID');
  const totalPaid = paidInvoices.reduce((sum, doc) => sum + doc.total, 0);

  const overdueInvoices = documents.filter(d => d.type === 'INVOICE' && d.status === 'OVERDUE');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">ภาพรวมระบบ (Dashboard)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">จำนวนลูกค้าทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientsCount} ราย</div>
            <Link href="/dashboard/clients" className="text-xs text-blue-600 hover:underline mt-1 block">ดูทั้งหมด</Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">ยอดรอชำระ (Invoices)</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnpaid.toLocaleString(undefined, {minimumFractionDigits: 2})} ฿</div>
            <p className="text-xs text-gray-500 mt-1">{unpaidInvoices.length} รายการ</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">ยอดชำระแล้ว (Invoices)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2})} ฿</div>
            <p className="text-xs text-gray-500 mt-1">{paidInvoices.length} รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">บิลเกินกำหนด</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueInvoices.length} รายการ</div>
            <Link href="/dashboard/documents" className="text-xs text-blue-600 hover:underline mt-1 block">จัดการบิล</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
