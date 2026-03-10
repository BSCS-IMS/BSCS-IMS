export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { admin } from '@/app/lib/firebaseAdmin'
import { logAudit } from '@/app/lib/audit'

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

    const trimmedName = name.trim()

    // Check uniqueness (case-insensitive)
    const allLocationsSnapshot = await getDocs(collection(db, 'locations'))
    const existingLocation = allLocationsSnapshot.docs.find(
      doc => doc.data().name?.toLowerCase() === trimmedName.toLowerCase()
    )

    if (existingLocation) {
      return NextResponse.json(
        { success: false, error: `Location "${trimmedName}" already exists` },
        { status: 409 }
      )
    }

    const locationData = {
      name: trimmedName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdByEmail: session.email,
      createdByUid: session.uid,
    }

    const docRef = await addDoc(collection(db, 'locations'), locationData)

    await logAudit({
      action: 'CREATE',
      entityType: 'location',
      entityId: docRef.id,
      oldData: null,
      newData: locationData,
      performedById: session.uid,
    })

    return NextResponse.json({
      success: true,
      message: 'Location created successfully',
      id: docRef.id,
      name: trimmedName,
    }, { status: 201 })

  } catch (error) {
    console.error('POST /locations error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}