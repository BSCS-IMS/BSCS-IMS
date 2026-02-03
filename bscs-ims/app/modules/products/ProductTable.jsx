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

import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  onAdd,
  onMinus
}) {
  return (
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
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                {loading ? 'Loading...' : 'No products found'}
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} hover sx={{ height: 72 }}>
                <TableCell align="center">
                  <Avatar src={product.image} variant="rounded" />
                </TableCell>

                {/* ✅ CLICKABLE PRODUCT NAME */}
                <TableCell align="center">
                  <Box>
                    <Typography
                      tabIndex={0}
                      role="button"
                      onClick={() => onEdit(product)}
                      onKeyDown={(e) => e.key === 'Enter' && onEdit(product)}
                      sx={{
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-block',
                        px: 0.5,
                        borderRadius: 1,
                        transition: 'all .2s ease',
                        color: 'primary.main',
                        '&:hover': {
                          transform: 'scale(1.03)'
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: 2,
                          boxShadow: '0 0 8px rgba(25,118,210,.6)'
                        }
                      }}
                    >
                      {product.name}
                    </Typography>
        
                    <Typography variant="caption" color="text.secondary"
                      className="sku"
                      sx={{
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-block',
                        px: 0.5,
                        borderRadius: 1,
                        transition: 'all .2s ease',
                        color: 'primary.main',
                        '&:hover': {
                          transform: 'scale(1.03)'
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: 2,
                          boxShadow: '0 0 8px rgba(25,118,210,.6)'
                        }
                      }}
                    >
                      ({product.sku})
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="center">{product.priceUnit}</TableCell>
                <TableCell align="center">₱{product.price}</TableCell>

                <TableCell align="center">
                  <Chip
                    label={product.status}
                    size="small"
                    color={product.status === 'Available' ? 'success' : 'warning'}
                  />
                </TableCell>

                {/* ACTIONS */}
                <TableCell align="center">
                  <Tooltip title="Add">
                    <IconButton onClick={() => onAdd(product)}>
                      <AddIcon
                        sx={{
                          color: '#00c853',
                          filter: 'drop-shadow(0 0 6px #00e676)',
                          fontSize: 28
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Minus">
                    <IconButton onClick={() => onMinus(product.id)}>
                      <RemoveIcon
                        sx={{
                          color: '#d50000',
                          filter: 'drop-shadow(0 0 6px #ff1744)',
                          fontSize: 28
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
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
