import { verifyAdminSession } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminDashboardPage() {
  await verifyAdminSession()

  return <AdminDashboard />
}
