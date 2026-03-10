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

const adjustmentOptions = [
  { label: 'All Adjustments', value: '' },
  { label: 'Add (+)',         value: 'add' },
  { label: 'Subtract (−)',    value: 'subtract' },
]

export default function HistoryFilterDialog({
  open,
  onClose,
  filters,
  products  = [],
  locations = [],
  onApply
}) {
  const [product,    setProduct]    = useState(null)
  const [location,   setLocation]   = useState(null)
  const [adjustment, setAdjustment] = useState(null)

  const productOptions = [
    { label: 'All Products', value: '' },
    ...products.map((p) => ({ label: p.name, value: p.id }))
  ]

  const locationOptions = [
    { label: 'All Locations', value: '' },
    ...locations.map((l) => ({ label: l.name, value: l.id }))
  ]

  // Sync with external filters when dialog opens
  useEffect(() => {
    if (open) {
      setProduct(productOptions.find((o) => o.value === filters.product) || null)
      setLocation(locationOptions.find((o) => o.value === filters.location) || null)
      setAdjustment(adjustmentOptions.find((o) => o.value === filters.adjustment) || null)
    }
  }, [open, filters, products, locations])

  const handleApply = () => {
    onApply({
      product:    product?.value    || '',
      location:   location?.value   || '',
      adjustment: adjustment?.value || '',
    })
    onClose()
  }

  const handleClear = () => {
    setProduct(null)
    setLocation(null)
    setAdjustment(null)
    onApply({ product: '', location: '', adjustment: '' })
    onClose()
  }

  const hasActiveFilters = product?.value || location?.value || adjustment?.value

  if (!open) return null

  const autocompleteSharedSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      '& fieldset': { borderColor: '#e5e7eb' },
      '&:hover fieldset': { borderColor: '#1F384C' },
      '&.Mui-focused fieldset': { borderColor: '#1F384C' }
    }
  }

  const popperSx = { zIndex: 10000 }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white w-full max-w-md overflow-hidden rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>Filter History</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>Narrow down inventory adjustment records</p>
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

        {/* Filters */}
        <div className='px-4 sm:px-6 pb-4'>
          <Stack spacing={3}>

            {/* Product */}
            <Box>
              <Typography variant='caption' sx={{ color: '#374151', fontWeight: 500, mb: 0.5, display: 'block' }}>
                Product
              </Typography>
              <Autocomplete
                size='small'
                options={productOptions}
                value={product}
                onChange={(_, v) => setProduct(v)}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(o, v) => o.value === v.value}
                slotProps={{ popper: { sx: popperSx } }}
                renderInput={(params) => (
                  <TextField {...params} placeholder='Select product' sx={autocompleteSharedSx} />
                )}
              />
            </Box>

            {/* Location */}
            <Box>
              <Typography variant='caption' sx={{ color: '#374151', fontWeight: 500, mb: 0.5, display: 'block' }}>
                Location
              </Typography>
              <Autocomplete
                size='small'
                options={locationOptions}
                value={location}
                onChange={(_, v) => setLocation(v)}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(o, v) => o.value === v.value}
                slotProps={{ popper: { sx: popperSx } }}
                renderInput={(params) => (
                  <TextField {...params} placeholder='Select location' sx={autocompleteSharedSx} />
                )}
              />
            </Box>

            {/* Adjustment */}
            <Box>
              <Typography variant='caption' sx={{ color: '#374151', fontWeight: 500, mb: 0.5, display: 'block' }}>
                Adjustment
              </Typography>
              <Autocomplete
                size='small'
                options={adjustmentOptions}
                value={adjustment}
                onChange={(_, v) => setAdjustment(v)}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(o, v) => o.value === v.value}
                slotProps={{ popper: { sx: popperSx } }}
                renderInput={(params) => (
                  <TextField {...params} placeholder='Select adjustment type' sx={autocompleteSharedSx} />
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