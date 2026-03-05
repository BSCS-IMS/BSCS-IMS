export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { supabase } from '@/app/lib/supabaseClient'
import { admin } from '@/app/lib/firebaseAdmin'
import { logAudit } from '@/app/lib/audit'

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
   GET - fetch all non-deleted products with filters
========================== */
export async function GET(req) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.toLowerCase() || ''
    const sort = searchParams.get('sort') || ''
    const status = searchParams.get('status') || ''
    const productId = searchParams.get('productId') || ''
    const locationId = searchParams.get('locationId') || ''

    // Fetch products and inventory in parallel
    const [productsSnapshot, inventorySnapshot] = await Promise.all([
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'inventory'))
    ])

    // Build inventory map: productId -> array of { locationId, quantity }
    const inventoryMap = new Map()
    inventorySnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (!inventoryMap.has(data.productId)) {
        inventoryMap.set(data.productId, [])
      }
      inventoryMap.get(data.productId).push({
        locationId: data.locationId,
        quantity: data.quantity || 0
      })
    })

    let products = productsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(product => !product.deletedAt)

    // Apply search filter (by name)
    if (search) {
      products = products.filter((p) =>
        p.name?.toLowerCase().includes(search)
      )
    }

    // Apply status filter
    if (status === 'available') {
      products = products.filter((p) => p.isActive === true)
    } else if (status === 'not-available') {
      products = products.filter((p) => p.isActive === false)
    }

    // Apply product ID filter
    if (productId) {
      products = products.filter((p) => p.id === productId)
    }

    // Apply location filter (products that have inventory in the specified location)
    if (locationId) {
      products = products.filter((product) => {
        const inventory = inventoryMap.get(product.id) || []
        return inventory.some((inv) => inv.locationId === locationId && inv.quantity > 0)
      })
    }

    // Apply sort (by name)
    if (sort === 'asc') {
      products.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sort === 'desc') {
      products.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
    } else {
      // Default sort: newest first
      products.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0
        return bTime - aTime
      })
    }

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
    const description = formData.get('description')
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

    if (description?.trim()) {
      productData.description = description.trim()
    }

    if (imageUrl) {
      productData.imageUrl = imageUrl
    }

    const docRef = await addDoc(collection(db, 'products'), productData)

    await logAudit({
      action: 'CREATE',
      entityType: 'product',
      entityId: docRef.id,
      newData: productData,
      performedById: session.uid

    })

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