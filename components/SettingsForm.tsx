"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyTaxId: "",
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setFormData({
          companyName: data.companyName || "",
          companyAddress: data.companyAddress || "",
          companyPhone: data.companyPhone || "",
          companyTaxId: data.companyTaxId || "",
        })
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      alert("บันทึกการตั้งค่าเรียบร้อยแล้ว")
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึก")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">ข้อมูลบริษัท (Company Profile)</h2>
      <p className="text-sm text-gray-500 mb-6">ข้อมูลนี้จะถูกนำไปแสดงบนหัวเอกสาร PDF (ใบเสนอราคา, ใบแจ้งหนี้, ใบเสร็จ)</p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>ชื่อบริษัท / ร้านค้า</Label>
          <Input 
            value={formData.companyName} 
            onChange={e => setFormData({...formData, companyName: e.target.value})} 
            placeholder="ตัวอย่าง: บริษัท เอบีซี จำกัด" 
          />
        </div>
        
        <div className="space-y-2">
          <Label>ที่อยู่</Label>
          <Textarea 
            rows={3} 
            value={formData.companyAddress} 
            onChange={e => setFormData({...formData, companyAddress: e.target.value})} 
            placeholder="ตัวอย่าง: 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>เบอร์โทรศัพท์</Label>
            <Input 
              value={formData.companyPhone} 
              onChange={e => setFormData({...formData, companyPhone: e.target.value})} 
              placeholder="ตัวอย่าง: 02-123-4567" 
            />
          </div>
          
          <div className="space-y-2">
            <Label>เลขประจำตัวผู้เสียภาษี</Label>
            <Input 
              value={formData.companyTaxId} 
              onChange={e => setFormData({...formData, companyTaxId: e.target.value})} 
              placeholder="ตัวอย่าง: 0105555555555" 
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
        </Button>
      </div>
    </form>
  )
}

