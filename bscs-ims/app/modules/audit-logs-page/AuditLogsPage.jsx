'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'

import AuditLogsTable from './AuditLogsTable'
import AuditLogsMobileView from './AuditLogsMobileView'
import AuditLogsFilter from './AuditLogsFilter'
import AuditLogsSortDialog from './AuditLogsSortDialog'
import AuditLogsFilterDialog from './AuditLogsFilterDialog'

export default function AuditLogsPage() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { ssrMatchMedia: () => ({ matches: true }) })
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read filters from URL params
  const urlSearch = searchParams.get('search') || ''
  const urlSort = searchParams.get('sort') || ''
  const urlAction = searchParams.get('action') || ''
  const urlModule = searchParams.get('module') || ''
  const urlDateFrom = searchParams.get('dateFrom') || ''
  const urlDateTo = searchParams.get('dateTo') || ''
  const urlPage = parseInt(searchParams.get('page') || '0', 10)
  const urlRowsPerPage = parseInt(searchParams.get('rowsPerPage') || '10', 10)

  const [search, setSearch] = useState(urlSearch)
  const [sortOrder, setSortOrder] = useState(urlSort || null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const isSortOpen = Boolean(sortAnchorEl)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Fetch logs with filters
  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      console.log('Fetching logs with params:', {
        search: urlSearch,
        sort: urlSort,
        action: urlAction,
        module: urlModule,
        dateFrom: urlDateFrom,
        dateTo: urlDateTo
      })

      const res = await axios.get('/api/audit')
      let fetchedLogs = res.data

      // Apply search filter (Module or Record ID only)
      if (urlSearch) {
        const searchLower = urlSearch.toLowerCase()
        fetchedLogs = fetchedLogs.filter((log) =>
          log.entityType?.toLowerCase().includes(searchLower) ||
          log.entityId?.toLowerCase().includes(searchLower)
        )
      }

      // Apply action filter
      if (urlAction) {
        fetchedLogs = fetchedLogs.filter((log) => log.action === urlAction)
      }

      // Apply module filter
      if (urlModule) {
        fetchedLogs = fetchedLogs.filter((log) => log.entityType === urlModule)
      }

      // Apply date range filter
      if (urlDateFrom) {
        const fromDate = new Date(urlDateFrom)
        fromDate.setHours(0, 0, 0, 0)
        fetchedLogs = fetchedLogs.filter((log) => {
          if (!log.timestamp) return false
          const logDate = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000)
          return logDate >= fromDate
        })
      }

      if (urlDateTo) {
        const toDate = new Date(urlDateTo)
        toDate.setHours(23, 59, 59, 999)
        fetchedLogs = fetchedLogs.filter((log) => {
          if (!log.timestamp) return false
          const logDate = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000)
          return logDate <= toDate
        })
      }

      // Apply sort
      if (urlSort === 'module-asc') {
        fetchedLogs.sort((a, b) => (a.entityType || '').localeCompare(b.entityType || ''))
      } else if (urlSort === 'module-desc') {
        fetchedLogs.sort((a, b) => (b.entityType || '').localeCompare(a.entityType || ''))
      } else if (urlSort === 'date-asc') {
        fetchedLogs.sort((a, b) => {
          const aTime = a.timestamp?.seconds || 0
          const bTime = b.timestamp?.seconds || 0
          return aTime - bTime
        })
      } else if (urlSort === 'date-desc') {
        fetchedLogs.sort((a, b) => {
          const aTime = a.timestamp?.seconds || 0
          const bTime = b.timestamp?.seconds || 0
          return bTime - aTime
        })
      }

      setLogs(fetchedLogs)
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
    } finally {
      setLoading(false)
    }
  }, [urlSearch, urlSort, urlAction, urlModule, urlDateFrom, urlDateTo, urlPage, urlRowsPerPage])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

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
    console.log('Search submit:', search.trim())
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
    console.log('Sort select:', order)
    setSortOrder(order)
    updateUrlParams({ sort: order || '' })
    setSortAnchorEl(null)
  }

  // Handle filter apply
  const handleFilterApply = (filters) => {
    console.log('Filter apply:', filters)
    updateUrlParams({
      action: filters.action,
      module: filters.module,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      page: '0'
    })
    setIsFilterDialogOpen(false)
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
  const activeFilterCount = [urlAction, urlModule, urlDateFrom, urlDateTo].filter(Boolean).length

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <AuditLogsMobileView
          logs={logs}
          loading={loading}
          search={search}
          setSearch={setSearch}
          onSearchSubmit={handleSearchSubmit}
          actionFilter={urlAction}
          setActionFilter={(value) => updateUrlParams({ action: value, page: '0' })}
          moduleFilter={urlModule}
          setModuleFilter={(value) => updateUrlParams({ module: value, page: '0' })}
          sortOrder={sortOrder}
          setSortOrder={(value) => {
            setSortOrder(value)
            updateUrlParams({ sort: value || '', page: '0' })
          }}
        />
      </>
    )
  }

  return (
    <>
      <Box sx={{ minHeight: '100vh', py: 6 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Typography variant='h4' fontWeight={700} sx={{ color: '#1F384C', mb: 5 }}>
            Audit Logs
          </Typography>

          <AuditLogsFilter
            search={search}
            setSearch={setSearch}
            onSearchSubmit={handleSearchSubmit}
            onSearchKeyDown={handleSearchKeyDown}
            onFilterClick={() => setIsFilterDialogOpen(true)}
            onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
            activeFilterCount={activeFilterCount}
            sortOrder={sortOrder}
          />

          <AuditLogsTable
            logs={logs}
            loading={loading}
            page={urlPage}
            rowsPerPage={urlRowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Box>
      </Box>

      <AuditLogsSortDialog
        anchorEl={sortAnchorEl}
        open={isSortOpen}
        onClose={() => setSortAnchorEl(null)}
        sortOrder={sortOrder}
        onSortSelect={handleSortSelect}
      />

      <AuditLogsFilterDialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={{
          action: urlAction,
          module: urlModule,
          dateFrom: urlDateFrom,
          dateTo: urlDateTo
        }}
        onApply={handleFilterApply}
      />
    </>
  )
}