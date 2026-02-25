'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Stack, Typography, Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ResellersFilters from './ResellersFilter'
import ResellersTable from './ResellersTable'
import ResellersSortDialog from './ResellersSortDialog'
import ResellersMobileView from './ResellersMobileView'
import CreateResellerModal from './ResellerFormModal'
import DeleteResellerModal from './DeleteResellerModal'
import { toast } from 'react-toastify'

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
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)
  const [editingReseller, setEditingReseller] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteModalReseller, setDeleteModalReseller] = useState(null)

  const fetchResellers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/resellers')
      setResellers(res.data)
    } catch {
      toast.error('Failed to load resellers')
    } finally {
      setLoading(false)
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

  const openDeleteModal = (reseller) => {
    setDeleteModalReseller(reseller)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteModalReseller(null)
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
    if (!sortOrder) return 0 // preserve API order (newest first)
    if (sortOrder === 'asc') return a.businessName.localeCompare(b.businessName)
    if (sortOrder === 'desc') return b.businessName.localeCompare(a.businessName)
    return 0
  })

  const paginatedResellers = sortedResellers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <ResellersMobileView
          resellers={resellers}
          onEdit={handleEdit}
          onDelete={openDeleteModal}
          onCreate={() => {
            setEditingReseller(null)
            setOpenForm(true)
          }}
        />
        {openForm && (
          <CreateResellerModal
            reseller={editingReseller}
            onSuccess={() => {
              fetchResellers()
              setOpenForm(false)
            }}
            onClose={() => setOpenForm(false)}
          />
        )}

        {isDeleteModalOpen && deleteModalReseller && (
          <DeleteResellerModal
            onClose={closeDeleteModal}
            reseller={deleteModalReseller}
            onSuccess={fetchResellers}
          />
        )}
      </>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
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
          loading={loading}
          onDelete={openDeleteModal}
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
          onSuccess={() => {
            fetchResellers()
            setOpenForm(false)
          }}
          onClose={() => setOpenForm(false)}
        />
      )}

      {isDeleteModalOpen && deleteModalReseller && (
        <DeleteResellerModal
          onClose={closeDeleteModal}
          reseller={deleteModalReseller}
          onSuccess={fetchResellers}
        />
      )}
    </Box>
  )
}
