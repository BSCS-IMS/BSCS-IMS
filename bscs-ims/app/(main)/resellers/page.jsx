'use client'

import { useState, useEffect } from 'react'

import {
	Box,
	Typography,
	TextField,
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	InputAdornment,
	Stack,
	Tooltip,
	TablePagination,
	Switch
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

import CreateResellerModal from './components/ResellerFormModal'

function AssignedProductsCell({ resellerId }) {
	const [products, setProducts] = useState([])

	useEffect(() => {
		console.log('FETCH START:', resellerId)

		fetch(`/api/resellers-product/${resellerId}`)
			.then(r => {
				console.log('STATUS:', r.status)
				return r.json()
			})
			.then(d => {
				console.log('API DATA:', d)
				setProducts(d.products || [])
			})
			.catch(err => console.error(err))
	}, [resellerId])

	if (!products.length) return '-'

	return products.map(p => p.name).join(', ')
}


export default function ResellersPage() {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const [resellers, setResellers] = useState([])
	const [openForm, setOpenForm] = useState(false)
	const [editingReseller, setEditingReseller] = useState(null)

	// 🔥 SINGLE SOURCE OF TRUTH - Resellers
	const fetchResellers = async () => {
		try {
			const res = await fetch('/api/resellers', { cache: 'no-store' })
			if (!res.ok) throw new Error('Failed to fetch resellers')
			const data = await res.json()
			setResellers(data)
		} catch (err) {
			console.error(err)
		}
	}


	useEffect(() => {
		fetchResellers()
	}, [])

	// Search filter
	const filtered = resellers.filter(r =>
		r.businessName?.toLowerCase().includes(search.toLowerCase())
	)

	// Delete reseller
	async function handleDelete(id) {
		if (!confirm('Delete this reseller?')) return

		const res = await fetch(`/api/resellers/${id}`, { method: 'DELETE' })
		const data = await res.json()
		if (!res.ok) {
			alert(data.message || 'Delete failed')
			return
		}
		setResellers(prev => prev.filter(r => r.id !== id))
	}

	// Toggle activation status
	async function handleToggleStatus(row) {
		const newStatus = row.status === 'active' ? 'inactive' : 'active'
		try {
			const res = await fetch(`/api/resellers/${row.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
							resellerId: editingReseller.id, // ✅ DOCUMENT ID
							productId: selectedProductId 
				})
			})
			if (!res.ok) throw new Error('Failed to update status')
			fetchResellers()
		} catch (err) {
			console.error(err)
			alert('Could not update status')
		}
	}

	

	return (
		<Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 4 }}>
			<Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
					<Typography variant="h5" fontWeight={700}>
						Resellers
					</Typography>

					<Button
						startIcon={<AddIcon />}
						variant="text"
						sx={{ textTransform: 'none', fontWeight: 500 }}
						onClick={() => {
							setEditingReseller(null)
							setOpenForm(true)
						}}
					>
						Add
					</Button>
				</Stack>

				{/* Search */}
				<Paper sx={{ p: 2, mb: 2 }}>
					<Stack direction="row" spacing={2} alignItems="center">
						<TextField
							placeholder="Search"
							size="small"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							sx={{ width: 700 }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon fontSize="small" />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<Button
											variant="contained"
											sx={{
												backgroundColor: '#1F384C',
												textTransform: 'none',
												height: 30,
												'&:hover': { backgroundColor: '#162A3F' }
											}}
										>
											Search
										</Button>
									</InputAdornment>
								)
							}}
						/>

						<Button startIcon={<FilterListIcon />} variant="outlined">
							Filter
						</Button>

						<Button startIcon={<SortIcon />} variant="outlined">
							Sort asc
						</Button>

						<Button startIcon={<SortIcon />} variant="outlined">
							Sort desc
						</Button>
					</Stack>
				</Paper>

				{/* Table */}
				<TableContainer component={Paper}>
					<Table>
						<TableHead sx={{ bgcolor: '#fafafa' }}>
							<TableRow>
								<TableCell><b>Reseller</b></TableCell>
								<TableCell><b>Products Owned</b></TableCell>
								<TableCell><b>Contact number</b></TableCell>
								<TableCell><b>Status</b></TableCell>
								<TableCell align="center"><b>Actions</b></TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{filtered
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {

									
									return (
										<TableRow key={row.id} hover>
											<TableCell>{row.businessName}</TableCell>

											{/* ✅ DITO NA LALABAS ANG ASSIGNED PRODUCT */}
											<TableCell>
												<AssignedProductsCell resellerId={row.id} />
											</TableCell>


											<TableCell>{row.contactNumber}</TableCell>

											<TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<Switch
													checked={row.status === 'active'}
													onChange={() => handleToggleStatus(row)}
													size="small"
												/>
												<Typography variant="body2" sx={{ width: 55 }}>
													{row.status}
												</Typography>
											</TableCell>

											<TableCell align="center">
												<Tooltip title="Edit">
													<IconButton
														onClick={() => {
															setEditingReseller(row)
															setOpenForm(true)
														}}
													>
														<EditIcon sx={{ fill: '#fff', stroke: '#000', strokeWidth: 1.5 }} />
													</IconButton>
												</Tooltip>

												<Tooltip title="Delete">
													<IconButton onClick={() => handleDelete(row.id)}>
														<DeleteIcon sx={{ fill: '#fff', stroke: '#000', strokeWidth: 1.5 }} />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									)
								})}
						</TableBody>

					</Table>

					<TablePagination
						component="div"
						count={filtered.length}
						page={page}
						onPageChange={(e, newPage) => setPage(newPage)}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={(e) => {
							setRowsPerPage(parseInt(e.target.value, 10))
							setPage(0)
						}}
						rowsPerPageOptions={[5, 10, 25]}
					/>
				</TableContainer>
			</Box>

			{/* Form Modal (Add/Edit) */}
			{openForm && (
				<CreateResellerModal
					reseller={editingReseller} // null → Add, object → Edit
					onClose={() => {
						setOpenForm(false)
						fetchResellers()
						fetchResellerProducts()
					}}
				/>
			)}
		</Box>
	)
}
