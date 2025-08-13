import { verifyAdminSession } from "@/lib/auth"
import { AdminProductList } from "@/components/admin-product-list"

export default async function AdminProductsPage() {
  await verifyAdminSession()

  return <AdminProductList />
}
