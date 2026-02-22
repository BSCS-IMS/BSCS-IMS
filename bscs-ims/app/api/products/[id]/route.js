export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { supabase } from '@/app/lib/supabaseClient'
import { admin } from '@/app/lib/firebaseAdmin'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

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

// Helper: extract file path from Supabase URL
function getFilePathFromUrl(url) {
  try {
    const parts = url.split('/productimages/')
    return parts[1] ?? null
  } catch (error) {
    console.error('Error parsing URL:', error)
    return null
  }
}

// Helper: upload image to Supabase
async function uploadImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: 'Invalid file type. Allowed: JPEG, PNG, WEBP, GIF' }
  }

  const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('productimages')
    .upload(fileName, file, { contentType: file.type })

  if (uploadError) {
    return { error: `Image upload failed: ${uploadError.message}` }
  }

  const { data } = supabase.storage.from('productimages').getPublicUrl(fileName)
  return { imageUrl: data.publicUrl }
}

// Helper: delete image from Supabase
async function deleteImage(imageUrl) {
  if (!imageUrl) return
  const filePath = getFilePathFromUrl(imageUrl)
  if (!filePath) return

  const { error } = await supabase.storage.from('productimages').remove([filePath])
  if (error) console.error('Error deleting image from Supabase:', error.message)
}

/* ==========================
   GET - fetch single product
========================== */
export async function GET(request, { params }) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: { id: snapshot.id, ...snapshot.data() }
    })

  } catch (error) {
    console.error('GET /products/[id] error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/* ==========================
   PUT - update product
========================== */
export async function PUT(request, { params }) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const existingProduct = snapshot.data()

    const formData = await request.formData()
    const name = formData.get('name')
    const currentPriceRaw = formData.get('currentPrice')
    const priceUnit = formData.get('priceUnit')
    const isActive = formData.get('isActive') === 'true'
    const file = formData.get('file')

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    // Handle image replacement
    let imageUrl = existingProduct.imageUrl ?? null
    if (file && file.size > 0) {
      await deleteImage(existingProduct.imageUrl)

      const result = await uploadImage(file)
      if (result.error) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }

      imageUrl = result.imageUrl
    }

    // Build update object dynamically
    const updateData = {
      name: name.trim(),
      isActive,
      imageUrl,
      updatedAt: serverTimestamp(),
      updatedByEmail: session.email,
      updatedByUid: session.uid,
    }

    if (currentPriceRaw !== null && currentPriceRaw !== '') {
      const price = parseFloat(currentPriceRaw)
      if (!isNaN(price)) updateData.currentPrice = price
    }

    if (priceUnit?.trim()) {
      updateData.priceUnit = priceUnit.trim()
    }

    await updateDoc(docRef, updateData)

    const updatedSnapshot = await getDoc(docRef)
    return NextResponse.json({
      success: true,
      product: { id: updatedSnapshot.id, ...updatedSnapshot.data() }
    })

  } catch (error) {
    console.error('PUT /products/[id] error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/* ==========================
   DELETE - soft delete product
========================== */
export async function DELETE(request, { params }) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const product = snapshot.data()

    // Delete image from Supabase
    await deleteImage(product.imageUrl)

    // Soft delete — preserves history
    await updateDoc(docRef, {
      isActive: false,
      deletedAt: serverTimestamp(),
      deletedByEmail: session.email,
      deletedByUid: session.uid,
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('DELETE /products/[id] error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}