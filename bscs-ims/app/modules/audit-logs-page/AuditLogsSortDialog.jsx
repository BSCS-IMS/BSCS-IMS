'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

export default function AuditLogsSortDialog({
  anchorEl,
  open,
  onClose,
  sortOrder,
  onSortSelect
}) {
  const menuItems = [
    <MenuItem
      key="date-desc"
      onClick={() => onSortSelect('date-desc')}
      selected={sortOrder === 'date-desc'}
      sx={{
        py: 2,
        px: 2.5,
        mb: 0.5,
        borderRadius: 1.5,
        cursor: 'pointer',
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
          Newest First
        </Typography>
        <Typography variant='caption' sx={{ mt: 0.5, display: 'block', color: '#6b7280' }}>
          Sort by date (newest to oldest)
        </Typography>
      </Box>
    </MenuItem>,

    <MenuItem
      key="date-asc"
      onClick={() => onSortSelect('date-asc')}
      selected={sortOrder === 'date-asc'}
      sx={{
        py: 2,
        px: 2.5,
        mb: 0.5,
        borderRadius: 1.5,
        cursor: 'pointer',
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
          Oldest First
        </Typography>
        <Typography variant='caption' sx={{ mt: 0.5, display: 'block', color: '#6b7280' }}>
          Sort by date (oldest to newest)
        </Typography>
      </Box>
    </MenuItem>,

    <Divider key="divider-1" sx={{ my: 1 }} />,

    <MenuItem
      key="module-asc"
      onClick={() => onSortSelect('module-asc')}
      selected={sortOrder === 'module-asc'}
      sx={{
        py: 2,
        px: 2.5,
        mb: 0.5,
        borderRadius: 1.5,
        cursor: 'pointer',
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
          Module (A to Z)
        </Typography>
        <Typography variant='caption' sx={{ mt: 0.5, display: 'block', color: '#6b7280' }}>
          Sort by module name ascending
        </Typography>
      </Box>
    </MenuItem>,

    <MenuItem
      key="module-desc"
      onClick={() => onSortSelect('module-desc')}
      selected={sortOrder === 'module-desc'}
      sx={{
        py: 2,
        px: 2.5,
        borderRadius: 1.5,
        cursor: 'pointer',
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
          Module (Z to A)
        </Typography>
        <Typography variant='caption' sx={{ mt: 0.5, display: 'block', color: '#6b7280' }}>
          Sort by module name descending
        </Typography>
      </Box>
    </MenuItem>
  ];

  if (sortOrder) {
    menuItems.push(
      <Divider key="divider-2" sx={{ my: 1 }} />,
      <MenuItem
        key="clear"
        onClick={() => onSortSelect(null)}
        sx={{
          py: 1.5,
          px: 2.5,
          borderRadius: 1.5,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#f3f4f6'
          }
        }}
      >
        <Typography variant='body2' sx={{ color: '#6b7280' }}>
          Clear sort
        </Typography>
      </MenuItem>
    );
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 320,
          mt: 1,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          p: 1
        }
      }}
    >
      {menuItems}
    </Menu>
  )
}