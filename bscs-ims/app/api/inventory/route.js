export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, query, where, doc, deleteDoc, getDoc } from 'firebase/firestore'
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
   GET - fetch all inventory
========================== */
export async function GET(req) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    const filterLocationId = searchParams.get('locationId') || ''
    const filterProductId = searchParams.get('productId') || ''
    const sort = searchParams.get('sort') || ''

    // Fetch all data in parallel
    const [inventorySnap, productsSnap, locationsSnap] = await Promise.all([
      getDocs(collection(db, 'inventory')),
      getDocs(query(collection(db, 'products'), where('isActive', '==', true))),
      getDocs(collection(db, 'locations')),
    ])

    const productMap = new Map(productsSnap.docs.map((d) => [d.id, d.data()]))
    const locationMap = new Map(locationsSnap.docs.map((d) => [d.id, d.data()]))

    let stocks = inventorySnap.docs.map((docSnap) => {
      const data = docSnap.data()
      const product = productMap.get(data.productId)
      const location = locationMap.get(data.locationId)
      return {
        id: docSnap.id,
        productId: data.productId,
        productName: product?.name ?? 'Unknown Product',
        productImage: product?.imageUrl ?? null,
        locationId: data.locationId,
        locationName: location?.name ?? 'Unknown Location',
        quantity: data.quantity ?? 0,
        createdAt: data.createdAt,
      }
    })

    // Apply filters
    if (search) {
      stocks = stocks.filter((s) =>
        s.locationName.toLowerCase().includes(search) ||
        s.productName.toLowerCase().includes(search)
      )
    }
    if (filterLocationId) {
      stocks = stocks.filter((s) => s.locationId === filterLocationId)
    }
    if (filterProductId) {
      stocks = stocks.filter((s) => s.productId === filterProductId)
    }

    // Apply sort
    if (sort === 'asc') {
      stocks.sort((a, b) => a.locationName.localeCompare(b.locationName))
    } else if (sort === 'desc') {
      stocks.sort((a, b) => b.locationName.localeCompare(a.locationName))
    } else {
      // Default: newest first
      stocks.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0
        return bTime - aTime
      })
    }

    return NextResponse.json({ success: true, data: stocks })
  } catch (error) {
    console.error('GET /inventory error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/* ==========================
   DELETE - hard delete inventory document
========================== */
export async function DELETE(req) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, locationId } = await req.json()

    if (!productId || !locationId) {
      return NextResponse.json(
        { success: false, error: 'productId and locationId are required' },
        { status: 400 }
      )
    }

    const inventoryId = `${productId}_${locationId}`
    const inventoryRef = doc(db, 'inventory', inventoryId)
    const snapshot = await getDoc(inventoryRef)

    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, error: 'Inventory not found' }, { status: 404 })
    }

    const oldData = snapshot.data()

    // Fetch product and location names for audit log
    const [productSnap, locationSnap] = await Promise.all([
      getDoc(doc(db, 'products', productId)),
      getDoc(doc(db, 'locations', locationId))
    ])

    const productName = productSnap.exists() ? productSnap.data().name : 'Unknown Product'
    const locationName = locationSnap.exists() ? locationSnap.data().name : 'Unknown Location'

    await deleteDoc(inventoryRef)

    await logAudit({
      action: 'DELETE',
      entityType: 'inventory',
      entityId: inventoryId,
      oldData: { ...oldData, productName, locationName },
      newData: null,
      performedById: session.uid,
    })

    return NextResponse.json({ success: true, message: 'Inventory deleted successfully' })
  } catch (error) {
    console.error('DELETE /inventory error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}