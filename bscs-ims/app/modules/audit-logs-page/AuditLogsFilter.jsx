'use client'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Badge from '@mui/material/Badge'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SortIcon from '@mui/icons-material/Sort'

export default function AuditLogsFilter({
  search,
  setSearch,
  onSearchSubmit,
  onSearchKeyDown,
  onFilterClick,
  onSortClick,
  activeFilterCount = 0,
  sortOrder
}) {
  return (
    <Box sx={{ mb: 5 }}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <TextField
          placeholder='Search by module or record ID...'
          size='small'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onSearchKeyDown}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' sx={{ color: '#6b7280' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <Button
                  variant='contained'
                  size='small'
                  onClick={onSearchSubmit}
                  sx={{
                    bgcolor: '#1F384C',
                    color: '#fff',
                    textTransform: 'none',
                    minWidth: '70px',
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#162A3F' }
                  }}
                >
                  Search
                </Button>
              </InputAdornment>
            ),
            sx: {
              pr: 1,
              borderRadius: 2,
              height: '48px'
            }
          }}
        />

        <Badge
          badgeContent={activeFilterCount}
          color='primary'
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#1F384C',
              color: '#fff',
              fontSize: '0.65rem',
              minWidth: '18px',
              height: '18px'
            }
          }}
        >
          <Button
            onClick={onFilterClick}
            variant='text'
            sx={{
              color: activeFilterCount > 0 ? '#1F384C' : '#1F384C',
              flexDirection: 'column',
              minWidth: 'auto',
              textTransform: 'none',
              height: '48px',
              px: 2,
              cursor: 'pointer',
              bgcolor: activeFilterCount > 0 ? '#e5e7eb' : 'transparent',
              '&:hover': {
                bgcolor: activeFilterCount > 0 ? '#d1d5db' : '#f3f4f6'
              }
            }}
          >
            <FilterAltOutlinedIcon sx={{ fontSize: 18 }} />
            Filter
          </Button>
        </Badge>

        <Button
          onClick={onSortClick}
          variant='text'
          sx={{
            color: '#1F384C',
            flexDirection: 'column',
            minWidth: 'auto',
            textTransform: 'none',
            height: '48px',
            px: 2,
            cursor: 'pointer',
            bgcolor: sortOrder ? '#e5e7eb' : 'transparent',
            '&:hover': {
              bgcolor: sortOrder ? '#d1d5db' : '#f3f4f6'
            }
          }}
        >
          <SortIcon sx={{ fontSize: 18 }} />
          Sort
        </Button>
      </Stack>
    </Box>
  )
}