import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(_: NextRequest) {
  const cookieStore = await cookies()
  cookieStore.delete('portal_session')
  cookieStore.delete('session')
  return NextResponse.json({ isLogged: false }, { status: 200 })
}
