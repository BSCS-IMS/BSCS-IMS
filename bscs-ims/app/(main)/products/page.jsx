"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ProductModal from '../../modules/products/ProductModal'

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
  Avatar,
  InputAdornment,
  Stack,
  Tooltip,
  Chip
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productModalMode, setProductModalMode] = useState('create') // "create" | "edit"
  const [productModalInitialValues, setProductModalInitialValues] = useState({})

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/products')
      if (res.data.success) {
        setProducts(res.data.products.map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          image: p.imageUrl,
          price: p.currentPrice,
          priceUnit: p.priceUnit,
          status: p.isActive ? 'Available' : 'Not Available'
        })))
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Delete product (UI-only for now)
  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    // TODO: call DELETE API when implemented
    setProducts(products.filter((p) => p.id !== id))
  }

  // Open create modal
  const openCreateModal = () => {
    setProductModalMode('create')
    setProductModalInitialValues({})
    setIsProductModalOpen(true)
  }

  // Open edit modal
  const openEditModal = (product) => {
    setProductModalMode('edit')
    setProductModalInitialValues({
      productName: product.name,
      amount: product.price,
      priceUnit: product.priceUnit,
      sku: product.sku,
      status: product.status,
      imageFile: null
    })
    setIsProductModalOpen(true)
  }

  const closeModal = () => setIsProductModalOpen(false)

  // Filter + sort products
  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortOrder) return 0
      if (sortOrder === 'asc') return a.name.localeCompare(b.name)
      if (sortOrder === 'desc') return b.name.localeCompare(a.name)
      return 0
    })

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        {/* Header */}
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography variant='h5' fontWeight={700}>
            Products
          </Typography>

          {/* Add button */}
          <Button
            variant='contained'
            disableElevation
            onClick={openCreateModal}
            sx={{
              flexDirection: 'column',
              px: 1.5,
              py: 1,
              minWidth: 60,
              textTransform: 'none',
              bgcolor: '#f5f7fb',
              color: '#000000',
              '&:hover': { bgcolor: '#f0f0f0' }
            }}
          >
            <AddIcon />
            <Typography fontSize={14}>Add</Typography>
          </Button>
        </Stack>

        {/* Search + Actions */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction='row' spacing={2} alignItems='center'>
            <TextField
              placeholder='Search'
              size='small'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 700 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon fontSize='small' />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: '#1F384C',
                        color: '#fff',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#162A3F' },
                        height: '30px'
                      }}
                      onClick={fetchProducts} // refresh search
                    >
                      Search
                    </Button>
                  </InputAdornment>
                )
              }}
            />

            <Button startIcon={<FilterListIcon />} variant='outlined'>
              Filter
            </Button>

            <Button startIcon={<SortIcon />} variant='outlined' onClick={() => setSortOrder('asc')}>
              Asc
            </Button>

            <Button startIcon={<SortIcon />} variant='outlined' onClick={() => setSortOrder('desc')}>
              Desc
            </Button>
          </Stack>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell align='center'><b>Image</b></TableCell>
                <TableCell align='center'><b>Product Name (SKU)</b></TableCell>
                <TableCell align='center'><b>Unit</b></TableCell>
                <TableCell align='center'><b>Price</b></TableCell>
                <TableCell align='center'><b>Status</b></TableCell>
                <TableCell align='center'><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align='center' sx={{ py: 6 }}>
                    {loading ? 'Loading...' : 'No products found'}
                  </TableCell>
                </TableRow>
              )}

              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover sx={{ height: 72 }}>
                  <TableCell align='center'>
                    <Avatar src={product.image} variant='rounded' />
                  </TableCell>

                  <TableCell align='center'>
                    <Box>
                      <Typography fontWeight={600}>{product.name}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        ({product.sku})
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align='center'>{product.priceUnit}</TableCell>
                  <TableCell align='center'>₱{product.price}</TableCell>

                  <TableCell align='center'>
                    <Chip
                      label={product.status}
                      size='small'
                      color={product.status === 'Available' ? 'success' : 'warning'}
                    />
                  </TableCell>

                  <TableCell align='center'>
                    <Tooltip title='Edit'>
                      <IconButton onClick={() => openEditModal(product)}>
                        <EditIcon sx={{ fill: '#fff', stroke: '#000', strokeWidth: 1.5 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Delete'>
                      <IconButton onClick={() => handleDelete(product.id)}>
                        <DeleteIcon sx={{ fill: '#fff', stroke: '#000', strokeWidth: 1.5 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Product modal */}
      <ProductModal
        open={isProductModalOpen}
        mode={productModalMode}
        initialValues={productModalInitialValues}
        onClose={closeModal}
        onSave={fetchProducts} // refresh products after save
      />
    </Box>
  )
}
