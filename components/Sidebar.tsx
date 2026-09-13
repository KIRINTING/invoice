"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, UserCog, Settings } from "lucide-react";

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const links = [
    { name: "ภาพรวม (Dashboard)", href: "/dashboard", icon: LayoutDashboard },
    { name: "ลูกค้า", href: "/dashboard/clients", icon: Users },
    { name: "เอกสารทั้งหมด", href: "/dashboard/documents", icon: FileText },
  ];

  const docLinks = [
    { name: "สร้างใบเสนอราคา", href: "/dashboard/documents/new?type=QUOTATION" },
    { name: "สร้างใบแจ้งหนี้", href: "/dashboard/documents/new?type=INVOICE" },
    { name: "สร้างใบเสร็จรับเงิน", href: "/dashboard/documents/new?type=RECEIPT" },
  ];

  if (role === "ADMIN") {
    links.push({ name: "ผู้ใช้งาน", href: "/dashboard/users", icon: UserCog });
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shadow-xl">
      <div className="h-16 flex items-center px-6 bg-slate-950 text-white font-bold text-xl tracking-wide">
        <span className="text-blue-500 mr-2">✦</span> Invoicing
      </div>
      
      <div className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Menu
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard" && link.href !== "/dashboard/documents");
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
              {link.name}
            </Link>
          );
        })}

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">สร้างเอกสาร</p>
        </div>
        {docLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <span className="w-5 h-5 mr-3 flex items-center justify-center text-xs border border-slate-600 rounded text-slate-500">+</span>
            {link.name}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <Link href="/dashboard/settings" className="flex items-center text-sm font-medium text-slate-400 hover:text-white cursor-pointer px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
          <Settings className="mr-3 h-5 w-5" />
          การตั้งค่า
        </Link>
      </div>
    </aside>
  );
}

