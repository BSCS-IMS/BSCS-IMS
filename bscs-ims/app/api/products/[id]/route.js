import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { supabase } from '@/app/lib/supabaseClient'

// Helper function to extract file path from Supabase URL
function getFilePathFromUrl(url) {
  try {
    
    const parts = url.split('/productimages/')
    return parts[1] // Returns: products/1234-image.jpg
  } catch (error) {
    console.error('Error parsing URL:', error)
    return null
  }
}

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

    const formData = await request.formData()
    const name = formData.get('name')
    const currentPrice = parseFloat(formData.get('currentPrice'))
    const priceUnit = formData.get('priceUnit')
    const isActive = formData.get('isActive') === 'true'
    const file = formData.get('file')

    // Basic validation
    if (!name || !priceUnit || isNaN(currentPrice)) {
      return NextResponse.json(
        { success: false, error: 'Name, currentPrice, and priceUnit are required' },
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

    const existingProduct = snapshot.data()
    let imageUrl = existingProduct.imageUrl

    // If a new file is uploaded, handle image replacement
    if (file && file.size > 0) {
      // Delete old image from Supabase
      const oldFilePath = getFilePathFromUrl(existingProduct.imageUrl)
      if (oldFilePath) {
        const { error: deleteError } = await supabase.storage
          .from('productimages')
          .remove([oldFilePath])
        
        if (deleteError) {
          console.error('Error deleting old image:', deleteError)
        }
      }

      // Upload new image to Supabase
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

      // Get new public URL
      const { data } = supabase.storage.from('productimages').getPublicUrl(fileName)
      imageUrl = data.publicUrl
    }

    // Update Firestore document
    await updateDoc(docRef, {
      name: name.trim(),
      imageUrl,
      currentPrice,
      priceUnit: priceUnit.trim(),
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

    const product = snapshot.data()

    // Delete image from Supabase
    const filePath = getFilePathFromUrl(product.imageUrl)
    if (filePath) {
      const { error: deleteError } = await supabase.storage
        .from('productimages')
        .remove([filePath])
      
      if (deleteError) {
        console.error('Error deleting image from Supabase:', deleteError)
        // Continue with Firestore deletion even if image deletion fails
      }
    }

    // Delete document from Firestore
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