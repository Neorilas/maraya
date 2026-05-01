import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"])

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Solo nos importa /admin/*
  if (!pathname.startsWith("/admin")) return NextResponse.next()

  const isPublic = PUBLIC_ADMIN_PATHS.has(pathname)

  // Si entras a /admin/login estando logueado → al dashboard
  if (isPublic && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  // Si entras a /admin/* sin sesión → al login
  if (!isPublic && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
