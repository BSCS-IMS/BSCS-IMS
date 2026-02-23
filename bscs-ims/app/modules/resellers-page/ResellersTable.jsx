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
  Skeleton
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
                      <ImageIcon fontSize='small' />
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
                  sx={{
                    color: '#374151',
                    py: 2.5,
                    borderRight: '1px solid #e5e7eb',
                    boxShadow: 'none'
                  }}
                  align='center'
                >
                  <Chip
                    label={row.status === 'active' ? 'Active' : 'Not Active'}
                    size='small'
                    sx={{
                      bgcolor: row.status === 'active' ? '#e8f5e9' : '#fff3e0',
                      color: row.status === 'active' ? '#2e7d32' : '#e65100',
                      fontWeight: 500,
                      border: 'none'
                    }}
                  />
                </TableCell>

                <TableCell align='center' sx={{ py: 2.5 }}>
                  <IconButton onClick={() => onEdit(row)} sx={{ color: '#1F384C', mr: 1 }}>
                    <EditIcon />
                  </IconButton>

                  <IconButton onClick={() => onDelete(row.id)} sx={{ color: '#991b1b' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align='center' sx={{ py: 8, color: '#6b7280' }}>
                No resellers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={sortedResellers.length}
        page={page}
        onPageChange={onChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </TableContainer>
  )
}
