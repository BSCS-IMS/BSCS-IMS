export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { admin } from '@/app/lib/firebaseAdmin'
import { supabase } from '@/app/lib/supabaseClient'
import { logAudit } from '@/app/lib/audit'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Helper: verify session and return decoded token
async function getSession(req) {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;

  try {
    return await admin.auth().verifySessionCookie(token, true);
  } catch (err) {
    console.error("Invalid session cookie:", err.message);
    return null;
  }
}

// Helper: standard unauthorized response
function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

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
	try {
		// Get session from cookies
		const session = await getSession(req);
		if (!session) return unauthorized();

		const { id: resellerId } = await context.params
		if (!resellerId) return NextResponse.json({ message: 'Missing reseller ID' }, { status: 400 })

		const ref = doc(db, 'resellers', resellerId)
		const snap = await getDoc(ref)

		if (!snap.exists()) {
			return NextResponse.json({ message: 'Reseller not found' }, { status: 404 })
		}

		const oldData = snap.data()

		// Delete image from Supabase if exists
		await deleteImage(oldData.imageUrl)

		await deleteDoc(ref)

		await logAudit({
			action: 'DELETE',
			entityType: 'reseller',
			entityId: resellerId,
			oldData,
			performedById: session.uid // ✅ Use session
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('DELETE reseller error:', error)
		return NextResponse.json({ success: false, error: error.message }, { status: 500 })
	}
}

// UPDATE reseller
export async function PUT(req, context) {
	try {
		// Get session from cookies
		const session = await getSession(req);
		if (!session) return unauthorized();

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
		const file = formData.get('file')
		const removeImage = formData.get('removeImage') === 'true'

		// Validate required field
		if (!businessName?.trim()) {
			return NextResponse.json(
				{ success: false, error: 'Business name is required' },
				{ status: 400 }
			)
		}

		// Check for duplicate business name (excluding current reseller)
		const normalizedBusinessName = businessName.trim()
		const duplicateQuery = query(
			collection(db, 'resellers'),
			where('businessName', '==', normalizedBusinessName)
		)
		const existingResellers = await getDocs(duplicateQuery)
		const hasDuplicate = existingResellers.docs.some(doc => doc.id !== resellerId)
		if (hasDuplicate) {
			return NextResponse.json(
				{ success: false, error: `Reseller with business name "${normalizedBusinessName}" already exists` },
				{ status: 409 }
			)
		}

		// Handle image removal
		let imageUrl = oldData.imageUrl ?? null
		if (removeImage) {
			await deleteImage(oldData.imageUrl)
			imageUrl = null
		} else if (file && file.size > 0) {
			// Handle image replacement
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
			updatedAt: serverTimestamp(),
			updatedById: session.uid,
			updatedByEmail: session.email
		}

		await updateDoc(ref, updateData)

		await logAudit({
			action: 'UPDATE',
			entityType: 'reseller',
			entityId: resellerId,
			oldData,
			newData: updateData,
			performedById: session.uid // ✅ Use session
		})

		return NextResponse.json({ success: true, updatedFields: updateData })
	} catch (error) {
		console.error('PUT reseller error:', error)
		return NextResponse.json({ success: false, error: error.message }, { status: 500 })
	}
}