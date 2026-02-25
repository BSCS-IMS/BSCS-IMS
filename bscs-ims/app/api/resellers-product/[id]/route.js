export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'

export async function GET(req, { params }) {
	try {
		const { id: resellerId } = await params   // ✅ FIX

		// 1️⃣ Get mappings
		const mappingSnap = await getDocs(
			query(
				collection(db, 'resellers-product'),
				where('resellerId', '==', resellerId),
				where('isActive', '==', true)
			)
		)

		if (mappingSnap.empty) {
			return NextResponse.json({ products: [] })
		}

		const productIds = mappingSnap.docs.map(d => d.data().productId)

		// 2️⃣ Get products
		const productsSnap = await getDocs(collection(db, 'products'))

		const products = productsSnap.docs
			.map(doc => ({ id: doc.id, ...doc.data() }))
			.filter(p => productIds.includes(p.id))

		return NextResponse.json({ products })
	} catch (err) {
		console.error('RESELLER PRODUCTS ERROR:', err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

// DELETE all product mappings for a reseller
export async function DELETE(req, { params }) {
	try {
		const { id: resellerId } = await params

		const mappingSnap = await getDocs(
			query(
				collection(db, 'resellers-product'),
				where('resellerId', '==', resellerId)
			)
		)

		// Delete all mappings for this reseller
		for (const docSnap of mappingSnap.docs) {
			await deleteDoc(doc(db, 'resellers-product', docSnap.id))
		}

		return NextResponse.json({ success: true, deleted: mappingSnap.docs.length })
	} catch (err) {
		console.error('DELETE RESELLER PRODUCTS ERROR:', err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}