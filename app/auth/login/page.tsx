import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Sign In | Lenox Luxury Watches",
  description: "Sign in to your Lenox Luxury Watches account for order tracking and exclusive offers.",
}

export default async function LoginPage() {
  try {
    // Check if user is already logged in
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If user is logged in, redirect to account page
    if (session) {
      redirect("/account")
    }
  } catch (error) {
    // Handle auth errors gracefully during SSR
    console.error("Auth check failed:", error)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  )
}
