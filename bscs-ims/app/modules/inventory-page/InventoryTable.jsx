'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import SortIcon from '@mui/icons-material/Sort'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SortFilter from './SortFilter'

export default function InventoryTable() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get('/api/inventory')

        if (res.data.success) {
          const transformedRows = res.data.data.map((item) => ({
            id: item.id,
            productId: item.productId,
            locationId: item.locationId,
            location: item.locationName,
            product: {
              name: item.productName,
              quantity: item.quantity
            }
          }))

          setRows(transformedRows)
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEdit = (row) => {
    console.log('Edit inventory:', row)
  }

  const handleDelete = (row) => {
    console.log('Delete inventory:', row)
  }

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setSortAnchorEl(null)
  }

  const handleSortSelect = (order) => {
    setSortOrder(order)
    handleSortClose()
  }

  const filteredRows = rows.filter(
    (row) =>
      row.location.toLowerCase().includes(search.toLowerCase()) ||
      row.product.name.toLowerCase().includes(search.toLowerCase())
  )

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.location.localeCompare(b.location)
    } else {
      return b.location.localeCompare(a.location)
    }
  })

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Box sx={{ mx: 'auto', px: 5 }}>
        {/** top header */}
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={5}>
          <Typography variant='h4' fontWeight={700} sx={{ color: '#1F384C' }}>
            Inventory Locations
          </Typography>
          <Button
            variant='text'
            sx={{
              color: '#1F384C',
              flexDirection: 'column',
              minWidth: 'auto',
              textTransform: 'none',
              px: 1.5,
              py: 1,
              '&:hover': {
                bgcolor: '#f3f4f6'
              }
            }}
          >
            <AddIcon sx={{ fontSize: 24 }} />
            Create
          </Button>
        </Stack>

        <TableContainer>
          {/** Filter Section */}

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
                onClick={handleSortClick}
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

          {/** Table Section */}
          <TableContainer component={Paper} sx={{ border: '1px solid #e5e7eb', boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: '#374151',
                      py: 2,
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
                      borderBottom: '2px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        sx={{ color: '#1F384C', py: 2.5, borderRight: '1px solid #e5e7eb', boxShadow: 'none' }}
                      >
                        {row.location}
                      </TableCell>
                      <TableCell
                        sx={{ color: '#374151', py: 2.5, borderRight: '1px solid #e5e7eb', boxShadow: 'none' }}
                      >
                        {row.product.name}
                        <Typography component='span' variant='body2' sx={{ color: '#6b7280', ml: 1 }}>
                          ({row.product.quantity} qty)
                        </Typography>
                      </TableCell>
                      <TableCell align='center' sx={{ py: 2.5, boxShadow: 'none' }}>
                        <IconButton onClick={() => handleEdit(row)} size='medium' sx={{ color: '#1F384C', mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row)} size='medium' sx={{ color: '#991b1b' }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align='center' sx={{ py: 8, color: '#6b7280', boxShadow: 'none' }}>
                      {loading ? 'Loading...' : 'No inventory found'}
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </TableContainer>
      </Box>

      <SortFilter
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        sortOrder={sortOrder}
        onSortSelect={handleSortSelect}
      />
    </Box>
  )
}
