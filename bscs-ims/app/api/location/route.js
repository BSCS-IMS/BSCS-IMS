export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { admin } from '@/app/lib/firebaseAdmin'

// Helper: verify session and return decoded token
async function getSession(req) {
  const token = req.cookies.get('session')?.value
  if (!token) return null

  try {
    return await admin.auth().verifySessionCookie(token, true)
  } catch (err) {
    console.error('Invalid session cookie:', err.message)
    return null
  }
}

/* ==========================
   GET - fetch all locations
========================== */
export async function GET(req) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const q = query(collection(db, 'locations'), orderBy('name', 'asc'))
    const snapshot = await getDocs(q)
    const locations = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

    return NextResponse.json({ success: true, locations })
  } catch (error) {
    console.error('GET /locations error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/* ==========================
   POST - create location
========================== */
export async function POST(req) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await req.json()

    // Validate input
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Location name must be a non-empty string' },
        { status: 400 }
      )
    }

    // Normalize — capitalize first letter only, preserve the rest
    const normalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1)

    // Check uniqueness
    const q = query(collection(db, 'locations'), where('name', '==', normalizedName))
    const existing = await getDocs(q)
    if (!existing.empty) {
      return NextResponse.json(
        { success: false, error: `Location "${normalizedName}" already exists` },
        { status: 409 }
      )
    }

    const docRef = await addDoc(collection(db, 'locations'), {
      name: normalizedName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdByEmail: session.email,
      createdByUid: session.uid,
    })

    return NextResponse.json({
      success: true,
      message: 'Location created successfully',
      id: docRef.id,
      name: normalizedName,
    }, { status: 201 })

  } catch (error) {
    console.error('POST /locations error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}