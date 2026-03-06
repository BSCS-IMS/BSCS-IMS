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

  // Update URL params - USING WINDOW.HISTORY
  const updateUrlParams = (params) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })

    const search = current.toString()
    const query = search ? `?${search}` : ''
    const newUrl = `${pathname}${query}`
    
    console.log('Updating URL to:', newUrl)
    
    // Use window.history.pushState as a workaround
    window.history.pushState(null, '', newUrl)
    
    // Trigger a manual re-fetch
    fetchLogsWithParams(current)
  }

  // Fetch with specific params
  const fetchLogsWithParams = async (params) => {
    setLoading(true)
    try {
      const currentSearch = params.get('search') || ''
      const currentSort = params.get('sort') || ''
      const currentAction = params.get('action') || ''
      const currentModule = params.get('module') || ''
      const currentDateFrom = params.get('dateFrom') || ''
      const currentDateTo = params.get('dateTo') || ''

      console.log('Fetching logs with params:', {
        search: currentSearch,
        sort: currentSort,
        action: currentAction,
        module: currentModule,
        dateFrom: currentDateFrom,
        dateTo: currentDateTo
      })

      const res = await axios.get('/api/audit')
      let fetchedLogs = res.data

      // Apply search filter (Module or Record ID only)
      if (currentSearch) {
        const searchLower = currentSearch.toLowerCase()
        fetchedLogs = fetchedLogs.filter((log) =>
          log.entityType?.toLowerCase().includes(searchLower) ||
          log.entityId?.toLowerCase().includes(searchLower)
        )
      }

      // Apply action filter
      if (currentAction) {
        fetchedLogs = fetchedLogs.filter((log) => log.action === currentAction)
      }

      // Apply module filter
      if (currentModule) {
        fetchedLogs = fetchedLogs.filter((log) => log.entityType === currentModule)
      }

      // Apply date range filter
      if (currentDateFrom) {
        const fromDate = new Date(currentDateFrom)
        fromDate.setHours(0, 0, 0, 0)
        fetchedLogs = fetchedLogs.filter((log) => {
          if (!log.timestamp) return false
          const logDate = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000)
          return logDate >= fromDate
        })
      }

      if (currentDateTo) {
        const toDate = new Date(currentDateTo)
        toDate.setHours(23, 59, 59, 999)
        fetchedLogs = fetchedLogs.filter((log) => {
          if (!log.timestamp) return false
          const logDate = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000)
          return logDate <= toDate
        })
      }

      // Apply sort
      if (currentSort === 'module-asc') {
        fetchedLogs.sort((a, b) => (a.entityType || '').localeCompare(b.entityType || ''))
      } else if (currentSort === 'module-desc') {
        fetchedLogs.sort((a, b) => (b.entityType || '').localeCompare(a.entityType || ''))
      } else if (currentSort === 'date-asc') {
        fetchedLogs.sort((a, b) => {
          const aTime = a.timestamp?.seconds || 0
          const bTime = b.timestamp?.seconds || 0
          return aTime - bTime
        })
      } else if (currentSort === 'date-desc') {
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
  }

  // Initial fetch on mount
  useEffect(() => {
    if (mounted) {
      fetchLogsWithParams(searchParams)
    }
  }, [mounted])

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
    updateUrlParams({ search: search.trim() })
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
      dateTo: filters.dateTo
    })
    setIsFilterDialogOpen(false)
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
          setActionFilter={(value) => updateUrlParams({ action: value })}
          moduleFilter={urlModule}
          setModuleFilter={(value) => updateUrlParams({ module: value })}
          sortOrder={sortOrder}
          setSortOrder={(value) => {
            setSortOrder(value)
            updateUrlParams({ sort: value || '' })
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