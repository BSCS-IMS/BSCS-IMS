'use client'

import { useState, useEffect } from 'react'

export default function ResellerFormModal({ onClose, reseller = null }) {
	const [form, setForm] = useState({
		businessName: '',
		contactNumber: '',
		address: '',
		status: 'active',
		description: '',
		assignedProducts: [], 
		image: null
	})

	const [products, setProducts] = useState([]) // <-- products state
	const [selectedProductId, setSelectedProductId] = useState('')
	const [showProductDropdown, setShowProductDropdown] = useState(false)
	const [previewImage, setPreviewImage] = useState(null)




	// Pre-fill form kapag Edit mode
	useEffect(() => {
		if (reseller) {
			setForm(prev => ({
				...prev,
				businessName: reseller.businessName || '',
				contactNumber: reseller.contactNumber || '',
				address: reseller.address || '',
				status: reseller.status || 'active',
				description: reseller.notes || ''
			}))
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

	useEffect(() => {
		if (!reseller) return

		const fetchAssignedProducts = async () => {
			try {
				const res = await fetch(`/api/resellers-product/${reseller.id}`)
				const data = await res.json()

				setForm(prev => ({
					...prev,
					assignedProducts: Array.isArray(data.products)
						? data.products.map(p => p.id)
						: []
				}))
			} catch (err) {
				console.error(err)
			}
		}

		fetchAssignedProducts()
	}, [reseller])


	async function handleSubmit() {
	const method = reseller ? 'PATCH' : 'POST'
	const url = reseller ? `/api/resellers/${reseller.id}` : '/api/resellers'

	// 1️⃣ Create or update reseller
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

	if (!res.ok) {
	alert('Failed to save reseller')
	return
}



	const resellerId = reseller ? reseller.id : data.id

	// 2️⃣ 🔥 EDIT MODE ONLY: DELETE ALL OLD PRODUCTS
	if (reseller) {
		await fetch(`/api/resellers-product/${resellerId}`, {
			method: 'DELETE'
		})
	}

	// 3️⃣ INSERT CURRENT SELECTION
	for (const productId of form.assignedProducts) {
		await fetch('/api/resellers-product', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				resellerId,
				productId,
				isActive: true,
				userId: 'SYSTEM'
			})
		})
	}

	// 4️⃣ CLOSE MODAL + REFRESH
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
									accept="image/*"
									className="text-sm"
									onChange={e => {
										const file = e.target.files[0]
										if (!file) return

										setForm({ ...form, image: file })
										setPreviewImage(URL.createObjectURL(file))
									}}
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
						<div className="relative">
							<label className="text-sm font-medium">Assigned Products</label>

							{/* Input-like box */}
							<div
								onClick={() => setShowProductDropdown(prev => !prev)}
								className="w-full border rounded-md px-3 py-2 mt-1 min-h-[42px]
									flex flex-wrap gap-2 items-center cursor-pointer"
							>
								{form.assignedProducts.length === 0 && (
									<span className="text-sm text-gray-400">Select products</span>
								)}

								{products
									.filter(p => form.assignedProducts.includes(p.id))
									.map(p => (
										<span
											className="flex items-center gap-1 text-xs px-2 py-1
												bg-[#E8F1FA] text-[#1F384C] rounded-full"
										>

											{p.name}
											<button
												onClick={e => {
													e.stopPropagation()
													setForm(prev => ({
														...prev,
														assignedProducts: prev.assignedProducts.filter(id => id !== p.id)
													}))
												}}
												className="w-4 h-4 flex items-center justify-center
													rounded-full text-[10px]
													bg-[#D6E8F7] text-[#1F384C]
													hover:bg-[#1F384C] hover:text-white
													active:scale-90 transition cursor-pointer"
											>
												✕
											</button>

										</span>
									))}
							</div>

							{/* Dropdown */}
							{showProductDropdown && (
								<div className="absolute z-10 w-full mt-1 bg-white border rounded-md
									shadow-md max-h-40 overflow-y-auto">
									{products.map(p => {
										const selected = form.assignedProducts.includes(p.id)

										return (
											<div
												key={p.id}
												onClick={() => {
													setForm(prev => ({
														...prev,
														assignedProducts: selected
															? prev.assignedProducts.filter(id => id !== p.id)
															: [...prev.assignedProducts, p.id]
													}))
												}}
												className={`px-3 py-2 text-sm cursor-pointer
													hover:bg-[#1F384C]/10
													${selected ? 'font-medium text-[#1F384C]' : ''}`}
											>
												{p.name}
											</div>
										)
									})}
								</div>
							)}
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
						className="px-5 py-2 bg-[#1F384C] text-white rounded-md hover:bg-[#162A3F]"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	)
}