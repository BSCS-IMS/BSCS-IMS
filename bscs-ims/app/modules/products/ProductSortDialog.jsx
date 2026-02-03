'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

export default function ProductSortDialog({
  anchorEl,
  open,
  onClose,
  sortOrder,
  onSortSelect
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 300,
          mt: 1,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          p: 1
        }
      }}
    >
      <MenuItem
        onClick={() => onSortSelect('asc')}
        selected={sortOrder === 'asc'}
        sx={{
          py: 2,
          px: 2.5,
          mb: 0.5,
          borderRadius: 1.5,
          '&:hover': {
            bgcolor: '#f3f4f6'
          },
          '&.Mui-selected': {
            bgcolor: '#e5e7eb',
            '&:hover': {
              bgcolor: '#d1d5db'
            }
          }
        }}
      >
        <Box>
          <Typography variant='body2' fontWeight={500} sx={{ color: '#1F384C' }}>
            Ascending
          </Typography>
          <Typography variant='caption' sx={{ mt: 0.5, display: 'block', color: '#6b7280' }}>
            Sort products from A to Z
          </Typography>
        </Box>
      </MenuItem>

      <MenuItem
        onClick={() => onSortSelect('desc')}
        selected={sortOrder === 'desc'}
        sx={{
          py: 2,
          px: 2.5,
          borderRadius: 1.5,
          '&:hover': {
            bgcolor: '#f3f4f6'
          },
          '&.Mui-selected': {
            bgcolor: '#e5e7eb',
            '&:hover': {
              bgcolor: '#d1d5db'
            }
          }
        }}
      >
        <Box>
          <Typography variant='body2' fontWeight={500} sx={{ color: '#1F384C' }}>
            Descending
          </Typography>
          <Typography variant='caption' sx={{ mt: 0.5, display: 'block', color: '#6b7280' }}>
            Sort products from Z to A
          </Typography>
        </Box>
      </MenuItem>
    </Menu>
  )
}
