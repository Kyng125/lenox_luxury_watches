import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SignUpForm } from "@/components/signup-form"

export const metadata: Metadata = {
  title: "Create Account | Lenox Luxury Watches",
  description: "Create your Lenox Luxury Watches account for order tracking and exclusive offers.",
}

export default async function SignUpPage() {
  // Check if user is already logged in
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to account page
  if (session) {
    redirect("/account")
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <SignUpForm />
    </div>
  )
}
