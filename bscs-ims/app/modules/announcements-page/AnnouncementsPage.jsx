'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import { Box, Typography, Stack, Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import AnnouncementsTable from './AnnouncementsTable'
import AnnouncementsMobileView from './AnnouncementsMobileView'
import AnnouncementsFilter from './AnnouncementsFilter'
import AnnouncementsSortDialog from './AnnouncementsSortDialog'
import AnnouncementsFilterDialog from './AnnouncementsFilterDialog'
import AnnouncementFormModal from './AnnouncementFormModal'
import DeleteAnnouncementModal from './DeleteAnnouncementModal'

export default function AnnouncementsPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { ssrMatchMedia: () => ({ matches: true }) })
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read filters from URL params
  const urlSearch = searchParams.get('search') || ''
  const urlSort = searchParams.get('sort') || ''
  const urlStatus = searchParams.get('status') || ''
  const urlDateFrom = searchParams.get('dateFrom') || ''
  const urlDateTo = searchParams.get('dateTo') || ''
  const urlPage = parseInt(searchParams.get('page') || '0', 10)
  const urlRowsPerPage = parseInt(searchParams.get('rowsPerPage') || '10', 10)

  const [search, setSearch] = useState(urlSearch)
  const [sortOrder, setSortOrder] = useState(urlSort || null)

  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const isSortOpen = Boolean(sortAnchorEl)

  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteModalAnnouncement, setDeleteModalAnnouncement] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update URL params
  const updateUrlParams = useCallback((params) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })

    const queryString = newSearchParams.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }, [searchParams, router, pathname])

  // Fetch announcements with filters
  const fetchAnnouncements = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (urlSearch) params.set('search', urlSearch)
      if (urlSort) params.set('sort', urlSort)
      if (urlStatus) params.set('status', urlStatus)
      if (urlDateFrom) params.set('dateFrom', urlDateFrom)
      if (urlDateTo) params.set('dateTo', urlDateTo)

      const queryString = params.toString()
      const url = queryString ? `/api/announcement?${queryString}` : '/api/announcement'

      const res = await axios.get(url)
      setAnnouncements(res.data)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    } finally {
      setLoading(false)
    }
  }, [urlSearch, urlSort, urlStatus, urlDateFrom, urlDateTo, urlPage, urlRowsPerPage])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  // Sync search state with URL
  useEffect(() => {
    setSearch(urlSearch)
  }, [urlSearch])

  // Sync sort state with URL
  useEffect(() => {
    setSortOrder(urlSort || null)
  }, [urlSort])

  // Handle search submit
  const handleSearchSubmit = () => {
    updateUrlParams({ search: search.trim(), page: '0' })
  }

  // Handle search on Enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }

  // Handle sort change
  const handleSortSelect = (order) => {
    setSortOrder(order)
    updateUrlParams({ sort: order || '' })
    setSortAnchorEl(null)
  }

  // Handle filter apply
  const handleFilterApply = (filters) => {
    updateUrlParams({
      status: filters.status,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      page: '0'
    })
  }

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    updateUrlParams({ page: String(newPage) })
  }

  const handleChangeRowsPerPage = (event) => {
    updateUrlParams({
      rowsPerPage: event.target.value,
      page: '0'
    })
  }

  // Count active filters
  const activeFilterCount = [urlStatus, urlDateFrom, urlDateTo].filter(Boolean).length

  const openCreateModal = () => {
    setEditingAnnouncement(null)
    setIsFormModalOpen(true)
  }

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement)
    setIsFormModalOpen(true)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    setEditingAnnouncement(null)
  }

  const openDeleteModal = (announcement) => {
    setDeleteModalAnnouncement(announcement)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteModalAnnouncement(null)
  }

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <AnnouncementsMobileView
          announcements={announcements}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onCreate={openCreateModal}
          loading={loading}
        />
        {isFormModalOpen && (
          <AnnouncementFormModal
            announcement={editingAnnouncement}
            onSuccess={() => {
              fetchAnnouncements()
              closeFormModal()
            }}
            onClose={closeFormModal}
          />
        )}
        {isDeleteModalOpen && deleteModalAnnouncement && (
          <DeleteAnnouncementModal
            onClose={closeDeleteModal}
            announcement={deleteModalAnnouncement}
            onSuccess={fetchAnnouncements}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Box sx={{ minHeight: '100vh', py: 6 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={5}>
            <Typography variant='h4' fontWeight={700} sx={{ color: '#1F384C' }}>
              Announcements
            </Typography>
            <Button
              variant='text'
              onClick={openCreateModal}
              sx={{
                color: '#1F384C',
                flexDirection: 'column',
                minWidth: 'auto',
                textTransform: 'none',
                px: 1.5,
                py: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#f3f4f6'
                }
              }}
            >
              <AddIcon sx={{ fontSize: 24 }} />
              Create
            </Button>
          </Stack>

          <AnnouncementsFilter
            search={search}
            setSearch={setSearch}
            onSearchSubmit={handleSearchSubmit}
            onSearchKeyDown={handleSearchKeyDown}
            onFilterClick={() => setIsFilterDialogOpen(true)}
            onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
            activeFilterCount={activeFilterCount}
            sortOrder={sortOrder}
          />

          <AnnouncementsTable
            announcements={announcements}
            loading={loading}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            page={urlPage}
            rowsPerPage={urlRowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Box>
      </Box>

      <AnnouncementsSortDialog
        anchorEl={sortAnchorEl}
        open={isSortOpen}
        onClose={() => setSortAnchorEl(null)}
        sortOrder={sortOrder}
        onSortSelect={handleSortSelect}
      />

      <AnnouncementsFilterDialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={{
          status: urlStatus,
          dateFrom: urlDateFrom,
          dateTo: urlDateTo
        }}
        onApply={handleFilterApply}
      />

      {isFormModalOpen && (
        <AnnouncementFormModal
          announcement={editingAnnouncement}
          onSuccess={() => {
            fetchAnnouncements()
            closeFormModal()
          }}
          onClose={closeFormModal}
        />
      )}

      {isDeleteModalOpen && deleteModalAnnouncement && (
        <DeleteAnnouncementModal
          onClose={closeDeleteModal}
          announcement={deleteModalAnnouncement}
          onSuccess={fetchAnnouncements}
        />
      )}
    </>
  )
}
