import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

// ----- GET single product for edit/update modal -----
export async function GET(request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const product = snapshot.data()
    if (!product.isActive) {
      return NextResponse.json({ success: false, error: 'Product is inactive' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: { id: snapshot.id, ...product }
    })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// ----- PUT full update for updating or editing -----
export async function PUT(request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    const body = await request.json()
    const { name, imageUrl, currentPrice, priceUnit, isActive } = body

    if (!name || !imageUrl || !priceUnit) {
      return NextResponse.json(
        { success: false, error: 'Name, imageUrl, and priceUnit are required' },
        { status: 400 }
      )
    }

    if (typeof currentPrice !== 'number') {
      return NextResponse.json(
        { success: false, error: 'currentPrice must be a number' },
        { status: 400 }
      )
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isActive must be boolean' },
        { status: 400 }
      )
    }

    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    await updateDoc(docRef, {
      name: name.trim(),
      imageUrl: imageUrl.trim(),
      currentPrice,
      priceUnit,
      isActive,
      updatedAt: serverTimestamp()
    })

    const updatedSnapshot = await getDoc(docRef)
    return NextResponse.json({
      success: true,
      product: { id: updatedSnapshot.id, ...updatedSnapshot.data() }
    })

  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// ----- DELETE product -----
export async function DELETE(request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    await deleteDoc(docRef)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
