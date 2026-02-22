import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/firebase/server'

export async function POST(request: NextRequest) {
  const req = await request.json()
  const { idToken } = req

  if (!idToken) {
    return NextResponse.json({ isLogged: false }, { status: 400 })
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    })
    const cookieStore = await cookies()
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    return NextResponse.json({ isLogged: true }, { status: 200 })
  } catch (error) {
    console.error('Error creating session cookie:', error)
    return NextResponse.json({ isLogged: false }, { status: 401 })
  }
}
