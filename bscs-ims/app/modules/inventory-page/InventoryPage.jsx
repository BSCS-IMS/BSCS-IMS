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
import InventoryFilterDialog from './InventoryFilterDialog'
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
  const [locations, setLocations] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedItemsToDelete, setSelectedItemsToDelete] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({ locationId: '', productId: '' })

  // ── Data fetching ───────────────────────────────────────────────────────────

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory')
      if (res.data.success) {
        const grouped = {}
        res.data.data.forEach((item) => {
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
        setLocations(res.data.locations.map((l) => ({ value: l.id, label: l.name })))
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
      locationName: row.location,
      items: row.items.map((i) => ({ productId: i.productId, qty: i.qty })),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingEntry(null)
  }

  const handleModalConfirm = () => {
    fetchInventory()
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
    setSelectedItemsToDelete([])
  }

  const confirmDelete = async () => {
    const row = deleteTarget
    setDeleteTarget(null)
    setSelectedItemsToDelete([])
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

  const confirmDeleteInventory = async () => {
    const row = deleteTarget
    const selectedItems = row.items.filter((item) => selectedItemsToDelete.includes(item.productId))
    setDeleteTarget(null)
    setSelectedItemsToDelete([])

    try {
      const results = await Promise.allSettled(
        selectedItems.map((item) =>
          axios.delete('/api/inventory', {
            data: {
              productId: item.productId,
              locationId: row.locationId,
            }
          })
        )
      )

      const failed = results.filter(
        (r) => r.status === 'rejected' || r.value?.data?.success === false
      )

      if (failed.length > 0) {
        toast.error('Some items failed to delete')
      } else {
        toast.success('Selected inventory deleted successfully')
      }

      fetchInventory()
    } catch (err) {
      console.error('Delete inventory failed:', err)
      toast.error('Failed to delete inventory')
    }
  }

  const handleSortClick = (event) => setSortAnchorEl(event.currentTarget)
  const handleSortClose = () => setSortAnchorEl(null)
  const handleSortSelect = (order) => { setSortOrder(order); handleSortClose() }

  // ── Filter + sort rows ──────────────────────────────────────────────────────

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.location.toLowerCase().includes(search.toLowerCase()) ||
      row.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()))

    const matchesLocation = !filters.locationId || row.locationId === filters.locationId

    const matchesProduct = !filters.productId ||
      row.items.some((i) => i.productId === filters.productId)

    return matchesSearch && matchesLocation && matchesProduct
  })

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortOrder) return 0
    if (sortOrder === 'asc') return a.location.localeCompare(b.location)
    if (sortOrder === 'desc') return b.location.localeCompare(a.location)
    return 0
  })

  const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Unique products from all rows for filter dropdown
  const productOptions = rows
    .flatMap((r) => r.items.map((i) => ({ value: i.productId, label: i.productName })))
    .filter((p, idx, arr) => arr.findIndex((x) => x.value === p.value) === idx)

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

        <InventoryFilters search={search} setSearch={setSearch} onSortClick={handleSortClick} onFilterClick={() => setFilterOpen(true)} />

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

      <InventoryFilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(newFilters) => { setFilters(newFilters); setPage(0) }}
        locations={locations}
        products={productOptions}
      />

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-sm font-semibold text-[#1F384C] mb-1">Manage inventory</h3>
            <p className="text-xs text-[#6b7280] mb-3">
              Select items to delete, or clear all stock at <strong>{deleteTarget.location}</strong>.
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-2 mb-5 max-h-48 overflow-y-auto">
              {deleteTarget.items.map((item) => (
                <label key={item.productId} className="flex items-center gap-2 text-xs text-[#1F384C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItemsToDelete.includes(item.productId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItemsToDelete((prev) => [...prev, item.productId])
                      } else {
                        setSelectedItemsToDelete((prev) => prev.filter((id) => id !== item.productId))
                      }
                    }}
                    className="rounded border-[#d1d5db]"
                  />
                  <span>{item.productName}</span>
                  <span className="ml-auto text-[#6b7280]">qty: {item.qty}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setDeleteTarget(null); setSelectedItemsToDelete([]) }}
                className="h-8 px-3 text-xs rounded-md border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="h-8 px-3 text-xs rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
              >
                Clear stock
              </button>
              <button
                onClick={confirmDeleteInventory}
                disabled={selectedItemsToDelete.length === 0}
                className="h-8 px-3 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Delete inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </Box>
  )
}