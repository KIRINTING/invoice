"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UserActions({ userId, currentRole }: { userId: string, currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleRole = async () => {
    if (!confirm(`ต้องการเปลี่ยนสิทธิ์ผู้ใช้นี้เป็น ${currentRole === 'ADMIN' ? 'USER' : 'ADMIN'} หรือไม่?`)) return;
    
    setLoading(true);
    await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: currentRole === 'ADMIN' ? 'USER' : 'ADMIN' })
    });
    setLoading(false);
    router.refresh();
  };

  const deleteUser = async () => {
    if (!confirm("คำเตือน: คุณต้องการลบบัญชีผู้ใช้นี้ใช่หรือไม่? (การลบจะไม่สามารถกู้คืนได้)")) return;
    
    setLoading(true);
    await fetch(`/api/users/${userId}`, {
      method: "DELETE"
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={toggleRole} disabled={loading}>
        สลับสิทธิ์
      </Button>
      <Button variant="destructive" size="sm" onClick={deleteUser} disabled={loading}>
        ลบ
      </Button>
    </div>
  );
}

