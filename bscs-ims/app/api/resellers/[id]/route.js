export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { supabase } from '@/app/lib/supabaseClient'
import { logAudit } from '@/app/lib/audit'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Helper: extract file path from Supabase URL
function getFilePathFromUrl(url) {
	try {
		const parts = url.split('/resellerimages/')
		return parts[1] ?? null
	} catch (error) {
		console.error('Error parsing URL:', error)
		return null
	}
}

// Helper: upload image to Supabase
async function uploadImage(file) {
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		return { error: 'Invalid file type. Allowed: JPEG, PNG, WEBP, GIF' }
	}

	const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
	const fileName = `resellers/${Date.now()}-${Math.random().toString(36).slice(2)}-${sanitizedName}`

	const { error: uploadError } = await supabase.storage
		.from('resellerimages')
		.upload(fileName, file, { contentType: file.type })

	if (uploadError) {
		return { error: `Image upload failed: ${uploadError.message}` }
	}

	const { data } = supabase.storage.from('resellerimages').getPublicUrl(fileName)
	return { imageUrl: data.publicUrl }
}

// Helper: delete image from Supabase
async function deleteImage(imageUrl) {
	if (!imageUrl) return
	const filePath = getFilePathFromUrl(imageUrl)
	if (!filePath) return

	const { error } = await supabase.storage.from('resellerimages').remove([filePath])
	if (error) console.error('Error deleting image from Supabase:', error.message)
}

// DELETE reseller
export async function DELETE(req, context) {
	const { id: resellerId } = await context.params
	if (!resellerId) return NextResponse.json({ message: 'Missing reseller ID' }, { status: 400 })

	const ref = doc(db, 'resellers', resellerId)
	const snap = await getDoc(ref)

	if (snap.exists()) {
		const reseller = snap.data()
		// Delete image from Supabase if exists
		await deleteImage(reseller.imageUrl)
	}

	await deleteDoc(ref)

	await logAudit({
		action: 'DELETE',
		entityType: 'reseller',
		entityId: resellerId,
		performedById: 'SYSTEM'
	})

	return NextResponse.json({ success: true })
}

// UPDATE reseller
export async function PUT(req, context) {
	const { id: resellerId } = await context.params
	if (!resellerId) return NextResponse.json({ message: 'Missing reseller ID' }, { status: 400 })

	const ref = doc(db, 'resellers', resellerId)
	const snap = await getDoc(ref)
	if (!snap.exists()) return NextResponse.json({ message: 'Reseller not found' }, { status: 404 })

	const oldData = snap.data()

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

	// Handle image replacement
	let imageUrl = oldData.imageUrl ?? null
	if (file && file.size > 0) {
		// Delete old image
		await deleteImage(oldData.imageUrl)

		const result = await uploadImage(file)
		if (result.error) {
			return NextResponse.json({ success: false, error: result.error }, { status: 400 })
		}

		imageUrl = result.imageUrl
	}

	// Build update object
	const updateData = {
		businessName: businessName.trim(),
		ownerName: ownerName?.trim() || '',
		contactNumber: contactNumber?.trim() || '',
		email: email?.trim() || '',
		address: address?.trim() || '',
		status: status || 'active',
		notes: notes?.trim() || '',
		imageUrl,
		updatedAt: serverTimestamp()
	}

	await updateDoc(ref, updateData)

	await logAudit({
		action: 'UPDATE',
		entityType: 'reseller',
		entityId: resellerId,
		oldData,
		newData: updateData,
		performedById: userId || 'SYSTEM'
	})

	return NextResponse.json({ success: true, updatedFields: updateData })
}
