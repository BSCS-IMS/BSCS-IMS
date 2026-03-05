'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

export default function ProductFilterDialog({ open, onClose, onApply }) {

  const [status, setStatus] = useState('')

  const [nameEnabled, setNameEnabled] = useState(false)
  const [productName, setProductName] = useState('')

  const [skuEnabled, setSkuEnabled] = useState(false)
  const [sku, setSku] = useState('')

  const [location, setLocation] = useState('')
  const [locations, setLocations] = useState([])

  /* ==========================
     Fetch Locations from API
  ========================== */

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/inventory')

      if (res.data.success) {

        // extract unique locations
        const uniqueLocations = [
          ...new Set(res.data.data.map((item) => item.locationName))
        ]

        setLocations(uniqueLocations)
      }

    } catch (error) {
      console.error('Failed to fetch locations', error)
    }
  }

  useEffect(() => {
    if (open) {
      fetchLocations()
    }
  }, [open])

  if (!open) return null

  /* ==========================
     Apply Filters
  ========================== */

  const handleApply = () => {

    const filters = {}

    if (status) filters.status = status
    if (nameEnabled && productName) filters.name = productName
    if (skuEnabled && sku) filters.sku = sku
    if (location) filters.location = location

    onApply(filters)
    onClose()
  }

  const handleClear = () => {
    setStatus('')
    setNameEnabled(false)
    setProductName('')
    setSkuEnabled(false)
    setSku('')
    setLocation('')
  }

  const hasFilter =
    status ||
    (nameEnabled && productName) ||
    (skuEnabled && sku) ||
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
            <div>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={nameEnabled}
                    onChange={(e) => setNameEnabled(e.target.checked)}
                  />
                }
                label="Filter by Product Name"
              />

              {nameEnabled && (
                <TextField
                  fullWidth
                  size="small"
                  label="Enter Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              )}

            </div>


            {/* SKU */}
            <div>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={skuEnabled}
                    onChange={(e) => setSkuEnabled(e.target.checked)}
                  />
                }
                label="Filter by Product SKU"
              />

              {skuEnabled && (
                <TextField
                  fullWidth
                  size="small"
                  label="Enter Product SKU"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              )}

            </div>


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