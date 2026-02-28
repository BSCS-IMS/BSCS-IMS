export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { supabase } from '@/app/lib/supabaseClient'
import { logAudit } from '@/app/lib/audit'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// GET all resellers with filters
export async function GET(req) {
	try {
		const { searchParams } = new URL(req.url)

		const search = searchParams.get('search')?.toLowerCase() || ''
		const status = searchParams.get('status') || ''
		const productId = searchParams.get('productId') || ''
		const sort = searchParams.get('sort') || ''

		// 1️⃣ Fetch all resellers
		const resSnap = await getDocs(collection(db, 'resellers'))
		let resellers = resSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

		// 2️⃣ Fetch reseller-product relations
		const rpSnap = await getDocs(collection(db, 'resellers-product'))
		const resellerProducts = rpSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

		// 3️⃣ Fetch products
		const prodSnap = await getDocs(collection(db, 'products'))
		const products = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

		// 4️⃣ Attach assigned products
		resellers = resellers.map(r => {
			const assignedProductIds = resellerProducts
				.filter(rp => rp.resellerId === r.id && rp.isActive)
				.map(rp => rp.productId)

			const assignedProducts = products.filter(p =>
				assignedProductIds.includes(p.id)
			)

			return { ...r, assignedProducts }
		})

		// 🔍 SEARCH filter (businessName / ownerName)
		if (search) {
			resellers = resellers.filter(r =>
				r.businessName?.toLowerCase().includes(search) ||
				r.ownerName?.toLowerCase().includes(search)
			)
		}

		// 🟢 STATUS filter
		if (status) {
			resellers = resellers.filter(r => r.status === status)
		}

		// 📦 PRODUCTS OWNED filter
		if (productId) {
			resellers = resellers.filter(r =>
				r.assignedProducts?.some(p => p.id === productId)
			)
		}

		// ↕️ SORT
		if (sort === 'asc') {
			resellers.sort((a, b) =>
				(a.businessName || '').localeCompare(b.businessName || '')
			)
		} else if (sort === 'desc') {
			resellers.sort((a, b) =>
				(b.businessName || '').localeCompare(a.businessName || '')
			)
		} else {
			// Default: createdAt desc
			resellers.sort((a, b) => {
				const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0
				const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0
				return bTime - aTime
			})
		}

		return NextResponse.json(resellers)
	} catch (error) {
		console.error('GET /resellers error:', error)
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		)
	}
}

// CREATE new reseller
export async function POST(req) {
	try {
		const formData = await req.formData()

		const businessName = formData.get('businessName')
		const ownerName = formData.get('ownerName')
		const contactNumber = formData.get('contactNumber')
		const email = formData.get('email')
		const address = formData.get('address')
		const status = formData.get('status')
		const notes = formData.get('notes')
		const userId = formData.get('userId')
		const file = formData.get('file')

		// Validate required field
		if (!businessName?.trim()) {
			return NextResponse.json(
				{ success: false, error: 'Business name is required' },
				{ status: 400 }
			)
		}

		// Handle image upload
		let imageUrl = null
		if (file && typeof file.name === 'string' && file.size > 0) {
			if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
				return NextResponse.json(
					{ success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WEBP, GIF' },
					{ status: 400 }
				)
			}

			const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
			const fileName = `resellers/${Date.now()}-${Math.random().toString(36).slice(2)}-${sanitizedName}`

			const { error: uploadError } = await supabase.storage
				.from('resellerimages')
				.upload(fileName, file, { contentType: file.type })

			if (uploadError) {
				return NextResponse.json(
					{ success: false, error: `Image upload failed: ${uploadError.message}` },
					{ status: 500 }
				)
			}

			const { data } = supabase.storage.from('resellerimages').getPublicUrl(fileName)
			imageUrl = data.publicUrl
		}

		// Build reseller data
		const resellerData = {
			businessName: businessName.trim(),
			ownerName: ownerName?.trim() || '',
			contactNumber: contactNumber?.trim() || '',
			email: email?.trim() || '',
			address: address?.trim() || '',
			status: status || 'active',
			notes: notes?.trim() || '',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			createdById: userId || 'SYSTEM'
		}

		if (imageUrl) {
			resellerData.imageUrl = imageUrl
		}

		const ref = await addDoc(collection(db, 'resellers'), resellerData)

		await logAudit({
			action: 'CREATE',
			entityType: 'reseller',
			entityId: ref.id,
			newData: resellerData,
			performedById: userId || 'SYSTEM'
		})

		return NextResponse.json({ success: true, id: ref.id })
	} catch (error) {
		console.error(error)
		return NextResponse.json({ success: false, error: error.message }, { status: 500 })
	}
}
