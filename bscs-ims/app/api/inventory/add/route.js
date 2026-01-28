import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'

export async function POST(request) {
  try {
    const { productId, locationId, quantity } = await request.json()

    // Input validation
    if (!productId || !locationId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    if (quantity < 0) {
      return NextResponse.json({ error: 'Quantity cannot be negative' }, { status: 400 })
    }

    // Use transaction to ensure data consistency
    const inventoryId = `${productId}_${locationId}`
    
    await runTransaction(db, async (transaction) => {
      // Check if product exists
      const productRef = doc(db, 'products', productId)
      const productSnap = await transaction.get(productRef)
      if (!productSnap.exists()) {
        throw new Error('Product not found')
      }

      // Check if location exists
      const locationRef = doc(db, 'locations', locationId)
      const locationSnap = await transaction.get(locationRef)
      if (!locationSnap.exists()) {
        throw new Error('Location not found')
      }

      // Get or create inventory record
      const inventoryRef = doc(db, 'inventory', inventoryId)
      const inventorySnap = await transaction.get(inventoryRef)

      if (inventorySnap.exists()) {
        // Update existing quantity
        const currentQty = inventorySnap.data().quantity || 0
        transaction.set(
          inventoryRef,
          {
            productId,
            locationId,
            quantity: currentQty + quantity,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        )
      } else {
        // Create new inventory record
        transaction.set(inventoryRef, {
          id: inventoryId,
          productId,
          locationId,
          quantity,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
    })

    return NextResponse.json({ success: true, inventoryId })
  } catch (err) {
    // Handle specific errors
    if (err.message === 'Product not found') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    if (err.message === 'Location not found') {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    
    console.error('Inventory update error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}