export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc, updateDoc, serverTimestamp, query, collection, where, getDocs, writeBatch } from 'firebase/firestore'
import { admin } from '@/app/lib/firebaseAdmin'
import { logAudit } from '@/app/lib/audit'

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
   PUT - rename a location
========================== */
export async function PUT(req, { params }) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { name } = await req.json()

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Location name must be a non-empty string' },
        { status: 400 }
      )
    }

    const normalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1)

    // Check location exists
    const locationRef = doc(db, 'locations', id)
    const locationSnap = await getDoc(locationRef)
    if (!locationSnap.exists()) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 })
    }

    const oldData = locationSnap.data()

    // Check name uniqueness (excluding current doc)
    const q = query(collection(db, 'locations'), where('name', '==', normalizedName))
    const existing = await getDocs(q)
    const conflict = existing.docs.find((d) => d.id !== id)
    if (conflict) {
      return NextResponse.json(
        { success: false, error: `Location "${normalizedName}" already exists` },
        { status: 409 }
      )
    }

    const updateData = {
      name: normalizedName,
      updatedAt: serverTimestamp(),
      updatedByEmail: session.email,
      updatedByUid: session.uid,
    }

    await updateDoc(locationRef, updateData)

    await logAudit({
      action: 'UPDATE',
      entityType: 'location',
      entityId: id,
      oldData,
      newData: updateData,
      performedById: session.uid,
    })


    return NextResponse.json({ success: true, id, name: normalizedName })
  } catch (error) {
    console.error('PUT /location/[id] error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/* ==========================
   DELETE - delete all inventory for a location
========================== */
export async function DELETE(req, { params }) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check location exists
    const locationRef = doc(db, 'locations', id)
    const locationSnap = await getDoc(locationRef)
    if (!locationSnap.exists()) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 })
    }

    const locationData = locationSnap.data()

    // Find all inventory records for this location
    const inventoryQuery = query(collection(db, 'inventory'), where('locationId', '==', id))
    const inventorySnap = await getDocs(inventoryQuery)

    if (inventorySnap.empty) {
      return NextResponse.json({
        success: true,
        message: 'No inventory found at this location',
        deletedCount: 0
      })
    }

    // Delete all inventory records in a batch
    const batch = writeBatch(db)
    const inventoryRecords = []

    inventorySnap.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref)
      inventoryRecords.push({ id: docSnap.id, ...docSnap.data() })
    })

    await batch.commit()

    // Log audit for the location inventory clearing
    await logAudit({
      action: 'DELETE',
      entityType: 'inventory-location',
      entityId: id,
      oldData: {
        location: locationData,
        inventoryRecords
      },
      newData: null,
      performedById: session.uid,
    })

    return NextResponse.json({
      success: true,
      message: `Cleared ${inventorySnap.size} inventory record(s) from "${locationData.name}"`,
      deletedCount: inventorySnap.size
    })
  } catch (error) {
    console.error('DELETE /location/[id] error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}