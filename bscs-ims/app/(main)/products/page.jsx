'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
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
  Chip,
  useMediaQuery
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'

import {
  Search,
  Plus,
  Edit as Edit2,
  Trash2,
  Filter,
  ArrowUpAZ,
  ArrowDownAZ,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function ProductsPage() {
  const isDesktop = useMediaQuery('(min-width:900px)')

  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productModalMode, setProductModalMode] = useState('create')
  const [productModalInitialValues, setProductModalInitialValues] = useState({})

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/products')
      if (res.data.success) {
        setProducts(
          res.data.products.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            image: p.imageUrl,
            price: p.currentPrice,
            priceUnit: p.priceUnit,
            status: p.isActive ? 'Available' : 'Not Available'
          }))
        )
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

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return

    setProducts(products.filter((p) => p.id !== id))
  }

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortOrder) return 0
      if (sortOrder === 'asc') return a.name.localeCompare(b.name)
      if (sortOrder === 'desc') return b.name.localeCompare(a.name)
      return 0
    })

  const openCreateModal = () => {
    setProductModalMode('create')
    setProductModalInitialValues({})
    setIsProductModalOpen(true)
  }

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
  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  if (!isDesktop) {
    return (
      <div className='min-h-screen bg-[#f5f7fb] py-6 px-3 sm:px-6 relative'>
        <div className='max-w-6xl mx-auto space-y-4'>
          {/* Header */}
          <h1 className='text-xl font-bold'>Products</h1>

          {/* Floating Add Button */}
          <button
            onClick={openCreateModal}
            className='fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#1F384C] text-white shadow-lg flex items-center justify-center hover:bg-[#162A3F] active:scale-95 transition'
          >
            <Plus size={24} />
          </button>

          {/* Search + Filter */}
          <div className='bg-white rounded-lg p-3 shadow-sm space-y-2'>
            <div className='flex items-center gap-2'>
              <div className='flex-1 relative'>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search'
                  className='w-full pl-3 pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
                <button
                  onClick={() => {}}
                  className='absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white hover:bg-[#1F384C] rounded'
                >
                  <Search size={16} />
                </button>
              </div>
              <button
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className='flex items-center gap-1 border rounded-md px-3 py-2 text-sm hover:bg-gray-50'
              >
                <Filter size={16} />
                Filter
              </button>
            </div>

            {isFilterOpen && (
              <div className='flex gap-2 mt-2'>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`flex-1 border rounded-md py-2 text-sm flex items-center justify-center gap-1 ${sortOrder === 'asc' ? 'bg-gray-100' : ''}`}
                >
                  <ArrowUpAZ size={16} />
                  Asc
                </button>
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`flex-1 border rounded-md py-2 text-sm flex items-center justify-center gap-1 ${sortOrder === 'desc' ? 'bg-gray-100' : ''}`}
                >
                  <ArrowDownAZ size={16} />
                  Desc
                </button>
              </div>
            )}
          </div>

          {/* Products */}
          <div className='space-y-3'>
            {filteredProducts.length === 0 && (
              <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm'>No products found</div>
            )}

            {filteredProducts.map((product) => {
              const isOpen = expandedId === product.id
              return (
                <div key={product.id} className='bg-white rounded-lg shadow-sm border overflow-hidden'>
                  <button
                    onClick={() => toggleExpand(product.id)}
                    className='w-full flex items-center justify-between px-4 py-3 text-left'
                  >
                    <span className='font-semibold'>{product.name}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div className='px-4 pb-4 space-y-3 text-sm border-t'>
                      <div className='flex items-center gap-3 pt-3'>
                        <img src={product.image} alt='' className='w-12 h-12 rounded-md object-cover' />
                        <div>
                          <div className='font-medium'>{product.name}</div>
                          <div className='text-xs text-gray-500'>SKU: {product.sku}</div>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-y-2'>
                        <div>
                          <span className='text-gray-500'>Unit:</span> {product.unit}
                        </div>
                        <div>
                          <span className='text-gray-500'>Price:</span> ₱{product.price}
                        </div>
                        <div>
                          <span className='text-gray-500'>Status:</span>{' '}
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              product.status === 'Available'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>

                      <div className='flex gap-2 pt-2'>
                        <button
                          onClick={() => openEditModal(product)}
                          className='flex-1 border rounded-md py-2 flex items-center justify-center gap-1 hover:bg-gray-50'
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className='flex-1 border rounded-md py-2 flex items-center justify-center gap-1 hover:bg-gray-50'
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Modal */}
        <ProductModal
          open={isProductModalOpen}
          mode={productModalMode}
          initialValues={productModalInitialValues}
          onClose={closeModal}
          fullScreen={!isDesktop}
        />
      </div>
    )
  }

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
              color: '#000',
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
                      onClick={fetchProducts}
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
                <TableCell align='center'>
                  <b>Image</b>
                </TableCell>
                <TableCell align='center'>
                  <b>Product Name (SKU)</b>
                </TableCell>
                <TableCell align='center'>
                  <b>Unit</b>
                </TableCell>
                <TableCell align='center'>
                  <b>Price</b>
                </TableCell>
                <TableCell align='center'>
                  <b>Status</b>
                </TableCell>
                <TableCell align='center'>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center' sx={{ py: 6 }}>
                    {loading ? 'Loading...' : 'No products found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Product modal */}
      <ProductModal
        key={open ? (initialValues?.id ?? 'create') : 'closed'}
        open={open}
        mode={mode}
        initialValues={initialValues}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </Box>
  )
}
