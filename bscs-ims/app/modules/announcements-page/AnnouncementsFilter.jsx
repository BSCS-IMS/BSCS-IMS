'use client'

import { Stack, TextField, InputAdornment, IconButton, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'

export default function AnnouncementsFilter({ search, setSearch, onSortClick, sortOrder }) {
  return (
    <Stack direction='row' spacing={2} mb={3} alignItems='center'>
      <TextField
        placeholder='Search announcements...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size='small'
        sx={{
          flex: 1,
          maxWidth: 400,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
            borderRadius: 2,
            '& fieldset': { borderColor: '#e5e7eb' },
            '&:hover fieldset': { borderColor: '#1F384C' },
            '&.Mui-focused fieldset': { borderColor: '#1F384C' }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon sx={{ color: '#6b7280', fontSize: 20 }} />
            </InputAdornment>
          )
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      <IconButton
        onClick={onSortClick}
        sx={{
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          bgcolor: sortOrder ? '#1F384C' : 'white',
          color: sortOrder ? 'white' : '#4A5568',
          '&:hover': {
            bgcolor: sortOrder ? '#162a3a' : '#f3f4f6'
          }
        }}
      >
        <SortIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Stack>
  )
}
