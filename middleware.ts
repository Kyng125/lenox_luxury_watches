import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip login page - allow access without admin session
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Check for admin session
    const adminSession = request.cookies.get("admin-session")

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Admin is authenticated, continue to admin route
    return NextResponse.next()
  }

  const supabaseResponse = await updateSession(request)
  return supabaseResponse
}

export const config = {
  matcher: [
    "/admin/:path*",
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
