'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import { Box, Stack, Typography, Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ResellersFilters from './ResellersFilter'
import ResellersTable from './ResellersTable'
import ResellersSortDialog from './ResellersSortDialog'
import ResellersMobileView from './ResellersMobileView'
import CreateResellerModal from './ResellerFormModal'
import DeleteResellerModal from './DeleteResellerModal'
import ResellersFilterDialog from './ResellersFilterDialog'


export default function ResellersPage() {
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
  const urlProductId = searchParams.get('productId') || ''
  const urlResellerId = searchParams.get('resellerId') || ''
  const urlPage = parseInt(searchParams.get('page') || '0', 10)
  const urlRowsPerPage = parseInt(searchParams.get('rowsPerPage') || '10', 10)

  const [search, setSearch] = useState(urlSearch)
  const [sortOrder, setSortOrder] = useState(urlSort || null)
  const [resellers, setResellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [openForm, setOpenForm] = useState(false)
  const [editingReseller, setEditingReseller] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteModalReseller, setDeleteModalReseller] = useState(null)
  const [products, setProducts] = useState([])

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

  // Fetch resellers with filters
  const fetchResellers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (urlSearch) params.set('search', urlSearch)
      if (urlSort) params.set('sort', urlSort)
      if (urlStatus) params.set('status', urlStatus)
      if (urlProductId) params.set('productId', urlProductId)
      if (urlResellerId) params.set('resellerId', urlResellerId)

      const queryString = params.toString()
      const url = queryString ? `/api/resellers?${queryString}` : '/api/resellers'

      const res = await axios.get(url)
      setResellers(res.data)
    } catch {
      toast.error('Failed to load resellers')
    } finally {
      setLoading(false)
    }
  }, [urlSearch, urlSort, urlStatus, urlProductId, urlResellerId, urlPage, urlRowsPerPage])

  // Fetch products for filter dropdown
  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products')
      let list = []

      if (Array.isArray(res.data)) {
        list = res.data
      } else if (Array.isArray(res.data?.products)) {
        list = res.data.products
      } else if (Array.isArray(res.data?.data)) {
        list = res.data.data
      }

      setProducts(list)
    } catch (err) {
      console.error('Failed to fetch products', err)
    }
  }

  useEffect(() => {
    fetchResellers()
  }, [fetchResellers])

  useEffect(() => {
    fetchProducts()
  }, [])

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
      productId: filters.productId,
      resellerId: filters.resellerId,
      page: '0'
    })
  }

  // Count active filters
  const activeFilterCount = [urlStatus, urlProductId, urlResellerId].filter(Boolean).length


  const handleChangePage = (event, newPage) => {
    updateUrlParams({ page: String(newPage) })
  }

  const handleChangeRowsPerPage = (event) => {
    updateUrlParams({
      rowsPerPage: event.target.value,
      page: '0'
    })
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

  const paginatedResellers = resellers.slice(urlPage * urlRowsPerPage, urlPage * urlRowsPerPage + urlRowsPerPage)

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <ResellersMobileView
          resellers={resellers}
          allResellers={resellers}
          onEdit={handleEdit}
          onDelete={openDeleteModal}
          onCreate={() => {
            setEditingReseller(null)
            setOpenForm(true)
          }}
          loading={loading}
          search={search}
          setSearch={setSearch}
          onSearchSubmit={handleSearchSubmit}
          filters={{
            status: urlStatus,
            productId: urlProductId,
            resellerId: urlResellerId
          }}
          onFilterApply={handleFilterApply}
          sortOrder={sortOrder}
          onSortSelect={handleSortSelect}
          products={products}
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

        <ResellersFilters
          search={search}
          setSearch={setSearch}
          onSearchSubmit={handleSearchSubmit}
          onSearchKeyDown={handleSearchKeyDown}
          onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
          sortOrder={sortOrder}
          onFilterClick={() => setIsFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        <ResellersFilterDialog
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          products={products}
          resellers={resellers}
          filters={{
            status: urlStatus,
            productId: urlProductId,
            resellerId: urlResellerId
          }}
          onApply={handleFilterApply}
        />

        <ResellersTable
          paginatedResellers={paginatedResellers}
          sortedResellers={resellers}
          page={urlPage}
          rowsPerPage={urlRowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onEdit={handleEdit}
          loading={loading}
          onDelete={openDeleteModal}
        />

        <ResellersSortDialog
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
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
