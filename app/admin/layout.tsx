import type React from "react"
import { verifyAdminSession } from "@/lib/auth"
import { AdminLayout } from "@/components/admin-layout"

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  await verifyAdminSession()

  return <AdminLayout>{children}</AdminLayout>
}
