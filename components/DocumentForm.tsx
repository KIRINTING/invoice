"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

export default function DocumentForm({ initialData = null, clients }: { initialData?: any, clients: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "QUOTATION"
  
  const [formData, setFormData] = useState({
    type: initialData?.type || defaultType,
    number: initialData?.number || "",
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
    status: initialData?.status || "DRAFT",
    clientId: initialData?.clientId || (clients.length > 0 ? clients[0].id : ""),
    taxRate: initialData?.taxRate !== undefined ? initialData.taxRate : 7,
    vatType: initialData?.vatType || "EXCLUSIVE", // EXCLUSIVE, INCLUSIVE, NONE
    discount: initialData?.discount || 0,
    notes: initialData?.notes || "",
  })

  const [items, setItems] = useState<any[]>(initialData?.items?.map((item:any) => ({
    id: item.id || crypto.randomUUID(),
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: item.amount
  })) || [
    { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, amount: 0 }
  ])

  const [loading, setLoading] = useState(false)

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          newItem.amount = (Number(newItem.quantity) || 0) * (Number(newItem.unitPrice) || 0)
        }
        return newItem
      }
      return item
    }))
  }

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, amount: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const afterDiscount = subtotal - formData.discount
  
  let taxAmount = 0
  let total = afterDiscount

  if (formData.vatType === "EXCLUSIVE") {
    taxAmount = (afterDiscount * formData.taxRate) / 100
    total = afterDiscount + taxAmount
  } else if (formData.vatType === "INCLUSIVE") {
    // If inclusive, the afterDiscount is the total, and we extract tax from it
    taxAmount = afterDiscount - (afterDiscount * 100 / (100 + formData.taxRate))
    // the total remains afterDiscount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientId) return alert("กรุณาเลือกลูกค้า")
    
    setLoading(true)
    
    const payload = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      subtotal,
      discount: formData.discount,
      vatType: formData.vatType,
      taxAmount,
      total,
      items: items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        amount: item.amount
      }))
    }

    const url = initialData ? `/api/documents/${initialData.id}` : "/api/documents"
    const method = initialData ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    
    if (res.ok) {
      router.push("/dashboard/documents")
      router.refresh()
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึก")
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if(!confirm("ต้องการลบเอกสารนี้ใช่หรือไม่?")) return;
    setLoading(true)
    await fetch(`/api/documents/${initialData.id}`, { method: "DELETE" })
    router.push("/dashboard/documents")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border shadow-sm">
        <div className="space-y-2">
          <Label>ประเภทเอกสาร</Label>
          <select 
            className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
            value={formData.type} 
            onChange={e => setFormData({...formData, type: e.target.value})}
          >
            <option value="QUOTATION">ใบเสนอราคา (Quotation)</option>
            <option value="INVOICE">ใบแจ้งหนี้ (Invoice)</option>
            <option value="RECEIPT">ใบเสร็จรับเงิน (Receipt)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>สถานะ</Label>
          <select 
            className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
            value={formData.status} 
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option value="DRAFT">ร่าง (Draft)</option>
            <option value="SENT">ส่งแล้ว (Sent)</option>
            <option value="PAID">ชำระแล้ว (Paid)</option>
            <option value="OVERDUE">เกินกำหนด (Overdue)</option>
            <option value="CANCELLED">ยกเลิก (Cancelled)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>เลขที่เอกสาร *</Label>
          <Input required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} placeholder="เช่น INV-2023-0001" />
        </div>
        <div className="space-y-2">
          <Label>ลูกค้า *</Label>
          <select 
            required
            className="w-full flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
            value={formData.clientId} 
            onChange={e => setFormData({...formData, clientId: e.target.value})}
          >
            <option value="" disabled>เลือกลูกค้า</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>วันที่</Label>
          <Input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>วันครบกำหนดชำระ</Label>
          <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-2">รายการสินค้า/บริการ</h3>
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="flex-1 space-y-2">
              <Label>รายละเอียด</Label>
              <Input required value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
            </div>
            <div className="w-24 space-y-2">
              <Label>จำนวน</Label>
              <Input type="number" min="1" required value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} />
            </div>
            <div className="w-32 space-y-2">
              <Label>ราคาต่อหน่วย</Label>
              <Input type="number" min="0" step="0.01" required value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} />
            </div>
            <div className="w-32 space-y-2">
              <Label>รวม (บาท)</Label>
              <div className="h-9 px-3 py-1 flex items-center bg-gray-50 border rounded-md text-sm">{item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
            <div className="pt-8">
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2">
          <Plus className="w-4 h-4 mr-2" /> เพิ่มรายการ
        </Button>

        <div className="border-t pt-4 mt-6 flex justify-end">
          <div className="w-80 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>รวมเป็นเงิน (Subtotal)</span>
              <span>{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span>ส่วนลด (Discount)</span>
              </div>
              <Input type="number" min="0" step="0.01" className="w-24 h-7 text-right" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} />
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">หลังหักส่วนลด</span>
              <span className="text-gray-500">{afterDiscount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>

            <div className="flex justify-between items-center text-sm border-t pt-2">
              <div className="flex flex-col gap-1 w-48">
                <select 
                  className="h-7 text-xs rounded border-gray-300 shadow-sm"
                  value={formData.vatType}
                  onChange={e => setFormData({...formData, vatType: e.target.value})}
                >
                  <option value="EXCLUSIVE">ภาษี 7% (คำนวณแยก)</option>
                  <option value="INCLUSIVE">ภาษี 7% (รวมในราคา)</option>
                  <option value="NONE">ไม่มีภาษี (0%)</option>
                </select>
              </div>
              <span>{formData.vatType === "NONE" ? "0.00" : taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>ยอดสุทธิ (Total)</span>
              <span>{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-2">
        <Label>หมายเหตุ</Label>
        <Textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="หมายเหตุเพิ่มเติมบนเอกสาร" />
      </div>
      
      <div className="flex justify-between pb-10">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/documents")}>ยกเลิก</Button>
        <div className="space-x-2">
          {initialData && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>ลบ</Button>
          )}
          <Button type="submit" disabled={loading}>{loading ? "กำลังบันทึก..." : "บันทึก"}</Button>
        </div>
      </div>
    </form>
  )
}

