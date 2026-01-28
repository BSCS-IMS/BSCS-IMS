'use client'

import { useState, useEffect } from 'react'

export default function ResellerFormModal({ onClose, reseller = null }) {
	const [form, setForm] = useState({
		businessName: '',
		contactNumber: '',
		address: '',
		status: 'active',
		description: '',
		assignedProduct: '',
		image: null
	})
	const [products, setProducts] = useState([]) // <-- products state
	const [selectedProductId, setSelectedProductId] = useState('')


	// Pre-fill form kapag Edit mode
	useEffect(() => {
		if (reseller) {
			setForm({
				businessName: reseller.businessName || '',
				contactNumber: reseller.contactNumber || '',
				address: reseller.address || '',
				status: reseller.status || 'active',
				description: reseller.notes || '',
				assignedProduct: reseller.assignedProduct || '',
				image: null
			})
		}
	}, [reseller])

	// Fetch products
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await fetch('/api/products')
				const data = await res.json()
				// 🔥 Transform API response
				const productArray = Array.isArray(data.products) ? data.products : []
				setProducts(productArray)
			} catch (err) {
				console.error(err)
				setProducts([])
			}
		}
		fetchProducts()
	}, [])

	async function handleSubmit() {
		const method = reseller ? 'PATCH' : 'POST'
		const url = reseller ? `/api/resellers/${reseller.id}` : '/api/resellers'

		// 1️⃣ Create or update reseller first
		const res = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				businessName: form.businessName,
				contactNumber: form.contactNumber,
				address: form.address,
				status: form.status,
				notes: form.description,
				userId: 'SYSTEM'
			})
		})
		const data = await res.json()

		// 🛑 GUARD — DITO MISMO
		if (!res.ok || !data.id) {
			console.error('Reseller create/update failed:', data)
			return
		}
		const resellerId = reseller ? reseller.id : data.id

		// 2️⃣ Assign product if selected
		if (form.assignedProduct) {
			await fetch('/api/resellers-product', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					resellerId,
					productId: form.assignedProduct,
					isActive: true,
					userId: 'SYSTEM'
				})
			})
		}

		onClose()
	}

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div className="bg-white w-[520px] rounded-xl shadow-lg relative p-6">

				{/* Header */}
				<div className="flex items-center justify-between mb-2">
					<h2 className="text-lg font-semibold">
						{reseller ? 'Edit Reseller' : 'Reseller Create'}
					</h2>
					<button onClick={onClose} className="text-gray-400 hover:text-black">
						✕
					</button>
				</div>

				{/* Optional description */}
				<p className="text-sm text-gray-500 mb-5">
					Fill out the details for the {reseller ? 'reseller' : 'new reseller'}.
				</p>

				{/* Form */}
				<div className="space-y-4">
					{/* Reseller Name */}
					<div>
						<label className="text-sm font-medium">Reseller Name*</label>
						<input
							className="w-full border rounded-md px-3 py-2 mt-1"
							placeholder="Reseller Name"
							value={form.businessName}
							onChange={e => setForm({ ...form, businessName: e.target.value })}
						/>
					</div>

					{/* Contact + Address */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="text-sm font-medium">Contact Number</label>
							<input
								className="w-full border rounded-md px-3 py-2 mt-1"
								placeholder="Contact Number"
								value={form.contactNumber}
								onChange={e => setForm({ ...form, contactNumber: e.target.value })}
							/>
						</div>

						<div>
							<label className="text-sm font-medium">Address</label>
							<input
								className="w-full border rounded-md px-3 py-2 mt-1"
								placeholder="Address"
								value={form.address}
								onChange={e => setForm({ ...form, address: e.target.value })}
							/>
						</div>
					</div>

					{/* Upload + Status */}
					<div className="grid grid-cols-2 gap-3 items-end">
						<div>
							<label className="text-sm font-medium">Upload image</label>
							<div className="border rounded-md p-2 flex items-center gap-2">
								<input
									type="file"
									className="text-sm"
									onChange={e => setForm({ ...form, image: e.target.files[0] })}
								/>
							</div>
						</div>

						<div>
							<label className="text-sm font-medium">Status*</label>
							<select
								className="w-full border rounded-md px-3 py-2 mt-1"
								value={form.status}
								onChange={e => setForm({ ...form, status: e.target.value })}
							>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
						</div>
					</div>

					{/* Assigned Products */}
					<div>
						<label className="text-sm font-medium">Assigned Products</label>
						<select
							className="w-full border rounded-md px-3 py-2 mt-1"
							value={form.assignedProduct}
							onChange={e => setForm({ ...form, assignedProduct: e.target.value })}
						>
							<option value="">Select Product</option>
							{products.map(p => (
								<option key={p.id} value={p.id}>{p.name}</option>
							))}
						</select>
					</div>

					{/* Description */}
					<div>
						<label className="text-sm font-medium">Description*</label>
						<textarea
							rows="3"
							className="w-full border rounded-md px-3 py-2 mt-1"
							value={form.description}
							onChange={e => setForm({ ...form, description: e.target.value })}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-3 mt-6">
					<button
						onClick={onClose}
						className="px-4 py-2 border rounded-md"
					>
						Cancel
					</button>

					<button
						onClick={handleSubmit}
						className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	)
}
