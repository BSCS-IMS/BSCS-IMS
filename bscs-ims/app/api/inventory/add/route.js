import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
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

    if (!snap.empty) {
      // Update existing stock
      const docRef = snap.docs[0].ref
      const current = snap.docs[0].data().quantity

      await updateDoc(docRef, {
        quantity: current + quantity,
        updatedAt: serverTimestamp()
      })
    } else {
      // Create new stock record
      await addDoc(inventoryRef, {
        sku,
        locationName,
        quantity,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
