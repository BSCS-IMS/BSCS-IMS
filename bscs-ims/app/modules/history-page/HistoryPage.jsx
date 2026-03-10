'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'

import HistoryTable from './HistoryTable'
import HistoryMobileView from './HistoryMobileView'
import HistoryFilter from './HistoryFilter'
import HistorySortDialog from './HistorySortDialog'
import HistoryFilterDialog from './HistoryFilterDialog'

export default function HistoryPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { ssrMatchMedia: () => ({ matches: true }) })
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read all state from URL
  const urlSearch     = searchParams.get('search')      || ''
  const urlSort       = searchParams.get('sort')        || ''
  const urlProduct    = searchParams.get('product')     || ''
  const urlLocation   = searchParams.get('location')    || ''
  const urlAdjustment = searchParams.get('adjustment')  || ''
  const urlPage       = parseInt(searchParams.get('page') || '0', 10)
  const urlRows       = parseInt(searchParams.get('rows') || '10', 10)

  const [search, setSearch]             = useState(urlSearch)
  const [sortOrder, setSortOrder]       = useState(urlSort || null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const isSortOpen = Boolean(sortAnchorEl)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  const [history,   setHistory]   = useState([])
  const [products,  setProducts]  = useState([])
  const [locations, setLocations] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => { setMounted(true) }, [])

  const updateUrlParams = (params) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })
    const qs = current.toString()
    const query = qs ? `?${qs}` : ''
    window.history.pushState(null, '', `${pathname}${query}`)
    fetchHistoryWithParams(current)
  }

  const fetchHistoryWithParams = async (params) => {
    setLoading(true)
    try {
      const currentSearch     = params.get('search')     || ''
      const currentSort       = params.get('sort')       || ''
      const currentProduct    = params.get('product')    || ''
      const currentLocation   = params.get('location')   || ''
      const currentAdjustment = params.get('adjustment') || ''

      const [histRes, prodRes] = await Promise.all([
        axios.get('/api/history'),
        axios.get('/api/products'),
      ])

      const locRes = await axios.get('/api/location')
      const fetchedLocations = locRes.data?.locations || []

      setProducts(prodRes.data?.products || [])
      setLocations(fetchedLocations)

      let logs = histRes.data?.history || []

      if (currentSearch) {
        const q = currentSearch.toLowerCase()
        logs = logs.filter((l) =>
          l.productName?.toLowerCase().includes(q) ||
          l.productSku?.toLowerCase().includes(q)
        )
      }

      if (currentProduct) {
        logs = logs.filter((l) => l.productId === currentProduct)
      }

      if (currentLocation) {
        logs = logs.filter((l) => l.locationId === currentLocation)
      }

      if (currentAdjustment === 'add') {
        logs = logs.filter((l) => l.adjustment > 0)
      } else if (currentAdjustment === 'subtract') {
        logs = logs.filter((l) => l.adjustment < 0)
      }

      if (currentSort === 'date-asc') {
        logs.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
      } else {
        logs.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
      }

      setHistory(logs)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted) {
      fetchHistoryWithParams(searchParams)
    }
  }, [mounted])

  useEffect(() => { setSearch(urlSearch) }, [urlSearch])
  useEffect(() => { setSortOrder(urlSort || null) }, [urlSort])

  const handleSearchSubmit = () => {
    // Reset page to 0 on new search
    updateUrlParams({ search: search.trim(), page: '' })
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit()
  }

  const handleSortSelect = (order) => {
    setSortOrder(order)
    updateUrlParams({ sort: order || '', page: '' })
    setSortAnchorEl(null)
  }

  const handleFilterApply = (filters) => {
    updateUrlParams({
      product:    filters.product,
      location:   filters.location,
      adjustment: filters.adjustment,
      page:       '',
    })
    setIsFilterDialogOpen(false)
  }

  const handlePageChange = (_, newPage) => {
    updateUrlParams({ page: newPage === 0 ? '' : String(newPage) })
  }

  const handleRowsPerPageChange = (e) => {
    const newRows = parseInt(e.target.value, 10)
    updateUrlParams({ rows: newRows === 10 ? '' : String(newRows), page: '' })
  }

  const activeFilterCount = [urlProduct, urlLocation, urlAdjustment].filter(Boolean).length

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <HistoryMobileView
        history={history}
        loading={loading}
        search={search}
        setSearch={setSearch}
        onSearchSubmit={handleSearchSubmit}
        productFilter={urlProduct}
        setProductFilter={(v) => updateUrlParams({ product: v, page: '' })}
        locationFilter={urlLocation}
        setLocationFilter={(v) => updateUrlParams({ location: v, page: '' })}
        adjustmentFilter={urlAdjustment}
        setAdjustmentFilter={(v) => updateUrlParams({ adjustment: v, page: '' })}
        sortOrder={sortOrder}
        setSortOrder={(v) => {
          setSortOrder(v)
          updateUrlParams({ sort: v || '', page: '' })
        }}
        products={products}
        locations={locations}
      />
    )
  }

  return (
    <>
      <Box sx={{ minHeight: '100vh', py: 6 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Typography variant='h4' fontWeight={700} sx={{ color: '#1F384C', mb: 5 }}>
            Inventory History
          </Typography>

          <HistoryFilter
            search={search}
            setSearch={setSearch}
            onSearchSubmit={handleSearchSubmit}
            onSearchKeyDown={handleSearchKeyDown}
            onFilterClick={() => setIsFilterDialogOpen(true)}
            onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
            activeFilterCount={activeFilterCount}
            sortOrder={sortOrder}
          />

          <HistoryTable
            history={history}
            loading={loading}
            page={urlPage}
            rowsPerPage={urlRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
          />
        </Box>
      </Box>

      <HistorySortDialog
        anchorEl={sortAnchorEl}
        open={isSortOpen}
        onClose={() => setSortAnchorEl(null)}
        sortOrder={sortOrder}
        onSortSelect={handleSortSelect}
      />

      <HistoryFilterDialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={{
          product:    urlProduct,
          location:   urlLocation,
          adjustment: urlAdjustment,
        }}
        products={products}
        locations={locations}
        onApply={handleFilterApply}
      />
    </>
  )
}