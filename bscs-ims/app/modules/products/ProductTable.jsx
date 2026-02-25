'use client'

import { useState } from 'react'
import {
  Avatar,
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

export default function ProductTable({ products, loading, onEdit, onDelete, onAdd, onMinus, inventory = [] }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (_, newPage) => {
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
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '8%',
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
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '20%',
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
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '22%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Inventory Locations
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '12%',
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
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '12%',
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
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '18%',
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
                <TableCell align='center' sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rounded' width={36} height={36} sx={{ mx: 'auto' }} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={32} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
                <TableCell align='center' sx={{ py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={20} />
                </TableCell>
              </TableRow>
            ))
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align='center' sx={{ py: 6, color: '#6b7280', fontSize: '0.8125rem', boxShadow: 'none' }}>
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
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Avatar src={product.image} variant='rounded' sx={{ mx: 'auto', width: 36, height: 36 }} />
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    py: 2,
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
                        fontSize: '0.8125rem',
                        color: '#1F384C',
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
                        color: '#1F384C',
                        fontSize: '0.75rem'
                      }}
                    >
                      ({product.sku})
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{
                    color: '#374151',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  {(() => {
                    const productInventory = inventory.filter((inv) => inv.productId === product.id)
                    if (productInventory.length === 0) {
                      return (
                        <Typography variant='body2' sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          -
                        </Typography>
                      )
                    }
                    return (
                      <Stack spacing={0.25}>
                        {productInventory.map((inv) => (
                          <Typography key={inv.id} variant='body2' sx={{ color: '#1F384C', fontSize: '0.75rem' }}>
                            {inv.locationName} ({Number(inv.quantity).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })})
                          </Typography>
                        ))}
                      </Stack>
                    )
                  })()}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#1F384C',
                    fontSize: '0.8125rem',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  ₱{(Number(product.price) || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </TableCell>
                <TableCell
                  align='center'
                  sx={{
                    color: '#374151',
                    py: 2,
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
                      fontSize: '0.75rem',
                      height: 24,
                      border: 'none'
                    }}
                  />
                </TableCell>
                <TableCell align='center' sx={{ py: 2, boxShadow: 'none' }}>
                  <Stack direction='row' spacing={0.75} justifyContent='center'>
                    <Tooltip title='Add Stock'>
                      <IconButton
                        onClick={() => onAdd(product)}
                        size='small'
                        sx={{
                          bgcolor: '#e8f5e9',
                          color: '#2e7d32',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            bgcolor: '#c8e6c9',
                          }
                        }}
                      >
                        <AddIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Subtract Stock'>
                      <IconButton
                        onClick={() => onMinus(product)}
                        size='small'
                        sx={{
                          bgcolor: '#fff3e0',
                          color: '#e65100',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            bgcolor: '#ffe0b2',
                          }
                        }}
                      >
                        <RemoveIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Delete Product'>
                      <IconButton
                        onClick={() => onDelete(product)}
                        size='small'
                        sx={{
                          bgcolor: '#ffebee',
                          color: '#c62828',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            bgcolor: '#ffcdd2',
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
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
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.75rem'
          },
          '& .MuiTablePagination-select': {
            fontSize: '0.75rem'
          }
        }}
      />
    </TableContainer>
  )
}
