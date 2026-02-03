'use client'

import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function ProductTable({ products, loading, onEdit, onDelete }) {
  return (
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
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align='center' sx={{ py: 6 }}>
                {loading ? 'Loading...' : 'No products found'}
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
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
                    <IconButton onClick={() => onEdit(product)}>
                      <EditIcon sx={{ fill: '#fff', stroke: '#000', strokeWidth: 1.5 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <IconButton onClick={() => onDelete(product.id)}>
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
  )
}
