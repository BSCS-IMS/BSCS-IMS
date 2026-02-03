'use client'

import { Paper, Stack, TextField, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'

export default function ProductSort({ search, setSearch, setSortOrder, onSearch }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <TextField
          placeholder='Search'
          size='small'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 700 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#1F384C',
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#162A3F' },
                    height: '30px'
                  }}
                  onClick={onSearch}
                >
                  Search
                </Button>
              </InputAdornment>
            )
          }}
        />

        <Button startIcon={<FilterListIcon />} variant='outlined'>
          Filter
        </Button>

        <Button startIcon={<SortIcon />} variant='outlined' onClick={() => setSortOrder('asc')}>
          Asc
        </Button>

        <Button startIcon={<SortIcon />} variant='outlined' onClick={() => setSortOrder('desc')}>
          Desc
        </Button>
      </Stack>
    </Paper>
  )
}
