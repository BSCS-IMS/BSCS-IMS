import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const sku = url.pathname.split('/').pop()

    if (!sku) {
      return NextResponse.json({ success: false, error: 'Missing SKU' }, { status: 400 })
    }

    const inventoryRef = collection(db, 'inventory')
    const q = query(inventoryRef, where('sku', '==', sku))
    const snap = await getDocs(q)

    const stock = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ success: true, data: stock })
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
