import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountPage } from "@/components/account-page"

export const metadata: Metadata = {
  title: "My Account | Lenox Luxury Watches",
  description: "Manage your Lenox Luxury Watches account, view orders, and update your preferences.",
}

export default async function Account() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  return <AccountPage user={user} />
}
