export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
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
   POST - deduct stock from inventory
========================== */
export async function POST(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, locationId, quantity } = await request.json()

    // Input validation
    if (!productId || !locationId) {
      return NextResponse.json(
        { success: false, error: 'productId and locationId are required' },
        { status: 400 }
      )
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be a positive number' },
        { status: 400 }
      )
    }

    const inventoryId = `${productId}_${locationId}`
    let finalQuantity = 0
    let oldInventoryData = null
    let productName = ''
    let locationName = ''

    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, 'products', productId)
      const locationRef = doc(db, 'locations', locationId)
      const inventoryRef = doc(db, 'inventory', inventoryId)

      const [productSnap, locationSnap, inventorySnap] = await Promise.all([
        transaction.get(productRef),
        transaction.get(locationRef),
        transaction.get(inventoryRef),
      ])

      // Validate product
      if (!productSnap.exists()) {
        throw new Error('Product not found')
      }
      if (!productSnap.data().isActive) {
        throw new Error('Product is inactive')
      }

      // Validate location
      if (!locationSnap.exists()) {
        throw new Error('Location not found')
      }

      // Validate inventory
      if (!inventorySnap.exists()) {
        throw new Error('Stock not found')
      }

      // Store names for audit log
      productName = productSnap.data().name
      locationName = locationSnap.data().name

      const currentQty = inventorySnap.data().quantity ?? 0
      oldInventoryData = inventorySnap.data()
      if (currentQty < quantity) {
        throw new Error('Insufficient stock')
      }

      finalQuantity = currentQty - quantity

      transaction.update(inventoryRef, {
        quantity: finalQuantity,
        updatedAt: serverTimestamp(),
        updatedByEmail: session.email,
        updatedByUid: session.uid,
      })
    })

    await logAudit({
      action: 'UPDATE',
      entityType: 'inventory',
      entityId: inventoryId,
      oldData: { ...oldInventoryData, productName, locationName },
      newData: { quantity: finalQuantity, productName, locationName },
      performedById: session.uid,
    })

    return NextResponse.json({
      success: true,
      inventoryId,
      finalQuantity,
    })

  } catch (err) {
    if (err.message === 'Product not found') {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }
    if (err.message === 'Product is inactive') {
      return NextResponse.json({ success: false, error: 'Product is inactive' }, { status: 400 })
    }
    if (err.message === 'Stock not found') {
      return NextResponse.json({ success: false, error: 'Stock not found' }, { status: 404 })
    }
    if (err.message === 'Insufficient stock') {
      return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 })
    }

    console.error('POST /inventory/deduct error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}