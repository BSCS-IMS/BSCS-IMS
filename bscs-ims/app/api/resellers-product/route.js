import { NextResponse } from 'next/server'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'

// GET mapping
export async function GET() {
	try {
		const snap = await getDocs(collection(db, 'resellers-product'))

		const data = snap.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}))

		return NextResponse.json({ products: data })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}

export async function POST(req) {
	try {
		const body = await req.json()

		console.log('ASSIGN BODY:', body)

		const { resellerId, productId } = body

		if (!resellerId || !productId) {
			return NextResponse.json(
				{ error: 'Missing resellerId or productId' },
				{ status: 400 }
			)
		}

		await addDoc(collection(db, 'resellers-product'), {
			resellerId,
			productId,
			isActive: true,
			createdAt: serverTimestamp()
		})

		return NextResponse.json({ success: true })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}