import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountPage } from "@/components/account-page"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "My Account | Lenox Luxury Watches",
  description: "Manage your Lenox Luxury Watches account, view orders, and update your preferences.",
}

export default async function Account() {
  const supabase = await createClient()

  let user = null
  try {
    const {
      data: { user: userData },
    } = await supabase.auth.getUser()
    user = userData
  } catch (error) {
    console.error("Error fetching user:", error)
    redirect("/auth/login")
  }

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-black">
      <AccountPage user={user} />
      <Footer />
    </div>
  )
}
