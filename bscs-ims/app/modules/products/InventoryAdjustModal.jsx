'use client'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-toastify'
import { FormControl, Select, MenuItem } from '@mui/material'

export default function InventoryAdjustModal({ onClose, product, mode = 'add', onSuccess }) {
  const [locations, setLocations] = useState([])
  const [inventory, setInventory] = useState([])
  const [locationId, setLocationId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)

  const isAdd = mode === 'add'
  const title = isAdd ? 'Add Stock' : 'Subtract Stock'
  const subtitle = isAdd
    ? 'Add inventory to this product.'
    : 'Subtract inventory from this product.'

  useEffect(() => {
    async function fetchData() {
      try {
        const [locRes, invRes] = await Promise.all([
          axios.get('/api/location'),
          axios.get('/api/inventory')
        ])

        if (locRes.data.success) {
          setLocations(locRes.data.locations)
        }
        if (invRes.data.success) {
          setInventory(invRes.data.data)
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        toast.error('Failed to load locations')
      }
    }
    fetchData()
  }, [])

  const currentQuantity = useMemo(() => {
    if (!locationId) return null
    const inv = inventory.find(
      (i) => i.productId === product.id && i.locationId === locationId
    )
    return inv ? inv.quantity : 0
  }, [locationId, inventory, product.id])

  const formatNumber = (num) => {
    return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }

  const isValid = locationId && quantity && parseFloat(quantity) > 0

  async function handleSubmit() {
    if (!isValid) return

    setLoading(true)

    try {
      const endpoint = isAdd ? '/api/inventory/add' : '/api/inventory/deduct'
      const res = await axios.post(endpoint, {
        productId: product.id,
        locationId,
        quantity: parseFloat(quantity)
      })

      if (!res.data.success) {
        toast.error(res.data.error || 'Failed to update inventory')
        return
      }

      const selectedLocation = locations.find((l) => l.id === locationId)
      const locationName = selectedLocation?.name || 'location'

      toast.success(
        isAdd
          ? `Added ${quantity} to ${locationName}`
          : `Subtracted ${quantity} from ${locationName}`
      )

      onSuccess?.()
      onClose?.()
    } catch (err) {
      console.error('Inventory update failed:', err)
      const errorMsg = err.response?.data?.error || 'Failed to update inventory'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-1">
          <div>
            <h2 className="text-base font-semibold text-[#1F384C]">{title}</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">{subtitle}</p>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="h-7 w-7 p-0 text-[#6b7280] hover:text-[#1F384C] hover:bg-[#f3f4f6]"
          >
            <X size={16} />
          </Button>
        </div>

        <Separator className="my-3 mx-4 sm:mx-6" />

        {/* Product Info */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="bg-[#f9fafb] rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-[#1F384C]">{product.name}</p>
            <p className="text-xs text-[#6b7280]">SKU: {product.sku}</p>
          </div>

          {/* Location Select */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Inventory Location <span className="text-red-500">*</span>
            </label>
            <FormControl fullWidth size="small">
              <Select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 200 }
                  },
                  sx: { zIndex: 10000 }
                }}
                sx={{
                  bgcolor: 'white',
                  height: 36,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1F384C',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1F384C',
                    borderWidth: '2px',
                  },
                  '& .MuiSelect-select': {
                    color: locationId ? '#374151' : '#9ca3af',
                    fontSize: '0.75rem',
                  },
                }}
              >
                <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>
                  Select location
                </MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id} sx={{ fontSize: '0.75rem' }}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Quantity Input */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0.01"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full h-9 px-3 rounded-md border border-[#e5e7eb] bg-white text-[#374151] text-xs focus:outline-none focus:ring-1 focus:ring-[#1F384C]/20 focus:border-[#1F384C]"
            />
            {/* Current Quantity Display */}
            {locationId && currentQuantity !== null && (
              <p className="text-[10px] text-[#6b7280] mt-1.5">
                Current stock: <span className="font-medium text-[#1F384C]">{formatNumber(currentQuantity)}</span>
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-3">
          <Button variant="outline" onClick={onClose} disabled={loading} className="h-8 text-xs px-3">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  )
}
