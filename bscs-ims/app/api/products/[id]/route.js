export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp, getDocs, collection, query, where } from 'firebase/firestore'
import { supabase } from '@/app/lib/supabaseClient'
import { admin } from '@/app/lib/firebaseAdmin'
import { logAudit } from '@/app/lib/audit'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

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

function getFilePathFromUrl(url) {
  try {
    const parts = url.split('/productimages/')
    return parts[1] ?? null
  } catch (error) {
    console.error('Error parsing URL:', error)
    return null
  }
}

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

    const { id } = await params
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

    const { id } = await params
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
    const description = formData.get('description')
    const isActive = formData.get('isActive') === 'true'
    const file = formData.get('file')
    const removeImage = formData.get('removeImage') === 'true'

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }

    let imageUrl = existingProduct.imageUrl ?? null
    if (removeImage) {
      await deleteImage(existingProduct.imageUrl)
      imageUrl = null
    } else if (file && file.size > 0) {
      await deleteImage(existingProduct.imageUrl)
      const result = await uploadImage(file)
      if (result.error) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }
      imageUrl = result.imageUrl
    }

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

    if (description !== null) {
      updateData.description = description?.trim() || ''
    }

    await updateDoc(docRef, updateData)

    const updatedSnapshot = await getDoc(docRef)

    await logAudit({
      action: 'UPDATE',
      entityType: 'product',
      entityId: docRef.id,
      oldData: existingProduct,
      newData: updateData,
      performedById: session.uid
    })

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
   DELETE - hard delete product + cascade
========================== */
export async function DELETE(request, { params }) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const docRef = doc(db, 'products', id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const product = snapshot.data()

    // Delete image from Supabase
    await deleteImage(product.imageUrl)

    // Cascade delete associated inventory records + audit log each one
    const inventoryQuery = query(collection(db, 'inventory'), where('productId', '==', id))
    const inventorySnap = await getDocs(inventoryQuery)

    await Promise.all(
      inventorySnap.docs.map(async (d) => {
        await deleteDoc(d.ref)
        await logAudit({
          action: 'DELETE',
          entityType: 'inventory',
          entityId: d.id,
          oldData: d.data(),
          newData: null,
          performedById: session.uid,
        })
      })
    )

    // Hard delete product
    await deleteDoc(docRef)

    await logAudit({
      action: 'DELETE',
      entityType: 'product',
      entityId: id,
      oldData: product,
      newData: null,
      performedById: session.uid
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