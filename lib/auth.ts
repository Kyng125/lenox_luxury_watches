import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simple admin credentials - in production, use proper authentication
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "lenox2024", // In production, hash this password
}

export async function verifyAdminSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")

  if (!session || session.value !== "authenticated") {
    redirect("/admin/login")
  }
}

export async function createAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set("admin-session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
}

export function validateAdminCredentials(username: string, password: string) {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}
