import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'

export async function POST(request) {
  try {
    const body = await request.json()

    const {
      name,
      imageUrl,
      sku,
      currentPrice,
      priceUnit,
      isActive = true
    } = body

    // Basic validation
    if (!name || !sku || !imageUrl || !priceUnit) {
      return NextResponse.json(
        { success: false, error: 'Name, SKU, imageUrl, and priceUnit are required' },
        { status: 400 }
      )
    }

    if (typeof currentPrice !== 'number') {
      return NextResponse.json(
        { success: false, error: 'currentPrice must be a number' },
        { status: 400 }
      )
    }

    // SKU uniqueness check
    const skuQuery = query(
      collection(db, 'products'),
      where('sku', '==', sku.trim())
    )
    const existingSKU = await getDocs(skuQuery)

    if (!existingSKU.empty) {
      return NextResponse.json(
        { success: false, error: `SKU "${sku}" already exists` },
        { status: 400 }
      )
    }

    // Add product to Firestore
    const docRef = await addDoc(collection(db, 'products'), {
      name: name.trim(),
      imageUrl: imageUrl.trim(),
      sku: sku.trim(),
      currentPrice,
      priceUnit: priceUnit.trim(), // ✅ stored here
      isActive,
      createdAt: serverTimestamp(),
      updatedAt: null
    })

    // Fetch updated product list
    const snapshot = await getDocs(collection(db, 'products'))
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      newId: docRef.id,
      products
    })

  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'products'))

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
