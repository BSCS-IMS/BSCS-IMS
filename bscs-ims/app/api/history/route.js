export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'
import { admin } from '@/app/lib/firebaseAdmin'

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
   GET - fetch inventory adjustment history
   Source: auditLogs where entityType === 'inventory'
   Only records where quantity changed (ADD or SUBTRACT)
========================== */
export async function GET(req) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all needed collections in parallel
    // NOTE: auditLogs fetched WITHOUT compound orderBy to avoid needing a
    // composite Firestore index. We sort in-memory after filtering instead.
    const [auditSnap, productsSnap, inventorySnap, locationsSnap] = await Promise.all([
      getDocs(collection(db, 'auditLogs')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'inventory')),
      getDocs(collection(db, 'locations')),
    ])

    // Build lookup maps
    const productsMap     = new Map(productsSnap.docs.map((d) => [d.id, d.data()]))
    const locationsMap    = new Map(locationsSnap.docs.map((d) => [d.id, d.data()]))
    const inventoryDocMap = new Map(inventorySnap.docs.map((d) => [d.id, d.data()]))

    const history = []

    auditSnap.docs.forEach((doc) => {
      const audit = doc.data()

      // Only inventory audit entries
      if (audit.entityType !== 'inventory') return

      const oldQty = audit.oldData?.quantity ?? null
      const newQty = audit.newData?.quantity ?? null

      if (newQty === null || newQty === undefined) return

      // Resolve productId / locationId — prefer audit payload, fall back to live inventory doc
      const inventoryData = inventoryDocMap.get(audit.entityId) || {}
      const productId  =
        audit.newData?.productId  ||
        audit.oldData?.productId  ||
        inventoryData.productId

      const locationId =
        audit.newData?.locationId ||
        audit.oldData?.locationId ||
        inventoryData.locationId

      if (!productId) return

      const product  = productsMap.get(productId)
      const location = locationId ? locationsMap.get(locationId) : undefined

      if (!product) return

      const previousQty  = oldQty ?? 0
      const resultingQty = newQty
      const adjustment   = resultingQty - previousQty

      if (adjustment === 0) return

      const category = adjustment > 0 ? 'ADD QUANTITY' : 'SUBTRACT QUANTITY'

      // Normalise Firestore timestamp → milliseconds
      const rawTs = audit.timestamp || audit.performedAt || audit.createdAt
      const timestamp =
        rawTs?.toMillis?.() ||
        (rawTs?.seconds ? rawTs.seconds * 1000 : null) ||
        null

      history.push({
        id:                doc.id,
        productId,
        productName:       product.name   || '—',
        productSku:        product.sku    || '—',
        locationId:        locationId     || '—',
        locationName:      location?.name || locationId || '—',
        adjustment,
        previousQuantity:  previousQty,
        resultingQuantity: resultingQty,
        category,
        performedById:     audit.performedById || '—',
        timestamp,
      })
    })

    // Default sort: latest first
    history.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))

    return NextResponse.json({ success: true, history })
  } catch (error) {
    console.error('GET /api/history error:', error)
    return NextResponse.json({ message: 'Failed to fetch history', error: error.message }, { status: 500 })
  }
}