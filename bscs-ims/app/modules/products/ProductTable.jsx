'use client'

import { useState } from 'react'
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

export default function ProductTable({ products, loading, onEdit, onDelete, onAdd, onMinus }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid #e5e7eb', boxShadow: 'none' }}>
      <Table sx={{ minWidth: 650, tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                color: '#374151',
                py: 2,
                width: '10%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Image
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                color: '#374151',
                py: 2,
                width: '30%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Product Name (SKU)
            </TableCell>
            <TableCell
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
              Price
            </TableCell>
            <TableCell
              align='center'
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
              align='center'
              sx={{
                fontWeight: 600,
                color: '#374151',
                py: 2,
                width: '30%',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell align='center' sx={{ borderRight: '1px solid #e5e7eb', py: 2.5 }}>
                  <Skeleton variant='rounded' width={40} height={40} sx={{ mx: 'auto' }} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2.5 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2.5 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2.5 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
                <TableCell align='center' sx={{ py: 2.5 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
              </TableRow>
            ))
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align='center' sx={{ py: 8, color: '#6b7280', boxShadow: 'none' }}>
                No products found
              </TableCell>
            </TableRow>
          ) : (
            paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell
                  align='center'
                  sx={{
                    color: '#374151',
                    py: 2.5,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Avatar src={product.image} variant='rounded' sx={{ mx: 'auto' }} />
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    py: 2.5,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Stack
                    spacing={0}
                    tabIndex={0}
                    role='button'
                    onClick={() => onEdit(product)}
                    onKeyDown={(e) => e.key === 'Enter' && onEdit(product)}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: '#1e40af',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      component='span'
                      variant='body2'
                      sx={{
                        color: '#1e40af',
                        fontSize: '0.875rem'
                      }}
                    >
                      ({product.sku})
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    py: 2.5,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  ₱
                  {Number(product.price).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    color: '#374151',
                    py: 2.5,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Chip
                    label={product.status}
                    size='small'
                    sx={{
                      bgcolor: product.status === 'Available' ? '#e8f5e9' : '#fff3e0',
                      color: product.status === 'Available' ? '#2e7d32' : '#e65100',
                      fontWeight: 500,
                      border: 'none'
                    }}
                  />
                </TableCell>
                <TableCell align='center' sx={{ py: 2.5, boxShadow: 'none' }}>
                  <Tooltip title='Add'>
                    <IconButton onClick={() => onAdd(product)} size='medium' sx={{ color: '#00c853', mr: 1 }}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title='Minus'>
                    <IconButton onClick={() => onMinus(product.id)} size='medium' sx={{ color: '#d50000', mr: 1 }}>
                      <RemoveIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title='Delete'>
                    <IconButton onClick={() => onDelete(product.id)} size='medium' sx={{ color: '#991b1b' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  )
}
