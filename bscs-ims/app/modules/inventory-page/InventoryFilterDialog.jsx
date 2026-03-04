'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Stack,
  Autocomplete,
  TextField
} from '@mui/material'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function InventoryFilterDialog({
  open,
  onClose,
  filters,
  onApply,
  locations = [],  // [{ value: id, label: name }]
  products = [],   // [{ value: id, label: name }]
  rows = [],       // full grouped rows to filter products by location
}) {
  const [location, setLocation] = useState(null)
  const [product, setProduct] = useState(null)

  // When location changes, reset product selection
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation)
    setProduct(null)
  }

  // Sync internal state with external filters when dialog opens
  useEffect(() => {
    if (open) {
      setLocation(locations.find((l) => l.value === filters.locationId) || null)
      setProduct(products.find((p) => p.value === filters.productId) || null)
    }
  }, [open, filters, locations, products])

  const handleApply = () => {
    onApply({
      locationId: location?.value || '',
      productId: product?.value || '',
    })
    onClose()
  }

  const handleClear = () => {
    setLocation(null)
    setProduct(null)
    onApply({ locationId: '', productId: '' })
    onClose()
  }

  const hasActiveFilters = location || product

  if (!open) return null

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white w-full max-w-md overflow-hidden rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>Filter Inventory</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>Apply filters to narrow down results</p>
          </div>
          <Button
            variant='ghost'
            onClick={onClose}
            className='h-7 w-7 p-0 text-[#6b7280] hover:text-[#1F384C] hover:bg-[#f3f4f6] cursor-pointer'
          >
            <X size={16} />
          </Button>
        </div>

        <Separator className='my-3 mx-4 sm:mx-6' />

        {/* Filter Content */}
        <div className='px-4 sm:px-6 pb-4'>
          <Stack spacing={3}>
            {/* Location Filter */}
            <Box>
              <Typography variant='caption' sx={{ color: '#374151', fontWeight: 500, mb: 0.5, display: 'block' }}>
                Location
              </Typography>
              <Autocomplete
                size='small'
                options={locations}
                value={location}
                onChange={(_, newValue) => handleLocationChange(newValue)}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                slotProps={{ popper: { sx: { zIndex: 10000 } } }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Select location'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#1F384C' },
                        '&.Mui-focused fieldset': { borderColor: '#1F384C' }
                      }
                    }}
                  />
                )}
              />
            </Box>

            {/* Product Filter */}
            <Box>
              <Typography variant='caption' sx={{ color: '#374151', fontWeight: 500, mb: 0.5, display: 'block' }}>
                Product
              </Typography>
              <Autocomplete
                size='small'
                options={
                  location
                    ? products.filter((p) =>
                        rows
                          .find((r) => r.locationId === location.value)
                          ?.items.some((i) => i.productId === p.value) ?? false
                      )
                    : products
                }
                value={product}
                onChange={(_, newValue) => setProduct(newValue)}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                slotProps={{ popper: { sx: { zIndex: 10000 } } }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Select product'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#1F384C' },
                        '&.Mui-focused fieldset': { borderColor: '#1F384C' }
                      }
                    }}
                  />
                )}
              />
            </Box>
          </Stack>
        </div>

        <Separator />

        {/* Footer */}
        <div className='flex items-center justify-end gap-2 px-4 sm:px-6 py-3'>
          {hasActiveFilters && (
            <Button
              variant='ghost'
              onClick={handleClear}
              className='h-8 text-xs px-3 text-[#6b7280] hover:text-[#1F384C] cursor-pointer'
            >
              Clear All
            </Button>
          )}
          <Button
            variant='outline'
            onClick={onClose}
            className='h-8 text-xs px-3 cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className='bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3 cursor-pointer'
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}