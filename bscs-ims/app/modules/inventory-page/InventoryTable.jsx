import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function InventoryTable({
  paginatedRows,
  sortedRows,
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
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '25%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Location
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '55%',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '2px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              Product Name
            </TableCell>
            <TableCell
              align='center'
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: '#374151',
                py: 1.5,
                width: '20%',
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
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #e5e7eb', py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
                <TableCell align='center' sx={{ py: 2 }}>
                  <Skeleton variant='rectangular' width='100%' height={24} />
                </TableCell>
              </TableRow>
            ))
          ) : paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <TableRow key={row.id} sx={{ verticalAlign: 'top' }}>
                {/* Location — shown once per grouped row */}
                <TableCell
                  sx={{
                    color: '#1F384C',
                    fontSize: '0.8125rem',
                    py: 2,
                    borderRight: '1px solid #e5e7eb',
                    fontWeight: 600
                  }}
                >
                  {row.location}
                </TableCell>

                {/* All products in this location */}
                <TableCell sx={{ color: '#374151', py: 2, borderRight: '1px solid #e5e7eb' }}>
                  <Stack spacing={0.5}>
                    {(row.items ?? []).filter((item) => Number(item.qty) > 0).map((item, idx) => (
                      <Stack key={item.id ?? idx} direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1F384C' }}>
                          {item.productName}
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                          {Number(item.qty).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </TableCell>

                <TableCell align='center' sx={{ py: 2 }}>
                  <Stack direction='row' spacing={0.75} justifyContent='center'>
                    <Tooltip title='Edit Location'>
                      <IconButton
                        onClick={() => onEdit(row)}
                        size='small'
                        sx={{
                          bgcolor: '#e0f2fe',
                          color: '#0369a1',
                          width: 28,
                          height: 28,
                          '&:hover': { bgcolor: '#bae6fd' }
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Clear Stock'>
                      <IconButton
                        onClick={() => onDelete(row)}
                        size='small'
                        sx={{
                          bgcolor: '#ffebee',
                          color: '#c62828',
                          width: 28,
                          height: 28,
                          '&:hover': { bgcolor: '#ffcdd2' }
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
              <TableCell colSpan={3} align='center' sx={{ py: 6, color: '#6b7280', fontSize: '0.8125rem' }}>
                No inventory found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
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