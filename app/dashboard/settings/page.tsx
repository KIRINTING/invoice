import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">การตั้งค่าระบบ</h1>
      <SettingsForm />
    </div>
  )
}

