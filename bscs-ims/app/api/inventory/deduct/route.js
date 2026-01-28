import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(request) {
  try {
    const { productId, locationId, quantity } = await request.json()

    // Validate input
    if (!productId || !locationId || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const inventoryId = `${productId}_${locationId}`
    const inventoryRef = doc(db, 'inventory', inventoryId)
    const snap = await getDoc(inventoryRef)

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    const current = snap.data().quantity || 0
    if (current < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    await updateDoc(inventoryRef, {
      quantity: current - quantity,
      updatedAt: serverTimestamp()
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
