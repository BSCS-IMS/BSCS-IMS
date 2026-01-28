import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { logAudit } from '@/app/lib/audit'

// DELETE reseller
export async function DELETE(req, context) {
	const { id: resellerId } = await context.params
	if (!resellerId) return NextResponse.json({ message: 'Missing reseller ID' }, { status: 400 })

	await deleteDoc(doc(db, 'resellers', resellerId))

	await logAudit({
		action: 'DELETE',
		entityType: 'reseller',
		entityId: resellerId,
		performedById: 'SYSTEM'
	})

	return NextResponse.json({ success: true })
}

// UPDATE reseller
export async function PATCH(req, context) {
	const { id: resellerId } = await context.params
	const body = await req.json()
	if (!resellerId) return NextResponse.json({ message: 'Missing reseller ID' }, { status: 400 })

	const ref = doc(db, 'resellers', resellerId)
	const snap = await getDoc(ref)
	if (!snap.exists()) return NextResponse.json({ message: 'Reseller not found' }, { status: 404 })

	const oldData = snap.data()

	// Update main reseller fields
	const { assignedProducts, ...fieldsToUpdate } = body
	await updateDoc(ref, { ...fieldsToUpdate, updatedAt: new Date() })

	// Update assigned products mapping
	if (Array.isArray(assignedProducts)) {
		// 1️⃣ Remove old mappings for this reseller
		const q = query(collection(db, 'resellerProducts'), where('resellerId', '==', resellerId))
		const existingSnap = await getDocs(q)
		for (const docSnap of existingSnap.docs) await deleteDoc(doc(db, 'resellerProducts', docSnap.id))

		// 2️⃣ Add new mappings
		for (const productId of assignedProducts) {
			await addDoc(collection(db, 'resellerProducts'), {
				resellerId,
				productId,
				isActive: true,
				createdAt: new Date()
			})
		}
	}

	await logAudit({
		action: 'UPDATE',
		entityType: 'reseller',
		entityId: resellerId,
		oldData,
		newData: body,
		performedById: 'SYSTEM'
	})

	return NextResponse.json({ success: true, updatedFields: body })
}
