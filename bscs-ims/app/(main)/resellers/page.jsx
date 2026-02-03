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
	Chip
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import CreateResellerModal from './components/ResellerFormModal'
import Avatar from '@mui/material/Avatar'
import ImageIcon from '@mui/icons-material/Image'


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
	const [sortOrder, setSortOrder] = useState('asc')


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
	const filtered = resellers
	.filter(r =>
		r.businessName?.toLowerCase().includes(search.toLowerCase())
	)
	.sort((a, b) => {
		if (sortOrder === 'asc') {
			return a.businessName.localeCompare(b.businessName)
		}
		return b.businessName.localeCompare(a.businessName)
	})


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
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					mb={5}
				>
					<Typography
						variant="h4"
						fontWeight={700}
						sx={{ color: '#1F384C' }}
					>
						Resellers
					</Typography>

					<Button
						variant="text"
						sx={{
							color: '#1F384C',
							flexDirection: 'column',
							minWidth: 'auto',
							textTransform: 'none',
							px: 1.5,
							py: 1,
							'&:hover': {
								bgcolor: '#f3f4f6'
							}
						}}
						onClick={() => {
							setEditingReseller(null)
							setOpenForm(true)
						}}
					>
						<AddIcon sx={{ fontSize: 24 }} />
						Create
					</Button>
				</Stack>


				{/* Search */}
				<Box sx={{ mb: 5 }}>
					<Stack direction="row" spacing={2} alignItems="center">
						<TextField
							placeholder="Search reseller..."
							size="small"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							sx={{ flexGrow: 1 }}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon fontSize="small" sx={{ color: '#6b7280' }} />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<Button
											variant="contained"
											size="small"
											sx={{
												bgcolor: '#1F384C',
												color: '#fff',
												textTransform: 'none',
												minWidth: '70px',
												borderRadius: 1.5,
												'&:hover': { bgcolor: '#162A3F' }
											}}
										>
											Search
										</Button>
									</InputAdornment>
								),
								sx: {
									pr: 1,
									borderRadius: 2,
									height: '48px'
								}
							}}
						/>

						<Button
							variant="text"
							sx={{
								color: '#1F384C',
								flexDirection: 'column',
								minWidth: 'auto',
								textTransform: 'none',
								height: '48px',
								px: 2,
								'&:hover': { bgcolor: '#f3f4f6' }
							}}
						>
							<FilterAltOutlinedIcon sx={{ fontSize: 18 }} />
							Filter
						</Button>

						<Button
							onClick={() =>
								setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
							}
							variant="text"
							sx={{
								color: '#1F384C',
								flexDirection: 'column',
								minWidth: 'auto',
								textTransform: 'none',
								height: '48px',
								px: 2,
								'&:hover': { bgcolor: '#f3f4f6' }
							}}
						>
							<SortIcon sx={{ fontSize: 18 }} />
							{sortOrder === 'asc' ? 'Sort A–Z' : 'Sort Z–A'}
						</Button>
					</Stack>
				</Box>


				{/* Table */}
				<TableContainer component={Paper} sx={{ border: '1px solid #e5e7eb', boxShadow: 'none' }}>
					<Table sx={{ minWidth: 650, tableLayout: 'fixed' }}>

						<TableHead>
							<TableRow>
								<TableCell
									align="center"
									sx={{
										fontWeight: 600,
										color: '#374151',
										py: 2,
										width: '10%',
										borderRight: '1px solid #e5e7eb',
										borderBottom: '2px solid #e5e7eb'
									}}
								>
									Image
								</TableCell>

								<TableCell
									sx={{
										fontWeight: 600,
										color: '#374151',
										py: 2,
										width: '25%',
										borderRight: '1px solid #e5e7eb',
										borderBottom: '2px solid #e5e7eb',
										boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
									}}
								>
									Reseller
								</TableCell>

								<TableCell
									sx={{
										fontWeight: 600,
										color: '#374151',
										py: 2,
										width: '35%',
										borderRight: '1px solid #e5e7eb',
										borderBottom: '2px solid #e5e7eb',
										boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
									}}
								>
									Products Owned
								</TableCell>

								<TableCell
									sx={{
										fontWeight: 600,
										color: '#374151',
										py: 2,
										width: '20%',
										borderRight: '1px solid #e5e7eb',
										borderBottom: '2px solid #e5e7eb',
										boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
									}}
								>
									Contact Number
								</TableCell>

								<TableCell
									align="center"
									sx={{
										fontWeight: 600,
										color: '#374151',
										py: 2,
										width: '15%',
										borderRight: '1px solid #e5e7eb',
										borderBottom: '2px solid #e5e7eb',
										boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
									}}
								>
									Status
								</TableCell>


								<TableCell
									align="center"
									sx={{
										fontWeight: 600,
										color: '#374151',
										py: 2,
										width: '15%',
										borderBottom: '2px solid #e5e7eb',
										boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
									}}
								>
									Actions
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{filtered
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => (
									<TableRow key={row.id}>

										<TableCell
											align="center"
											sx={{
												py: 2.5,
												borderRight: '1px solid #e5e7eb'
											}}
										>
											{row.imageUrl ? (
												<Avatar
													src={row.imageUrl}
													alt={row.businessName}
													sx={{
														width: 42,
														height: 42,
														mx: 'auto'
													}}
												/>
											) : (
												<Avatar
													sx={{
														width: 42,
														height: 42,
														mx: 'auto',
														bgcolor: '#E8F1FA',
														color: '#1F384C'
													}}
												>
													<ImageIcon fontSize="small" />
												</Avatar>
											)}
										</TableCell>


										<TableCell
											sx={{
												color: '#374151',
												py: 2.5,
												borderRight: '1px solid #e5e7eb',
												fontWeight: 600
											}}
										>
											{row.businessName}
										</TableCell>

										

										<TableCell
											sx={{
												color: '#374151',
												py: 2.5,
												borderRight: '1px solid #e5e7eb'
											}}
										>
											<AssignedProductsCell resellerId={row.id} />
										</TableCell>

										<TableCell
											sx={{
												color: '#374151',
												py: 2.5,
												borderRight: '1px solid #e5e7eb'
											}}
										>
											{row.contactNumber}
										</TableCell>

										<TableCell
											align="center"
											sx={{
												
												py: 2.5,
												borderRight: '1px solid #e5e7eb'
											}}
										>
											<Chip
												label={row.status === 'active' ? 'Active' : 'Not Active'}
												size="small"
												sx={{
													backgroundColor: row.status === 'active' ? '#2e7d32' : '#c62828',
													color: '#fff',
													fontWeight: 400,
													borderRadius: '999px',
													minWidth: 90,
													textAlign: 'center'
												}}
											/>
										</TableCell>

										<TableCell align="center" sx={{ py: 2.5 }}>
											<IconButton
												onClick={() => {
													setEditingReseller(row)
													setOpenForm(true)
												}}
												sx={{ color: '#1F384C', mr: 1 }}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												onClick={() => handleDelete(row.id)}
												sx={{ color: '#991b1b' }}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={filtered.length}
						page={page}
						onPageChange={(e, newPage) => setPage(newPage)}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={(e) => {
							setRowsPerPage(parseInt(e.target.value, 10))
							setPage(0)
						}}
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
						
					}}
				/>
			)}
		</Box>
	)
}
