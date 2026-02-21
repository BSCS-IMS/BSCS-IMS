export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { admin } from '@/app/lib/firebaseAdmin'

/* ==========================
   POST - logout
========================== */
export async function POST(req) {
  try {
    // Attempt to revoke the session in Firebase
    const token = req.cookies.get('session')?.value
    if (token) {
      try {
        const decoded = await admin.auth().verifySessionCookie(token)
        await admin.auth().revokeRefreshTokens(decoded.sub)
      } catch (err) {
        // Session may already be expired or invalid — still proceed with logout
        console.warn('Session revocation skipped:', err.message)
      }
    }

    // Clear the cookie with the same attributes it was set with
    const expiredCookie = serialize('session', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return NextResponse.json({ success: true, message: 'Logged out' }, {
      status: 200,
      headers: { 'Set-Cookie': expiredCookie },
    })

  } catch (error) {
    console.error('POST /logout error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}