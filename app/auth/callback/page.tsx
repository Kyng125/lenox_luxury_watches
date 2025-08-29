import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string; error?: string }
}) {
  const supabase = await createClient()

  if (searchParams.error) {
    console.error("Auth callback error:", searchParams.error)
    redirect("/auth/login?error=Authentication failed")
  }

  if (searchParams.code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code)

      if (error) {
        console.error("Session exchange error:", error)
        redirect("/auth/login?error=Session creation failed")
      }
    } catch (error) {
      console.error("Auth callback error:", error)
      redirect("/auth/login?error=Authentication failed")
    }
  }

  // Redirect to account page after successful authentication
  redirect("/account")
}
