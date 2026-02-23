export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore'
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

/* ==========================
   GET - fetch all products
========================== */
export async function GET(req) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const snapshot = await getDocs(collection(db, 'products'))
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('GET /products error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/* ==========================
   POST - create product
========================== */
export async function POST(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const name = formData.get('name')
    const sku = formData.get('sku')
    const priceUnit = formData.get('priceUnit')
    const currentPriceRaw = formData.get('currentPrice')
    const file = formData.get('file')

    // Validate required fields
    if (!name?.trim() || !sku?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name and SKU are required' },
        { status: 400 }
      )
    }

    // SKU uniqueness check
    const skuQuery = query(collection(db, 'products'), where('sku', '==', sku.trim()))
    const existingSKU = await getDocs(skuQuery)
    if (!existingSKU.empty) {
      return NextResponse.json(
        { success: false, error: `SKU "${sku}" already exists` },
        { status: 400 }
      )
    }

    // Handle image upload
    let imageUrl = null
    if (file && typeof file.name === 'string') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WEBP, GIF' },
          { status: 400 }
        )
      }

      const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('productimages')
        .upload(fileName, file, { contentType: file.type })

      if (uploadError) {
        return NextResponse.json(
          { success: false, error: `Image upload failed: ${uploadError.message}` },
          { status: 500 }
        )
      }

      const { data } = supabase.storage.from('productimages').getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    // Build product object
    const productData = {
      name: name.trim(),
      sku: sku.trim(),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: null,
      createdByEmail: session.email,
      createdByUid: session.uid,
    }

    if (currentPriceRaw !== null && currentPriceRaw !== '') {
      const price = parseFloat(currentPriceRaw)
      if (!isNaN(price)) {
        productData.currentPrice = price
      }
    }

    if (priceUnit?.trim()) {
      productData.priceUnit = priceUnit.trim()
    }

    if (imageUrl) {
      productData.imageUrl = imageUrl
    }

    const docRef = await addDoc(collection(db, 'products'), productData)

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      newId: docRef.id
    }, { status: 201 })

  } catch (error) {
    console.error('POST /products error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}