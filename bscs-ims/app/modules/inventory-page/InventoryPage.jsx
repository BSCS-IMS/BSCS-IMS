'use client'

import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
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
import DeleteInventoryModal from './DeleteInventoryModal'

export default function InventoryPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { ssrMatchMedia: () => ({ matches: true }) })
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read filters from URL params
  const urlSearch = searchParams.get('search') || ''
  const urlLocationId = searchParams.get('locationId') || ''
  const urlProductId = searchParams.get('productId') || ''
  const urlSort = searchParams.get('sort') || ''
  const urlPage = parseInt(searchParams.get('page') || '0', 10)
  const urlRowsPerPage = parseInt(searchParams.get('rowsPerPage') || '5', 10)

  const [search, setSearch] = useState(urlSearch)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [sortOrder, setSortOrder] = useState(urlSort || null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [allRows, setAllRows] = useState([]) // unfiltered, for filter dialog options
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update URL params
  const updateUrlParams = useCallback(
    (params) => {
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
    },
    [searchParams, router, pathname]
  )

  // Fetch inventory — backend handles filtering
  // Helper to group raw inventory data into rows
  const groupInventory = (data, allLocations = [], hasSearchFilter = false) => {
    const grouped = {}

    // If there's a search filter, only show locations with matching inventory
    // Otherwise, initialize all locations (including empty ones)
    if (!hasSearchFilter) {
      allLocations.forEach((loc) => {
        grouped[loc.id] = {
          id: loc.id,
          locationId: loc.id,
          location: loc.name,
          items: []
        }
      })
    }

    // Add inventory items to their respective locations
    data.forEach((item) => {
      if (item.quantity <= 0) return
      if (!grouped[item.locationId]) {
        grouped[item.locationId] = {
          id: item.locationId,
          locationId: item.locationId,
          location: item.locationName,
          items: []
        }
      }
      grouped[item.locationId].items.push({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        qty: item.quantity
      })
    })

    return Object.values(grouped)
  }

  const fetchInventory = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (urlSearch) params.set('search', urlSearch)
      if (urlLocationId) params.set('locationId', urlLocationId)
      if (urlProductId) params.set('productId', urlProductId)
      // Don't send sort to backend since we sort grouped data on frontend

      const queryString = params.toString()
      const url = queryString ? `/api/inventory?${queryString}` : '/api/inventory'

      // Fetch all locations first
      const locationsRes = await axios.get('/api/location')
      const allLocations = locationsRes.data?.success ? locationsRes.data.locations : []

      // Fetch filtered rows for table
      const res = await axios.get(url)
      if (res.data.success) {
        // Pass hasSearchFilter flag to groupInventory
        const hasFilter = !!(urlSearch || urlLocationId || urlProductId)
        setRows(groupInventory(res.data.data, allLocations, hasFilter))
      }

      // Always fetch unfiltered data for filter dialog options
      const allRes = await axios.get('/api/inventory')
      if (allRes.data.success) {
        setAllRows(groupInventory(allRes.data.data, allLocations, false))
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    } finally {
      setLoading(false)
    }
  }, [urlSearch, urlLocationId, urlProductId, urlSort, urlPage, urlRowsPerPage])

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
  }, [fetchInventory])

  useEffect(() => {
    fetchLocations()
  }, [])

  // Sync search + sort state with URL
  useEffect(() => {
    setSearch(urlSearch)
  }, [urlSearch])
  useEffect(() => {
    setSortOrder(urlSort || null)
  }, [urlSort])

  const handleSearchSubmit = () => {
    updateUrlParams({ search: search.trim(), page: '0' })
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit()
  }

  // Handle filter apply — updates URL, triggers re-fetch
  const handleFilterApply = (filters) => {
    updateUrlParams({
      locationId: filters.locationId,
      productId: filters.productId,
      page: '0'
    })
  }

  // Handle sort
  const handleSortSelect = (order) => {
    setSortOrder(order)
    updateUrlParams({ sort: order || '' })
    setSortAnchorEl(null)
  }

  // Active filter count for badge
  const activeFilterCount = [urlLocationId, urlProductId].filter(Boolean).length

  // ── Modal helpers ───────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingEntry(null)
    setModalOpen(true)
  }

  const openEditModal = (row) => {
    setEditingEntry({
      locationId: row.locationId,
      locationName: row.location,
      items: row.items.map((i) => ({ productId: i.productId, qty: i.qty }))
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

  const handleChangePage = (event, newPage) => {
    updateUrlParams({ page: String(newPage) })
  }

  const handleChangeRowsPerPage = (event) => {
    updateUrlParams({
      rowsPerPage: event.target.value,
      page: '0'
    })
  }

  const handleEdit = (row) => openEditModal(row)

  const handleDelete = (row) => {
    setDeleteTarget(row)
  }

  const closeDeleteModal = () => {
    setDeleteTarget(null)
  }

  const handleDeleteSuccess = () => {
    fetchInventory()
  }

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortOrder) return 0
    if (sortOrder === 'asc') return a.location.localeCompare(b.location)
    if (sortOrder === 'desc') return b.location.localeCompare(a.location)
    return 0
  })

  const paginatedRows = sortedRows.slice(urlPage * urlRowsPerPage, urlPage * urlRowsPerPage + urlRowsPerPage)

  // Product options for filter dialog — derived from current rows
  const productOptions = allRows
    .flatMap((r) => r.items.map((i) => ({ value: i.productId, label: i.productName })))
    .filter((p, idx, arr) => arr.findIndex((x) => x.value === p.value) === idx)

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <InventoryMobileView
          rows={sortedRows}
          allRows={allRows}
          onCreate={openCreateModal}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          search={search}
          setSearch={setSearch}
          onSearchSubmit={handleSearchSubmit}
          filters={{ locationId: urlLocationId, productId: urlProductId }}
          onFilterApply={handleFilterApply}
          sortOrder={sortOrder}
          onSortSelect={handleSortSelect}
          locations={locations}
          products={productOptions}
        />
        {modalOpen && (
          <InventoryLocationModal onClose={closeModal} entry={editingEntry} onConfirm={handleModalConfirm} />
        )}
        {deleteTarget && (
          <DeleteInventoryModal onClose={closeDeleteModal} location={deleteTarget} onSuccess={handleDeleteSuccess} />
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
              Inventory Locations
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
                '&:hover': { bgcolor: '#f3f4f6' }
              }}
            >
              <AddIcon sx={{ fontSize: 24 }} />
              Create
            </Button>
          </Stack>

          <InventoryFilters
            search={search}
            setSearch={setSearch}
            onSearchSubmit={handleSearchSubmit}
            onSearchKeyDown={handleSearchKeyDown}
            onFilterClick={() => setIsFilterDialogOpen(true)}
            onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
            activeFilterCount={activeFilterCount}
            sortOrder={sortOrder}
          />

          <InventoryTable
            paginatedRows={paginatedRows}
            sortedRows={sortedRows}
            loading={loading}
            page={urlPage}
            rowsPerPage={urlRowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Box>

      <InventorySortDialog
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
        sortOrder={sortOrder}
        onSortSelect={handleSortSelect}
      />

      <InventoryFilterDialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={{ locationId: urlLocationId, productId: urlProductId }}
        onApply={handleFilterApply}
        locations={locations}
        products={productOptions}
        rows={allRows}
      />

      {modalOpen && <InventoryLocationModal onClose={closeModal} entry={editingEntry} onConfirm={handleModalConfirm} />}

      {deleteTarget && (
        <DeleteInventoryModal onClose={closeDeleteModal} location={deleteTarget} onSuccess={handleDeleteSuccess} />
      )}
    </>
  )
}
