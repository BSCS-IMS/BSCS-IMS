'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import InventoryFilters from './InventoryFilters'
import InventoryTable from './InventoryTable'
import InventorySortDialog from './InventorySortDialog'
import InventoryMobileView from './InventoryMobileView'
import InventoryLocationModal from './InventorylocationModal'
import { toast } from 'react-toastify'

export default function InventoryPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { ssrMatchMedia: () => ({ matches: true }) })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)

  // Locations for modal dropdown — fetched once
  const [locations, setLocations] = useState([])

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── Data fetching ───────────────────────────────────────────────────────────

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory')
      if (res.data.success) {
        // Group items by locationId so each location appears once
        const grouped = {}
        res.data.data.forEach((item) => {
          // Skip zeroed-out inventory records
          if (item.quantity <= 0) return

          if (!grouped[item.locationId]) {
            grouped[item.locationId] = {
              id: item.locationId,
              locationId: item.locationId,
              location: item.locationName,
              items: [],
            }
          }
          grouped[item.locationId].items.push({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            qty: item.quantity,
          })
        })

        // Remove locations that ended up with no items
        Object.keys(grouped).forEach((key) => {
          if (grouped[key].items.length === 0) delete grouped[key]
        })
        setRows(Object.values(grouped))
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/location')
      if (res.data?.success) {
        setLocations(
          res.data.locations.map((l) => ({ value: l.id, label: l.name }))
        )
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err)
    }
  }

  useEffect(() => {
    fetchInventory()
    fetchLocations()
  }, [])

  // ── Modal helpers ───────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingEntry(null)
    setModalOpen(true)
  }

  const openEditModal = (row) => {
    setEditingEntry({
      locationId: row.locationId,
      locationName: row.location,   // pre-fill name in modal
      items: row.items.map((i) => ({ productId: i.productId, qty: i.qty })),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingEntry(null)
  }

  const handleModalConfirm = () => {
    fetchInventory() // refresh table after save
  }

  // ── Table helpers ───────────────────────────────────────────────────────────

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEdit = (row) => openEditModal(row)

  const handleDelete = async (row) => {
    setDeleteTarget(row)
  }

  const confirmDelete = async () => {
    const row = deleteTarget
    setDeleteTarget(null)
    try {
      const results = await Promise.allSettled(
        row.items.map((item) =>
          axios.post('/api/inventory/deduct', {
            productId: item.productId,
            locationId: row.locationId,
            quantity: item.qty,
          })
        )
      )

      const failed = results.filter(
        (r) => r.status === 'rejected' || r.value?.data?.success === false
      )

      if (failed.length > 0) {
        const firstErr =
          failed[0].reason?.response?.data?.error ||
          failed[0].value?.data?.error ||
          'Some items failed to clear'
        toast.error(firstErr)
      } else {
        toast.success(`"${row.location}" stock cleared successfully`)
      }

      fetchInventory()
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error('Failed to clear inventory')
    }
  }

  const handleSortClick = (event) => setSortAnchorEl(event.currentTarget)
  const handleSortClose = () => setSortAnchorEl(null)
  const handleSortSelect = (order) => { setSortOrder(order); handleSortClose() }

  const filteredRows = rows.filter(
    (row) =>
      row.location.toLowerCase().includes(search.toLowerCase()) ||
      row.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()))
  )

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortOrder) return 0
    if (sortOrder === 'asc') return a.location.localeCompare(b.location)
    if (sortOrder === 'desc') return b.location.localeCompare(a.location)
    return 0
  })

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <InventoryMobileView rows={rows} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        {modalOpen && (
          <InventoryLocationModal
            onClose={closeModal}
            entry={editingEntry}
            onConfirm={handleModalConfirm}
            locations={locations}
          />
        )}
      </>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#1F384C' }}>
            Inventory Locations
          </Typography>
          <Button
            variant="text"
            onClick={openCreateModal}
            sx={{
              color: '#1F384C',
              flexDirection: 'column',
              minWidth: 'auto',
              textTransform: 'none',
              px: 1.5,
              py: 1,
              '&:hover': { bgcolor: '#f3f4f6' },
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

      {modalOpen && (
        <InventoryLocationModal
          onClose={closeModal}
          entry={editingEntry}
          onConfirm={handleModalConfirm}
          locations={locations}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-sm font-semibold text-[#1F384C] mb-1">Clear inventory?</h3>
            <p className="text-xs text-[#6b7280] mb-5">
              This will zero out all stock at <strong>{deleteTarget.location}</strong>. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-8 px-3 text-xs rounded-md border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="h-8 px-3 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Clear stock
              </button>
            </div>
          </div>
        </div>
      )}
    </Box>
  )
}