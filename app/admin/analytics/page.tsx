import { verifyAdminSession } from "@/lib/auth"
import { AdminAnalytics } from "@/components/admin-analytics"

export default async function AdminAnalyticsPage() {
  await verifyAdminSession()

  return <AdminAnalytics />
}
