import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SortIcon from '@mui/icons-material/Sort'

export default function InventoryFilters({ search, setSearch, onSortClick }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <TextField
          placeholder='Search inventory...'
          size='small'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                  sx={{
                    bgcolor: '#1F384C',
                    color: '#fff',
                    textTransform: 'none',
                    minWidth: '70px',
                    borderRadius: 1.5,
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
        <Button
          variant='text'
          sx={{
            color: '#1F384C',
            flexDirection: 'column',
            minWidth: 'auto',
            textTransform: 'none',
            height: '48px',
            px: 2,
            '&:hover': {
              bgcolor: '#f3f4f6'
            }
          }}
        >
          <FilterAltOutlinedIcon sx={{ fontSize: 18 }} />
          Filter
        </Button>
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
            '&:hover': {
              bgcolor: '#f3f4f6'
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
