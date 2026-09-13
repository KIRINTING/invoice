import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import NotificationBadge from "@/components/NotificationBadge";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role={session.user.role} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b shadow-sm sticky top-0 z-10 flex items-center justify-between px-6 lg:px-8">
          <div className="font-medium text-slate-800">
            ระบบออกเอกสาร (Quoting & Invoicing)
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationBadge />
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold text-slate-700">{session.user.name || "ผู้ใช้งาน"}</span>
              <span className="text-xs text-slate-500">{session.user.email}</span>
            </div>
            <div className="pl-2">
              <LogoutButton />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
