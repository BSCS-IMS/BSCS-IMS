'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Typography, Stack, Button, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import ProductTable from './ProductTable'
import ProductMobile from './ProductMobile'
import ProductFilter from './ProductFilter'
import ProductSortDialog from './ProductSortDialog'
import ProductFormModal from './ProductFormModal'

export default function ProductPage() {
  const isDesktop = useMediaQuery('(min-width:900px)')

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

    // shape ProductFormModal expects
    setProductModalInitialValues({
      id: product.id,
      name: product.name,
      sku: product.sku,
      currentPrice: product.price,
      priceUnit: product.priceUnit,
      isActive: product.status === 'Available',
      imageUrl: product.image,
      description: '' // keep empty for now
    })

    setIsProductModalOpen(true)
  }

  const closeModal = () => setIsProductModalOpen(false)

  return (
    <>
      {isDesktop ? (
        <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 4 }}>
          <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
            {/* Header */}
            <Stack direction='row' justifyContent='space-between' alignItems='center' mb={3}>
              <Typography variant='h5' fontWeight={700}>
                Products
              </Typography>

              <Button
                variant='contained'
                disableElevation
                onClick={openCreateModal}
                sx={{
                  flexDirection: 'column',
                  px: 1.5,
                  py: 1,
                  minWidth: 60,
                  textTransform: 'none',
                  bgcolor: '#f5f7fb',
                  color: '#000',
                  '&:hover': { bgcolor: '#f0f0f0' }
                }}
              >
                <AddIcon />
                <Typography fontSize={14}>Add</Typography>
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
      ) : (
        <ProductMobile
          products={filteredProducts}
          search={search}
          setSearch={setSearch}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onCreate={openCreateModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

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

      {/* modal does NOT use open/mode/initialValues props */}
      {isProductModalOpen && (
        <ProductFormModal
          onClose={closeModal}
          product={productModalMode === 'edit' ? productModalInitialValues : null}
          onConfirm={(updatedProducts) => {
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
          }}
        />
      )}
    </>
  )
}
