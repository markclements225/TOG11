import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET })

  const { pathname } = req.nextUrl

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Redirect user to login page if no token AND are requesting protected route

  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login')
  }
}
