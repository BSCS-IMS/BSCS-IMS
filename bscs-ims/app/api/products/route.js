import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { supabase } from '@/app/lib/supabaseClient'

export async function POST(request) {
  try {
    const formData = await request.formData()

    const name = formData.get('name')
    const sku = formData.get('sku')
    const priceUnit = formData.get('priceUnit')
    const currentPriceRaw = formData.get('currentPrice')
    const file = formData.get('file')

    // ✅ ONLY REQUIRED VALIDATION
    if (!name || !sku) {
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

    let imageUrl = null

    // ✅ Upload image ONLY if provided
    if (file && typeof file.name === 'string') {
      const fileName = `products/${Date.now()}-${file.name}`

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

    // ✅ Build product object dynamically
    const productData = {
      name: name.trim(),
      sku: sku.trim(),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: null
    }

    if (currentPriceRaw !== null && currentPriceRaw !== '') {
      const price = parseFloat(currentPriceRaw)
      if (!isNaN(price)) {
        productData.currentPrice = price
      }
    }

    if (priceUnit) {
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
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
