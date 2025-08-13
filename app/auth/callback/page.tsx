import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const supabase = createClient()

  if (searchParams.code) {
    await supabase.auth.exchangeCodeForSession(searchParams.code)
  }

  // Redirect to account page after successful authentication
  redirect("/account")
}
