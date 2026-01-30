'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import InventoryFilters from './InventoryFilters'
import InventoryTable from './InventoryTable'
import InventorySortDialog from './InventorySortDialog'

export default function InventoryPage() {
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

        <InventoryFilters search={search} setSearch={setSearch} onSortClick={handleSortClick} />

        <InventoryTable
          paginatedRows={paginatedRows}
          sortedRows={sortedRows}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <InventorySortDialog
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortClose}
          sortOrder={sortOrder}
          onSortSelect={handleSortSelect}
        />
      </Box>
    </Box>
  )
}
