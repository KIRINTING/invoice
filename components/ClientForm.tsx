"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ClientForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    taxId: initialData?.taxId || ""
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const url = initialData ? `/api/clients/${initialData.id}` : "/api/clients"
    const method = initialData ? "PUT" : "POST"

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    
    router.push("/dashboard/clients")
    router.refresh()
  }

  const handleDelete = async () => {
    if(!confirm("ต้องการลบลูกค้านี้ใช่หรือไม่? (หากลบ เอกสารที่ผูกกับลูกค้าจะได้รับผลกระทบ)")) return;
    setLoading(true)
    await fetch(`/api/clients/${initialData.id}`, { method: "DELETE" })
    router.push("/dashboard/clients")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-white p-6 rounded-lg border shadow-sm">
      <div className="space-y-2">
        <Label>ชื่อลูกค้า / บริษัท *</Label>
        <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>อีเมล</Label>
          <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>เบอร์โทรศัพท์</Label>
          <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>เลขประจำตัวผู้เสียภาษี</Label>
        <Input value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>ที่อยู่</Label>
        <Textarea rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/clients")}>ยกเลิก</Button>
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

