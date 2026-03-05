'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import { Box, Typography, Stack, Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import ProductTable from './ProductTable'
import ProductMobile from './ProductMobile'
import ProductFilter from './ProductFilter'
import ProductSortDialog from './ProductSortDialog'
import ProductFilterDialog from './ProductFilterDialog'
import ProductFormModal from './ProductFormModal'
import InventoryAdjustModal from './InventoryAdjustModal'
import DeleteProductModal from './DeleteProductModal'

export default function ProductPage() {
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
  const urlLocationId = searchParams.get('locationId') || ''

  const [search, setSearch] = useState(urlSearch)
  const [sortOrder, setSortOrder] = useState(urlSort || null)

  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const isSortOpen = Boolean(sortAnchorEl)

  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState([])

  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productModalMode, setProductModalMode] = useState('create')
  const [productModalInitialValues, setProductModalInitialValues] = useState(null)

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false)
  const [inventoryModalMode, setInventoryModalMode] = useState('add')
  const [inventoryModalProduct, setInventoryModalProduct] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteModalProduct, setDeleteModalProduct] = useState(null)

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

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (urlSearch) params.set('search', urlSearch)
      if (urlSort) params.set('sort', urlSort)
      if (urlStatus) params.set('status', urlStatus)
      if (urlProductId) params.set('productId', urlProductId)
      if (urlLocationId) params.set('locationId', urlLocationId)

      const queryString = params.toString()
      const url = queryString ? `/api/products?${queryString}` : '/api/products'

      const res = await axios.get(url)
      if (res.data.success) {
        setProducts(
          res.data.products.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            image: p.imageUrl,
            price: p.currentPrice,
            priceUnit: p.priceUnit,
            description: p.description || '',
            status: p.isActive ? 'Available' : 'Not Available'
          }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }, [urlSearch, urlSort, urlStatus, urlProductId, urlLocationId])

  // Fetch all products for filter dropdown
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get('/api/products')
      if (res.data.success) {
        setAllProducts(
          res.data.products.map((p) => ({
            id: p.id,
            name: p.name
          }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch all products:', error)
    }
  }

  // Fetch locations for filter dropdown
  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/location')
      if (res.data.success) {
        setLocations(res.data.locations)
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error)
    }
  }

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/inventory')
      if (res.data.success) {
        setInventory(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    }
  }

  const refreshData = async () => {
    await Promise.all([fetchProducts(), fetchInventory()])
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchInventory()
    fetchAllProducts()
    fetchLocations()
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
    setSortOrder(order)
    updateUrlParams({ sort: order || '' })
    setSortAnchorEl(null)
  }

  // Handle filter apply
  const handleFilterApply = (filters) => {
    updateUrlParams({
      status: filters.status,
      productId: filters.productId,
      locationId: filters.locationId
    })
  }

  // Count active filters
  const activeFilterCount = [urlStatus, urlProductId, urlLocationId].filter(Boolean).length

  const openDeleteModal = (product) => {
    setDeleteModalProduct(product)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteModalProduct(null)
  }

  const openCreateModal = () => {
    setProductModalMode('create')
    setProductModalInitialValues(null)
    setIsProductModalOpen(true)
  }

  const openEditModal = (product) => {
    setProductModalMode('edit')
    setProductModalInitialValues({
      id: product.id,
      name: product.name,
      sku: product.sku,
      currentPrice: product.price,
      priceUnit: product.priceUnit,
      isActive: product.status === 'Available',
      imageUrl: product.image,
      description: product.description || ''
    })
    setIsProductModalOpen(true)
  }

  const closeModal = () => setIsProductModalOpen(false)

  const openAddModal = (product) => {
    setInventoryModalMode('add')
    setInventoryModalProduct(product)
    setIsInventoryModalOpen(true)
  }

  const openSubtractModal = (product) => {
    setInventoryModalMode('subtract')
    setInventoryModalProduct(product)
    setIsInventoryModalOpen(true)
  }

  const closeInventoryModal = () => {
    setIsInventoryModalOpen(false)
    setInventoryModalProduct(null)
  }

  const handleConfirm = (updatedProducts) => {
    setProducts(
      updatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        image: p.imageUrl,
        price: p.currentPrice,
        priceUnit: p.priceUnit,
        description: p.description || '',
        status: p.isActive ? 'Available' : 'Not Available'
      }))
    )
  }

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <>
        <ProductMobile
          products={products}
          search={search}
          setSearch={setSearch}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onCreate={openCreateModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          isProductModalOpen={isProductModalOpen}
          setIsProductModalOpen={setIsProductModalOpen}
          productModalMode={productModalMode}
          productModalInitialValues={productModalInitialValues}
          onConfirm={handleConfirm}
          loading={loading}
        />
        {isInventoryModalOpen && inventoryModalProduct && (
          <InventoryAdjustModal
            onClose={closeInventoryModal}
            product={inventoryModalProduct}
            mode={inventoryModalMode}
            onSuccess={refreshData}
          />
        )}
        {isDeleteModalOpen && deleteModalProduct && (
          <DeleteProductModal
            onClose={closeDeleteModal}
            product={deleteModalProduct}
            onSuccess={refreshData}
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
              Products
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

          <ProductFilter
            search={search}
            setSearch={setSearch}
            onSearchSubmit={handleSearchSubmit}
            onSearchKeyDown={handleSearchKeyDown}
            onFilterClick={() => setIsFilterDialogOpen(true)}
            onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
            activeFilterCount={activeFilterCount}
            sortOrder={sortOrder}
          />

          <ProductTable products={products} loading={loading} onEdit={openEditModal} onDelete={openDeleteModal} onAdd={openAddModal} onMinus={openSubtractModal} inventory={inventory} />
        </Box>
      </Box>

      <ProductSortDialog
        anchorEl={sortAnchorEl}
        open={isSortOpen}
        onClose={() => setSortAnchorEl(null)}
        sortOrder={sortOrder}
        onSortSelect={handleSortSelect}
      />

      <ProductFilterDialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={{
          status: urlStatus,
          productId: urlProductId,
          locationId: urlLocationId
        }}
        onApply={handleFilterApply}
        products={allProducts}
        locations={locations}
      />

      {isProductModalOpen && (
        <ProductFormModal
          onClose={closeModal}
          product={productModalMode === 'edit' ? productModalInitialValues : null}
          onConfirm={handleConfirm}
        />
      )}

      {isInventoryModalOpen && inventoryModalProduct && (
        <InventoryAdjustModal
          onClose={closeInventoryModal}
          product={inventoryModalProduct}
          mode={inventoryModalMode}
          onSuccess={refreshData}
        />
      )}

      {isDeleteModalOpen && deleteModalProduct && (
        <DeleteProductModal
          onClose={closeDeleteModal}
          product={deleteModalProduct}
          onSuccess={refreshData}
        />
      )}
    </>
  )
}
