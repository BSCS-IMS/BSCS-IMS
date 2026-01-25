import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'

export async function POST(request) {
  try {
    const { sku, locationName, quantity } = await request.json()

    if (!sku || !locationName || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const inventoryRef = collection(db, 'inventory')
    const q = query(
      inventoryRef,
      where('sku', '==', sku),
      where('locationName', '==', locationName)
    )

    const snap = await getDocs(q)

    if (snap.empty) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    const docSnap = snap.docs[0]
    const current = docSnap.data().quantity

    if (current < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    await updateDoc(docSnap.ref, {
      quantity: current - quantity,
      updatedAt: serverTimestamp()
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
