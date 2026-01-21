// ============================================
// app/api/sample/route.js - WITH FIREBASE
// ============================================

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'

// GET - Fetch all items from Firestore
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'items'))
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      items
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Add new item to Firestore
export async function POST(request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Item name is required' }, { status: 400 })
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'items'), {
      name: name.trim(),
      createdAt: new Date().toISOString()
    })

    // Fetch updated list
    const querySnapshot = await getDocs(collection(db, 'items'))
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      items,
      message: 'Item added successfully',
      newId: docRef.id
    })
  } catch (error) {
    console.error('Error adding item:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE - Remove item from Firestore
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 })
    }

    // Delete from Firestore
    await deleteDoc(doc(db, 'items', id))

    // Fetch updated list
    const querySnapshot = await getDocs(collection(db, 'items'))
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      items,
      message: 'Item deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
