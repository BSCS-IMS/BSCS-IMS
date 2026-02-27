'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Typography, Stack, Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import AnnouncementsTable from './AnnouncementsTable'
import AnnouncementsMobileView from './AnnouncementsMobileView'
import AnnouncementsFilter from './AnnouncementsFilter'
import AnnouncementsSortDialog from './AnnouncementsSortDialog'
import AnnouncementFormModal from './AnnouncementFormModal'
import DeleteAnnouncementModal from './DeleteAnnouncementModal'

export default function AnnouncementsPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { ssrMatchMedia: () => ({ matches: true }) })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const isSortOpen = Boolean(sortAnchorEl)

  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteModalAnnouncement, setDeleteModalAnnouncement] = useState(null)

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/announcement')
      setAnnouncements(res.data)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

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

  const filteredAnnouncements = announcements
    .filter((a) => a.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortOrder) return 0
      if (sortOrder === 'asc') return a.title.localeCompare(b.title)
      if (sortOrder === 'desc') return b.title.localeCompare(a.title)
      return 0
    })

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <AnnouncementsMobileView
          announcements={filteredAnnouncements}
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
            onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
            sortOrder={sortOrder}
          />

          <AnnouncementsTable
            announcements={filteredAnnouncements}
            loading={loading}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </Box>
      </Box>

      <AnnouncementsSortDialog
        anchorEl={sortAnchorEl}
        open={isSortOpen}
        onClose={() => setSortAnchorEl(null)}
        sortOrder={sortOrder}
        onSortSelect={(order) => {
          setSortOrder(order)
          setSortAnchorEl(null)
        }}
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
