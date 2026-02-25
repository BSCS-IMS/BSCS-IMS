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

  const isValid = locationId && quantity && parseInt(quantity) > 0

  async function handleSubmit() {
    if (!isValid) return

    setLoading(true)

    try {
      const endpoint = isAdd ? '/api/inventory/add' : '/api/inventory/deduct'
      const res = await axios.post(endpoint, {
        productId: product.id,
        locationId,
        quantity: parseInt(quantity)
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
        <div className="flex items-center justify-between px-4 sm:px-7 pt-6 pb-1">
          <div>
            <h2 className="text-lg font-semibold text-[#1F384C]">{title}</h2>
            <p className="text-sm text-[#6b7280] mt-0.5">{subtitle}</p>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 text-[#6b7280] hover:text-[#1F384C] hover:bg-[#f3f4f6]"
          >
            <X size={18} />
          </Button>
        </div>

        <Separator className="my-4 mx-4 sm:mx-7" />

        {/* Product Info */}
        <div className="px-4 sm:px-7 pb-4">
          <div className="bg-[#f9fafb] rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-[#1F384C]">{product.name}</p>
            <p className="text-sm text-[#6b7280]">SKU: {product.sku}</p>
          </div>

          {/* Location Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
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
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1e40af',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1e40af',
                    borderWidth: '2px',
                  },
                  '& .MuiSelect-select': {
                    color: locationId ? '#374151' : '#9ca3af',
                    fontSize: '0.875rem',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select location
                </MenuItem>
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Quantity Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full h-10 px-3 rounded-md border border-[#e5e7eb] bg-white text-[#374151] text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
            />
            {/* Current Quantity Display */}
            {locationId && currentQuantity !== null && (
              <p className="text-sm text-[#6b7280] mt-2">
                Current stock at this location: <span className="font-medium text-[#1F384C]">{currentQuantity}</span>
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-7 py-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="bg-[#1F384C] text-white hover:bg-[#162A3F]"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  )
}
