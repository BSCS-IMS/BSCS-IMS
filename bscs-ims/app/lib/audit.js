import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function logAudit({
	action,
	entityType,
	entityId,
	oldData = null,
	newData = null,
	performedById
}) {
	if (!db) return

	await addDoc(collection(db, 'auditLogs'), {
		action,
		entityType,
		entityId,
		oldData,
		newData,
		platform: 'web',
		performedById,
		createdAt: serverTimestamp()
	})
}
