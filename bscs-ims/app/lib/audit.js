import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { admin } from './firebaseAdmin'

export async function logAudit({
	action,
	entityType,
	entityId,
	oldData = null,
	newData = null,
	performedById
}) {
	if (!db) return

	try {
		// Get user email from Firebase Admin
		let performedBy = 'SYSTEM'
		if (performedById) {
			try {
				const userRecord = await admin.auth().getUser(performedById)
				performedBy = userRecord.email || performedById
			} catch (err) {
				console.error('Failed to get user email:', err)
				performedBy = performedById
			}
		}

		const auditLog = {
			action,
			entityType,
			entityId,
			oldData: oldData || null,
			newData: newData || null,
			performedBy, // User email for display
			performedById, // User ID for reference
			platform: 'web',
			timestamp: serverTimestamp() // Changed from createdAt to timestamp
		}

		console.log('Creating audit log:', auditLog)
		await addDoc(collection(db, 'auditLogs'), auditLog)
		console.log('Audit log created successfully')
	} catch (error) {
		console.error('Failed to create audit log:', error)
		// Don't throw - we don't want audit logging to break the main operation
	}
}