import { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Skeleton,
  Stack,
  Tooltip
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'

function AssignedProductsCell({ resellerId }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`/api/resellers-product/${resellerId}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || [])
      })
      .catch((err) => console.error(err))
  }, [resellerId])

  if (!products.length) return '-'

  return products.map((p) => p.name).join(', ')
}

export default function ResellersTable({
  paginatedResellers,
  sortedResellers,
  loading,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  onEdit,
  onDelete
}) {
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
              Reseller
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '30%',
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
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '15%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Contact Number
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
          {loading ? (
            Array.from({ length: rowsPerPage }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell align='center' sx={{ borderRight: '1px solid #e5e7eb', py: 2.5 }}>
                  <Skeleton variant='circular' width={42} height={42} sx={{ mx: 'auto' }} />
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
                <TableCell align='center' sx={{ borderRight: '1px solid #e5e7eb', py: 2.5 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
                <TableCell align='center' sx={{ py: 2.5 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
              </TableRow>
            ))
          ) : paginatedResellers.length > 0 ? (
            paginatedResellers.map((row) => (
              <TableRow key={row.id}>
                <TableCell
                  align='center'
                  sx={{
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  {row.imageUrl ? (
                    <Avatar
                      src={row.imageUrl}
                      alt={row.businessName}
                      variant='rounded'
                      sx={{ width: 36, height: 36, mx: 'auto' }}
                    />
                  ) : (
                    <Avatar
                      variant='rounded'
                      sx={{
                        width: 36,
                        height: 36,
                        mx: 'auto',
                        bgcolor: '#E8F1FA',
                        color: '#1F384C'
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                </TableCell>

                <TableCell
                  sx={{
                    color: '#1F384C',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  {row.businessName}
                </TableCell>

                <TableCell
                  sx={{
                    color: '#1F384C',
                    fontSize: '0.75rem',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <AssignedProductsCell resellerId={row.id} />
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
                  {row.contactNumber || '-'}
                </TableCell>

                <TableCell
                  align='center'
                  sx={{
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                >
                  <Chip
                    label={row.status === 'active' ? 'Active' : 'Not Active'}
                    size='small'
                    sx={{
                      bgcolor: row.status === 'active' ? '#e8f5e9' : '#fff3e0',
                      color: row.status === 'active' ? '#2e7d32' : '#e65100',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: 24,
                      border: 'none'
                    }}
                  />
                </TableCell>

                <TableCell align='center' sx={{ py: 2, boxShadow: 'none' }}>
                  <Stack direction='row' spacing={0.75} justifyContent='center'>
                    <Tooltip title='Edit Reseller'>
                      <IconButton
                        onClick={() => onEdit(row)}
                        size='small'
                        sx={{
                          bgcolor: '#e0f2fe',
                          color: '#0369a1',
                          width: 28,
                          height: 28,
                          '&:hover': {
                            bgcolor: '#bae6fd',
                          }
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Delete Reseller'>
                      <IconButton
                        onClick={() => onDelete(row)}
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
          ) : (
            <TableRow>
              <TableCell colSpan={6} align='center' sx={{ py: 6, color: '#6b7280', fontSize: '0.8125rem', boxShadow: 'none' }}>
                No resellers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        count={sortedResellers.length}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
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
