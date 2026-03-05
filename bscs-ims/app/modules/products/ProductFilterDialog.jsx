'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

export default function ProductFilterDialog({ open, onClose, onApply }) {

  const [status, setStatus] = useState('')
  const [productName, setProductName] = useState('')
  const [productNames, setProductNames] = useState([])

  const [sku, setSku] = useState('')
  const [skuList, setSkuList] = useState([])

  const [location, setLocation] = useState('')
  const [locations, setLocations] = useState([])

  /* ==========================
     Fetch Locations
  ========================== */

  const fetchLocations = async () => {
    try {

      const res = await axios.get('/api/inventory')

      if (res.data.success) {

        const uniqueLocations = [
          ...new Set(res.data.data.map((item) => item.locationName))
        ]

        setLocations(uniqueLocations)
      }

    } catch (error) {
      console.error('Failed to fetch locations', error)
    }
  }

  /* ==========================
     Fetch Products
  ========================== */

  const fetchProducts = async () => {

    try {

      const res = await axios.get('/api/products')

      if (res.data.success) {

        const products = res.data.products

        const uniqueNames = [
          ...new Set(products.map((p) => p.name))
        ]

        const uniqueSku = [
          ...new Set(products.map((p) => p.sku))
        ]

        setProductNames(uniqueNames)
        setSkuList(uniqueSku)
      }

    } catch (error) {
      console.error('Failed to fetch products', error)
    }

  }

  useEffect(() => {

    if (open) {
      fetchLocations()
      fetchProducts()
    }

  }, [open])

  if (!open) return null

  /* ==========================
     Apply Filters
  ========================== */

  const handleApply = () => {

    const filters = {}

    if (status) filters.status = status
    if (productName) filters.name = productName
    if (sku) filters.sku = sku
    if (location) filters.location = location

    onApply(filters)
    onClose()

  }

  const handleClear = () => {

    setStatus('')
    setProductName('')
    setSku('')
    setLocation('')

  }

  const hasFilter =
    status ||
    productName ||
    sku ||
    location

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-[450px] rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">

          <div>
            <h2 className="text-base font-semibold text-[#1F384C]">
              Filter Products
            </h2>

            <p className="text-xs text-gray-500">
              Apply filters to narrow down results
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="h-7 w-7 p-0 hover:bg-gray-100"
          >
            <X size={16} />
          </Button>

        </div>

        <Separator className="my-3" />

        {/* Filters */}
        <div className="px-5 pb-5">

          <Stack spacing={2.5}>

            {/* STATUS */}
            <FormControl fullWidth size="small">

              <InputLabel>Status</InputLabel>

              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >

                <MenuItem value="">All</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Not Available">Not Available</MenuItem>

              </Select>

            </FormControl>


            {/* PRODUCT NAME */}
            <FormControl fullWidth size="small">

              <InputLabel>Product Name</InputLabel>

              <Select
                value={productName}
                label="Product Name"
                onChange={(e) => setProductName(e.target.value)}
              >

                <MenuItem value="">All</MenuItem>

                {productNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>


            {/* SKU */}
            <FormControl fullWidth size="small">

              <InputLabel>SKU</InputLabel>

              <Select
                value={sku}
                label="SKU"
                onChange={(e) => setSku(e.target.value)}
              >

                <MenuItem value="">All</MenuItem>

                {skuList.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>


            {/* LOCATION */}
            <FormControl fullWidth size="small">

              <InputLabel>Location</InputLabel>

              <Select
                value={location}
                label="Location"
                onChange={(e) => setLocation(e.target.value)}
              >

                <MenuItem value="">All Locations</MenuItem>

                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}

              </Select>

            </FormControl>

          </Stack>

        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3">

          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-xs text-gray-500"
          >
            Clear All
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            onClick={handleApply}
            disabled={!hasFilter}
            className="bg-[#1F384C] text-white hover:bg-[#162A3F] text-xs"
          >
            Apply Filters
          </Button>

        </div>

      </div>
    </div>
  )
}