import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const inventoryRef = collection(db, 'inventory')
    const snap = await getDocs(inventoryRef)

    const stocks = await Promise.all(
      snap.docs.map(async (docSnap) => {
        const data = docSnap.data()

        // Fetch product name
        const productSnap = await getDoc(doc(db, 'products', data.productId))
        const productName = productSnap.exists() ? productSnap.data().name : 'Unknown Product'

        // Fetch location name
        const locationSnap = await getDoc(doc(db, 'locations', data.locationId))
        const locationName = locationSnap.exists() ? locationSnap.data().name : 'Unknown Location'

        return {
          id: docSnap.id,
          productId: data.productId,
          locationId: data.locationId,
          locationName,
          productName,
          quantity: data.quantity
        }
      })
    )

    return NextResponse.json({ success: true, data: stocks })
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    )
  }
}
