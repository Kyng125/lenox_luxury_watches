import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request)

  // Handle admin routes - these bypass Supabase auth for now
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/dashboard")) {
    return supabaseResponse
  }

  // Handle auth routes - allow access without authentication
  if (request.nextUrl.pathname.startsWith("/auth/")) {
    return supabaseResponse
  }

  // Handle protected routes that require authentication
  if (
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/orders") ||
    request.nextUrl.pathname.startsWith("/wishlist")
  ) {
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
