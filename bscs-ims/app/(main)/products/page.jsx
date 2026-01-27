'use client'

import { useState } from 'react'
import ProductModal from '../../../components/ui/products/ProductModal'



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
  Tooltip
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/50',
      name: 'Rice 5kg',
      quantity: 20,
      price: 250
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/50',
      name: 'Rice 10kg',
      quantity: 15,
      price: 480
    }
  ])

  // ✅ modal state (minimal)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productModalMode, setProductModalMode] = useState('create') // "create" | "edit"
  const [productModalInitialValues, setProductModalInitialValues] = useState({})

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = (id) => {
    if (!confirm('Delete this product?')) return
    setProducts(products.filter((p) => p.id !== id))
  }

  // ✅ open create
  const openCreateModal = () => {
    setProductModalMode('create')
    setProductModalInitialValues({})
    setIsProductModalOpen(true)
  }

  // ✅ open edit (prefill from row)
  const openEditModal = (product) => {
    setProductModalMode('edit')
    setProductModalInitialValues({
      productName: product?.name ?? '',
      amount: String(product?.price ?? ''), // using price as amount in your UI for now
      priceUnit: 'Kg',
      status: 'Active',
      description: '',
      imageFile: null // cannot prefill file input
    })
    setIsProductModalOpen(true)
  }

  const closeModal = () => setIsProductModalOpen(false)

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        {/* Header */}
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography variant='h5' fontWeight={700}>
            Products
          </Typography>

          {/* ✅ wire Add button */}
          <Button variant='contained' startIcon={<AddIcon />} onClick={openCreateModal}>
            Add
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
                        textTransform: 'none', // keeps text normal case
                        '&:hover': {
                          backgroundColor: '#162A3F' // slightly darker on hover
                        },
                        height: '30px' // adjust height to match TextField
                      }}
                      onClick={() => {
                        console.log('Search clicked:', search)
                        // put your search function here
                      }}
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

            <Button startIcon={<SortIcon />} variant='outlined'>
              Asc
            </Button>

            <Button startIcon={<SortIcon />} variant='outlined'>
              Desc
            </Button>
          </Stack>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell>
                  <b>Image</b>
                </TableCell>
                <TableCell>
                  <b>Product Name</b>
                </TableCell>
                <TableCell>
                  <b>Quantity</b>
                </TableCell>
                <TableCell>
                  <b>Price</b>
                </TableCell>
                <TableCell align='center'>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align='center' sx={{ py: 6 }}>
                    No products found
                  </TableCell>
                </TableRow>
              )}

              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Avatar src={product.image} variant='rounded' />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>₱{product.price}</TableCell>
                  <TableCell align='center'>
                    <Tooltip title='Edit'>
                      {/* ✅ wire Edit icon */}
                      <IconButton onClick={() => openEditModal(product)}>
                        <EditIcon
                          sx={{
                            fill: '#fff', // fill white
                            stroke: '#000', // outline black
                            strokeWidth: 1.5 // thickness of the outline
                          }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Delete'>
                      {/* keep delete behavior unchanged */}
                      <IconButton onClick={() => handleDelete(product.id)}>
                        <DeleteIcon
                          sx={{
                            fill: '#fff',
                            stroke: '#000',
                            strokeWidth: 1.5
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ✅ render modal once (UI-only) */}
      <ProductModal
        open={isProductModalOpen}
        mode={productModalMode}
        initialValues={productModalInitialValues}
        onClose={closeModal}
      />
    </Box>
  )
}
