export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { admin } from '@/app/lib/firebaseAdmin'

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
   GET - fetch dashboard analytics
========================== */
export async function GET(req) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get start of today (midnight)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Fetch all data in parallel
    const [
      auditLogsSnap,
      inventorySnap,
      productsSnap,
      resellersProductSnap,
      resellersSnap,
      announcementsSnap,
      locationsSnap
    ] = await Promise.all([
      // Audit logs for inventory changes (filter by date in JS to avoid composite index)
      getDocs(query(
        collection(db, 'auditLogs'),
        where('entityType', '==', 'inventory')
      )),
      // All inventory
      getDocs(collection(db, 'inventory')),
      // Active products
      getDocs(query(collection(db, 'products'), where('isActive', '==', true))),
      // Reseller-product mappings
      getDocs(collection(db, 'resellers-product')),
      // All resellers
      getDocs(collection(db, 'resellers')),
      // Latest announcements (limit 3)
      getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3))),
      // All locations
      getDocs(collection(db, 'locations'))
    ])

    // Build lookup maps
    const productMap = new Map(productsSnap.docs.map(d => [d.id, d.data()]))
    const resellerMap = new Map(resellersSnap.docs.map(d => [d.id, d.data()]))
    const locationMap = new Map(locationsSnap.docs.map(d => [d.id, d.data()]))

    // 1. Calculate today's inventory changes (added/subtracted per product)
    const todayChanges = {}
    const todayMs = today.getTime()

    auditLogsSnap.docs.forEach(doc => {
      const data = doc.data()

      // Filter by today's date in JavaScript
      const createdAt = data.createdAt
      if (createdAt) {
        const createdMs = createdAt.toMillis ? createdAt.toMillis() : (createdAt.seconds * 1000)
        if (createdMs < todayMs) return // Skip if not today
      } else {
        return // Skip if no createdAt
      }

      const entityId = data.entityId // format: productId_locationId
      const productId = entityId?.split('_')[0]

      if (!productId) return

      const productName = productMap.get(productId)?.name || 'Unknown'

      if (!todayChanges[productId]) {
        todayChanges[productId] = { productId, productName, added: 0, subtracted: 0 }
      }

      // Calculate the quantity change
      const oldQty = data.oldData?.quantity ?? 0
      const newQty = data.newData?.quantity ?? 0
      const diff = newQty - oldQty

      if (data.action === 'CREATE') {
        todayChanges[productId].added += newQty
      } else if (data.action === 'UPDATE') {
        if (diff > 0) {
          todayChanges[productId].added += diff
        } else if (diff < 0) {
          todayChanges[productId].subtracted += Math.abs(diff)
        }
      } else if (data.action === 'DELETE') {
        todayChanges[productId].subtracted += oldQty
      }
    })

    const todayInventoryChanges = Object.values(todayChanges)
      .filter(item => item.added > 0 || item.subtracted > 0)
      .slice(0, 10) // Limit to top 10 products

    // 2. Top 5 products by total quantity
    const productQuantities = {}
    inventorySnap.docs.forEach(doc => {
      const data = doc.data()
      const productId = data.productId
      const productName = productMap.get(productId)?.name || 'Unknown'

      if (!productQuantities[productId]) {
        productQuantities[productId] = { productId, productName, quantity: 0 }
      }
      productQuantities[productId].quantity += data.quantity || 0
    })

    const topProducts = Object.values(productQuantities)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    // 3. Resellers with most products
    const resellerProductCounts = {}
    resellersProductSnap.docs.forEach(doc => {
      const data = doc.data()
      if (!data.isActive) return

      const resellerId = data.resellerId
      const resellerName = resellerMap.get(resellerId)?.businessName || 'Unknown'

      if (!resellerProductCounts[resellerId]) {
        resellerProductCounts[resellerId] = { resellerId, resellerName, productCount: 0 }
      }
      resellerProductCounts[resellerId].productCount++
    })

    const topResellers = Object.values(resellerProductCounts)
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5)

    // 4. Latest 3 announcements
    const latestAnnouncements = announcementsSnap.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        isPublished: data.isPublished,
        createdAt: data.createdAt
      }
    })

    // 5. Inventory by location (for line chart)
    const locationInventory = {}
    inventorySnap.docs.forEach(doc => {
      const data = doc.data()
      const locationId = data.locationId
      const locationName = locationMap.get(locationId)?.name || 'Unknown'

      if (!locationInventory[locationId]) {
        locationInventory[locationId] = { locationId, locationName, totalQuantity: 0, productCount: 0 }
      }
      locationInventory[locationId].totalQuantity += data.quantity || 0
      locationInventory[locationId].productCount++
    })

    const locationData = Object.values(locationInventory)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)

    return NextResponse.json({
      success: true,
      data: {
        todayInventoryChanges,
        topProducts,
        topResellers,
        latestAnnouncements,
        locationData
      }
    })

  } catch (error) {
    console.error('GET /dashboard/analytics error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
