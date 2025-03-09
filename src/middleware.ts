// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/cart',
  '/dashboard',
  '/admin-dashboard',
  '/settings'
]

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  const isLoggedIn = !!token
  const path = request.nextUrl.pathname
  
  // Check if current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    path === route || path.startsWith(`${route}/`)
  )

  // If user is NOT logged in and tries to access a protected route,
  // redirect them to login page
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/log-in', request.url))
  }

  // Allow the request to continue for all other cases
  return NextResponse.next()
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    '/cart/:path*',
    '/dashboard/:path*',
    '/admin-dashboard/:path*',
    '/settings/:path*'
  ]
}