'use client'

import { useState } from 'react'
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
  const [products, setProducts] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/50',
      sku: 'Sinan5KG',
      name: 'Sinandomeng',
      unit: 'Kilo',
      price: 250,
      status: 'Available'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/50',
      sku: 'Coco10KG',
      name: 'Coco Pandan',
      unit: 'Kilo',
      price: 480,
      status: 'Not Available'
    }
  ])

  const handleDelete = (id) => {
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

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={700}>
            Products
          </Typography>

          {/* Add button (icon top, text bottom) */}
          <Button
            variant="contained"
            disableElevation
            sx={{
              flexDirection: 'column',
              px: 1.5,
              py: 1,
              minWidth: 60,
              textTransform: 'none',
              bgcolor: '#f5f7fb',
              color: '#000000',
              '&:hover': { bgcolor: '#f0f0f0' },
            }}
          >
            <AddIcon />
            <Typography fontSize={14}>Add</Typography>
          </Button>

        </Stack>

        {/* Search + Actions */}
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
                        color: '#fff',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#162A3F' },
                        height: '30px'
                      }}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                )
              }}
            />

            {/* Restored Buttons */}
            <Button startIcon={<FilterListIcon />} variant="outlined">
              Filter
            </Button>

            <Button
              startIcon={<SortIcon />}
              variant="outlined"
              onClick={() => setSortOrder('asc')}
            >
              Asc
            </Button>

            <Button
              startIcon={<SortIcon />}
              variant="outlined"
              onClick={() => setSortOrder('desc')}
            >
              Desc
            </Button>
          </Stack>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell align="center"><b>Image</b></TableCell>
                <TableCell align="center"><b>Product Name (SKU)</b></TableCell>
                <TableCell align="center"><b>Unit</b></TableCell>
                <TableCell align="center"><b>Price</b></TableCell>
                <TableCell align="center"><b>Status</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    No products found
                  </TableCell>
                </TableRow>
              )}

              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover sx={{ height: 72 }}>
                  <TableCell align="center">
                    <Avatar src={product.image} variant="rounded" />
                  </TableCell>

                  <TableCell align="center">
                    <Box>
                      <Typography fontWeight={600}>{product.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({product.sku})
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">{product.unit}</TableCell>
                  <TableCell align="center">₱{product.price}</TableCell>

                  <TableCell align="center">
                    <Chip
                      label={product.status}
                      size="small"
                      color={product.status === 'Available' ? 'success' : 'warning'}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton>
                        <EditIcon sx={{ fill: '#fff', stroke: '#000', strokeWidth: 1.5 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
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
    </Box>
  )
}
