'use client'

import { Menu, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CheckIcon from '@mui/icons-material/Check'

export default function AnnouncementsSortDialog({ anchorEl, open, onClose, sortOrder, onSortSelect }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            borderRadius: 2
          }
        }
      }}
    >
      <Typography sx={{ px: 2, py: 1, fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>
        Sort by Title
      </Typography>
      <MenuItem
        onClick={() => onSortSelect('asc')}
        sx={{
          py: 1.5,
          '&:hover': { bgcolor: '#f3f4f6' }
        }}
      >
        <ListItemIcon>
          <ArrowUpwardIcon sx={{ fontSize: 18, color: '#4A5568' }} />
        </ListItemIcon>
        <ListItemText>
          <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>A to Z</Typography>
        </ListItemText>
        {sortOrder === 'asc' && <CheckIcon sx={{ fontSize: 18, color: '#1F384C' }} />}
      </MenuItem>
      <MenuItem
        onClick={() => onSortSelect('desc')}
        sx={{
          py: 1.5,
          '&:hover': { bgcolor: '#f3f4f6' }
        }}
      >
        <ListItemIcon>
          <ArrowDownwardIcon sx={{ fontSize: 18, color: '#4A5568' }} />
        </ListItemIcon>
        <ListItemText>
          <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>Z to A</Typography>
        </ListItemText>
        {sortOrder === 'desc' && <CheckIcon sx={{ fontSize: 18, color: '#1F384C' }} />}
      </MenuItem>
      {sortOrder && (
        <MenuItem
          onClick={() => onSortSelect(null)}
          sx={{
            py: 1.5,
            borderTop: '1px solid #e5e7eb',
            '&:hover': { bgcolor: '#f3f4f6' }
          }}
        >
          <ListItemText>
            <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>Clear sort</Typography>
          </ListItemText>
        </MenuItem>
      )}
    </Menu>
  )
}
