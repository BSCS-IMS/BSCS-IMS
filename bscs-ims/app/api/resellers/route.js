import { NextResponse } from 'next/server'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { logAudit } from '@/app/lib/audit'

// GET all resellers
export async function GET() {
	try {
		// 1️⃣ Fetch all resellers
		const resSnap = await getDocs(collection(db, 'resellers'))
		const resellers = resSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

		// 2️⃣ Fetch all resellerProducts
		const rpSnap = await getDocs(collection(db, 'resellers-product'))
		const resellerProducts = rpSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

		// 3️⃣ Fetch all products (optional, to show names)
		const prodSnap = await getDocs(collection(db, 'products'))
		const products = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

		// 4️⃣ Attach assigned products to each reseller
		const resellersWithProducts = resellers.map(r => {
			const assignedProductIds = resellerProducts
				.filter(rp => rp.resellerId === r.id && rp.isActive)
				.map(rp => rp.productId)

			const assignedProducts = products.filter(p => assignedProductIds.includes(p.id))

			return { ...r, assignedProducts }
		})

		return NextResponse.json(resellersWithProducts)
	} catch (error) {
		console.error(error)
		return NextResponse.json({ success: false, error: error.message }, { status: 500 })
	}
}

// CREATE new reseller
export async function POST(req) {
	try {
		const body = await req.json()

		const ref = await addDoc(collection(db, 'resellers'), {
			businessName: body.businessName,
			ownerName: body.ownerName || '',
			contactNumber: body.contactNumber || '',
			email: body.email || '',
			address: body.address || '',
			status: body.status || 'active',
			notes: body.notes || '',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			createdById: body.userId || 'SYSTEM'
		})

		// Optional: add assigned products mapping
		if (body.assignedProducts?.length) {
			for (const productId of body.assignedProducts) {
				await addDoc(collection(db, 'resellers-product'), {
					resellerId: ref.id,
					productId,
					isActive: true,
					createdAt: serverTimestamp()
				})
			}
		}

		await logAudit({
			action: 'CREATE',
			entityType: 'reseller',
			entityId: ref.id,
			newData: body,
			performedById: body.userId || 'SYSTEM'
		})

		return NextResponse.json({ success: true, id: ref.id })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ success: false, error: error.message }, { status: 500 })
	}
}
