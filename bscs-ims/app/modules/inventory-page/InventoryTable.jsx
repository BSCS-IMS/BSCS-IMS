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
                color: '#374151',
                py: 2,
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
                color: '#374151',
                py: 2,
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
                color: '#374151',
                py: 2,
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
          ) : paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <TableRow key={row.id} sx={{ verticalAlign: 'top' }}>
                {/* Location — shown once per grouped row */}
                <TableCell
                  sx={{
                    color: '#374151',
                    py: 2.5,
                    borderRight: '1px solid #e5e7eb',
                    fontWeight: 600
                  }}
                >
                  {row.location}
                </TableCell>

                {/* All products in this location */}
                <TableCell sx={{ color: '#374151', py: 2.5, borderRight: '1px solid #e5e7eb' }}>
                  {(row.items ?? []).map((item, idx) => (
                    <Typography
                      key={item.id ?? idx}
                      variant='body2'
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: idx < row.items.length - 1 ? 0.75 : 0 }}
                    >
                      {item.productName}
                      <Typography component='span' variant='body2' sx={{ color: '#6b7280' }}>
                        ({item.qty} qty)
                      </Typography>
                    </Typography>
                  ))}
                </TableCell>

                <TableCell align='center' sx={{ py: 2.5 }}>
                  <IconButton onClick={() => onEdit(row)} size='medium' sx={{ color: '#1F384C', mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(row)} size='medium' sx={{ color: '#991b1b' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align='center' sx={{ py: 8, color: '#6b7280' }}>
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
      />
    </TableContainer>
  )
}