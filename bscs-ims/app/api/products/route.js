import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { supabase } from '@/app/lib/supabaseClient'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name')
    const sku = formData.get('sku')
    const currentPrice = parseFloat(formData.get('currentPrice'))
    const priceUnit = formData.get('priceUnit')
    const file = formData.get('file') // this is a File object
    const isActive = true

    // Basic validation
    if (!name || !sku || !file || !priceUnit || isNaN(currentPrice)) {
      return NextResponse.json(
        { success: false, error: 'Name, SKU, Image, currentPrice, and priceUnit are required' },
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

    // Upload file to Supabase
    const fileName = `products/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productimages')
      .upload(fileName, file, { contentType: file.type })

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: `Image upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data } = supabase.storage.from('productimages').getPublicUrl(fileName)
    const publicURL = data.publicUrl
    // Add product to Firestore
    const docRef = await addDoc(collection(db, 'products'), {
      name: name.trim(),
      sku: sku.trim(),
      currentPrice,
      priceUnit: priceUnit.trim(),
      imageUrl: publicURL,
      isActive,
      createdAt: serverTimestamp(),
      updatedAt: null
    })

    // Return success
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
