'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Typography, Stack, Button, useMediaQuery, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import ProductTable from './ProductTable'
import ProductMobile from './ProductMobile'
import ProductFilter from './ProductFilter'
import ProductSortDialog from './ProductSortDialog'
import ProductFormModal from './ProductFormModal'

export default function ProductPage() {
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

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productModalMode, setProductModalMode] = useState('create')
  const [productModalInitialValues, setProductModalInitialValues] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/products')
      if (res.data.success) {
        setProducts(
          res.data.products.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            image: p.imageUrl,
            price: p.currentPrice,
            priceUnit: p.priceUnit,
            status: p.isActive ? 'Available' : 'Not Available'
          }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortOrder) return 0
      if (sortOrder === 'asc') return a.name.localeCompare(b.name)
      if (sortOrder === 'desc') return b.name.localeCompare(a.name)
      return 0
    })

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
      description: ''
    })

    setIsProductModalOpen(true)
  }

  const closeModal = () => setIsProductModalOpen(false)

  const handleConfirm = (updatedProducts) => {
    setProducts(
      updatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        image: p.imageUrl,
        price: p.currentPrice,
        priceUnit: p.priceUnit,
        status: p.isActive ? 'Available' : 'Not Available'
      }))
    )
  }

  if (!mounted) return null

  if (!isDesktop) {
    return (
      <ProductMobile
        products={filteredProducts}
        search={search}
        setSearch={setSearch}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
        isProductModalOpen={isProductModalOpen}
        setIsProductModalOpen={setIsProductModalOpen}
        productModalMode={productModalMode}
        productModalInitialValues={productModalInitialValues}
        onConfirm={handleConfirm}
      />
    )
  }

  return (
    <>
      <Box sx={{ minHeight: '100vh', py: 6 }}>
        <Box sx={{ mx: 'auto', px: 5 }}>
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
            onFilterClick={() => {}}
            onSortClick={(e) => setSortAnchorEl(e.currentTarget)}
          />

          <ProductTable products={filteredProducts} loading={loading} onEdit={openEditModal} onDelete={handleDelete} />
        </Box>
      </Box>

      <ProductSortDialog
        anchorEl={sortAnchorEl}
        open={isSortOpen}
        onClose={() => setSortAnchorEl(null)}
        sortOrder={sortOrder}
        onSortSelect={(order) => {
          setSortOrder(order)
          setSortAnchorEl(null)
        }}
      />

      {isProductModalOpen && (
        <ProductFormModal
          onClose={closeModal}
          product={productModalMode === 'edit' ? productModalInitialValues : null}
          onConfirm={handleConfirm}
        />
      )}
    </>
  )
}
