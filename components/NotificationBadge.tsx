"use client"
import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { th } from "date-fns/locale"

export default function NotificationBadge() {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(console.error)
  }, [])

  const overdue = notifications.filter(n => new Date(n.dueDate) < new Date())
  const upcoming = notifications.filter(n => new Date(n.dueDate) >= new Date())

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" className="relative" />}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <h4 className="font-semibold mb-3">การแจ้งเตือน</h4>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {overdue.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-500 mb-2">เกินกำหนดชำระ ({overdue.length})</p>
              {overdue.map(doc => (
                <Link key={doc.id} href={`/dashboard/documents/${doc.id}`} className="block text-sm p-2 bg-red-50 rounded hover:bg-red-100 mb-1">
                  <div className="font-medium text-gray-900">{doc.client.name}</div>
                  <div className="text-gray-500 flex justify-between">
                    <span>{doc.number}</span>
                    <span className="text-red-600">เกินมาแล้ว {Math.floor((new Date().getTime() - new Date(doc.dueDate).getTime()) / (1000 * 60 * 60 * 24))} วัน</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-yellow-600 mb-2">ใกล้ครบกำหนด ({upcoming.length})</p>
              {upcoming.map(doc => (
                <Link key={doc.id} href={`/dashboard/documents/${doc.id}`} className="block text-sm p-2 bg-yellow-50 rounded hover:bg-yellow-100 mb-1">
                  <div className="font-medium text-gray-900">{doc.client.name}</div>
                  <div className="text-gray-500 flex justify-between">
                    <span>{doc.number}</span>
                    <span>ครบ {format(new Date(doc.dueDate), 'dd MMM yyyy', { locale: th })}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">ไม่มีบิลที่ใกล้ครบกำหนดชำระ</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

