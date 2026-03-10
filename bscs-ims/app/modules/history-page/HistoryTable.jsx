'use client'

import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip
} from '@mui/material'
import { useRouter } from 'next/navigation'

function formatDateTime(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Always show 2 decimal places, with + prefix for positive
function formatAdjustment(value) {
  const fixed = Math.abs(value).toFixed(2)
  return value > 0 ? `+${fixed}` : `-${fixed}`
}

function AdjustmentText({ value }) {
  const isAdd = value > 0
  return (
    <Typography
      component='span'
      sx={{
        fontWeight: 600,
        fontSize: '0.8125rem',
        color: isAdd ? '#2e7d32' : '#c62828'
      }}
    >
      {formatAdjustment(value)}
    </Typography>
  )
}

function CategoryChip({ category }) {
  const isAdd = category === 'ADD QUANTITY'
  return (
    <Typography
      component='span'
      sx={{
        display: 'inline-block',
        fontWeight: 500,
        fontSize: '0.7rem',
        color: isAdd ? '#2e7d32' : '#c62828',
        bgcolor: isAdd ? '#e8f5e9' : '#ffebee',
        px: 1.25,
        py: 0.4,
        borderRadius: '16px',
        lineHeight: 1.5,
        whiteSpace: 'nowrap'
      }}
    >
      {category}
    </Typography>
  )
}

const headerCellSx = {
  fontWeight: 600,
  fontSize: '0.8125rem',
  color: '#374151',
  py: 1.5,
  borderRight: '1px solid #e5e7eb',
  borderBottom: '2px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  whiteSpace: 'nowrap'
}

const bodyCellSx = {
  fontSize: '0.75rem',
  color: '#374151',
  py: 2,
  borderRight: '1px solid #e5e7eb',
  boxShadow: 'none'
}

export default function HistoryTable({ history = [], loading, page, rowsPerPage, onChangePage, onChangeRowsPerPage }) {
  const router = useRouter()
  const paginated = history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleProductClick = (productId) => {
    router.push(`/products?productId=${productId}&page=0`)
  }

  // Skeleton rows — match rowsPerPage count so layout doesn't jump
  const skeletonCount = rowsPerPage || 10

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid #e5e7eb', boxShadow: 'none' }}>
      <Table sx={{ minWidth: 800, tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, width: '18%' }}>Product</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '14%' }}>Location</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '10%' }} align='center'>
              Adjustment
            </TableCell>
            <TableCell sx={{ ...headerCellSx, width: '16%' }}>Resulting Qty</TableCell>
            <TableCell sx={{ ...headerCellSx, width: '16%' }} align='center'>
              Category
            </TableCell>
            <TableCell sx={{ ...headerCellSx, width: '16%', borderRight: 'none' }} align='center'>
              Date & Time
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: skeletonCount }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <TableCell key={j} sx={{ ...bodyCellSx, borderRight: j === 5 ? 'none' : '1px solid #e5e7eb' }}>
                    <Skeleton variant='rectangular' width='80%' height={18} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : history.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                align='center'
                sx={{ py: 6, color: '#6b7280', fontSize: '0.8125rem', boxShadow: 'none' }}
              >
                No history records found
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((row) => (
              <TableRow key={row.id}>
                {/* Product — name + SKU, clickable */}
                <TableCell sx={bodyCellSx}>
                  <Tooltip
                    title={
                      <span>
                        View <strong>{row.productName}</strong> in Products
                      </span>
                    }
                    arrow
                    placement='top'
                  >
                    <Typography
                      variant='body2'
                      fontWeight={700}
                      onClick={() => handleProductClick(row.productId)}
                      sx={{
                        color: '#1F384C',
                        fontSize: '0.8125rem',
                        lineHeight: 1.3,
                        cursor: 'pointer',
                        display: 'inline',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      noWrap
                    >
                      {row.productName}
                    </Typography>
                  </Tooltip>
                  <Typography
                    variant='caption'
                    sx={{ color: '#9ca3af', fontSize: '0.7rem', display: 'block', mt: 0.25 }}
                  >
                    {row.productSku}
                  </Typography>
                </TableCell>

                {/* Location */}
                <TableCell sx={bodyCellSx}>
                  <span
                    style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {row.locationName}
                  </span>
                </TableCell>

                {/* Adjustment — text color only, no background, 2 decimals */}
                <TableCell sx={{ ...bodyCellSx }} align='center'>
                  <AdjustmentText value={row.adjustment} />
                </TableCell>

                {/* Resulting Quantity — "previously" instead of "was" */}
                <TableCell sx={bodyCellSx}>
                  <Typography component='span' sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1F384C' }}>
                    {formatAdjustment(row.resultingQuantity)}
                  </Typography>
                  <Typography component='span' sx={{ fontSize: '0.7rem', color: '#9ca3af', ml: 0.75 }}>
                    (previously {formatAdjustment(row.previousQuantity)})
                  </Typography>
                </TableCell>

                {/* Category — centered, text color only */}
                <TableCell sx={{ ...bodyCellSx }} align='center'>
                  <CategoryChip category={row.category} />
                </TableCell>

                {/* Date & Time */}
                <TableCell sx={{ ...bodyCellSx, borderRight: 'none', color: '#6b7280' }} align='center'>
                  {formatDateTime(row.timestamp)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        count={history.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.75rem'
          },
          '& .MuiTablePagination-select': { fontSize: '0.75rem' }
        }}
      />
    </TableContainer>
  )
}
