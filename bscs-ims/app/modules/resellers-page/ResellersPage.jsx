'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ResellersFilters from './ResellersFilter'
import ResellersTable from './ResellersTable'
import ResellersSortDialog from './ResellersSortDialog'
import ResellersMobileView from './ResellersMobileView'
import CreateResellerModal from './ResellerFormModal'

export default function ResellersPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { ssrMatchMedia: () => ({ matches: true }) })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [resellers, setResellers] = useState([])
  const [openForm, setOpenForm] = useState(false)
  const [editingReseller, setEditingReseller] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

  const fetchResellers = async () => {
    try {
      const res = await fetch('/api/resellers', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch resellers')
      const data = await res.json()
      setResellers(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchResellers()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEdit = (reseller) => {
    setEditingReseller(reseller)
    setOpenForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this reseller?')) return

    const res = await fetch(`/api/resellers/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || 'Delete failed')
      return
    }
    setResellers((prev) => prev.filter((r) => r.id !== id))
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

  const filteredResellers = resellers.filter((r) => r.businessName?.toLowerCase().includes(search.toLowerCase()))

  const sortedResellers = [...filteredResellers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.businessName.localeCompare(b.businessName)
    }
    return b.businessName.localeCompare(a.businessName)
  })

  const paginatedResellers = sortedResellers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <ResellersMobileView
          resellers={resellers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={() => {
            setEditingReseller(null)
            setOpenForm(true)
          }}
        />
        {openForm && (
          <CreateResellerModal
            reseller={editingReseller}
            onClose={() => {
              setOpenForm(false)
              fetchResellers()
            }}
          />
        )}
      </>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={5}>
          <Typography variant='h4' fontWeight={700} sx={{ color: '#1F384C' }}>
            Resellers
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
            onClick={() => {
              setEditingReseller(null)
              setOpenForm(true)
            }}
          >
            <AddIcon sx={{ fontSize: 24 }} />
            Create
          </Button>
        </Stack>

        <ResellersFilters search={search} setSearch={setSearch} onSortClick={handleSortClick} sortOrder={sortOrder} />

        <ResellersTable
          paginatedResellers={paginatedResellers}
          sortedResellers={sortedResellers}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ResellersSortDialog
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortClose}
          sortOrder={sortOrder}
          onSortSelect={handleSortSelect}
        />
      </Box>

      {openForm && (
        <CreateResellerModal
          reseller={editingReseller}
          onClose={() => {
            setOpenForm(false)
            fetchResellers()
          }}
        />
      )}
    </Box>
  )
}
