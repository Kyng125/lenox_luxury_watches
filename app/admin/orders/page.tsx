import { verifyAdminSession } from "@/lib/auth"
import { AdminOrderManagement } from "@/components/admin-order-management"

export default async function AdminOrdersPage() {
  await verifyAdminSession()

  return <AdminOrderManagement />
}
