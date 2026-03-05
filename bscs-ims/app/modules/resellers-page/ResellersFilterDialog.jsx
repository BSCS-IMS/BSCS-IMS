'use client'

import { useState } from 'react'
import {
  Box,
  Stack,
  Typography,
  Autocomplete,
  TextField
} from '@mui/material'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

export default function ResellersFilterDialog({
  open,
  onClose,
  products = [],
  resellers = [],
  filters,
  onApply
}) {
  // Use lazy initialization to avoid setState in effect
  const [status, setStatus] = useState(() => statusOptions.find((opt) => opt.value === filters.status) || null)
  const [product, setProduct] = useState(() => products.find((p) => p.id === filters.productId) || null)
  const [reseller, setReseller] = useState(() => resellers.find((r) => r.id === filters.resellerId) || null)

  const handleApply = () => {
    onApply({
      status: status?.value || '',
      productId: product?.id || '',
      resellerId: reseller?.id || ''
    })
    onClose()
  }

  const handleClear = () => {
    setStatus(null)
    setProduct(null)
    setReseller(null)
    onApply({
      status: '',
      productId: '',
      resellerId: ''
    })
    onClose()
  }

  const hasActiveFilters = status?.value || product?.id || reseller?.id

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden relative">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-1">
          <div>
            <h2 className="text-base font-semibold text-[#1F384C]">
              Filter Resellers
            </h2>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Narrow down reseller results
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="h-7 w-7 p-0 text-[#6b7280] hover:text-[#1F384C]"
          >
            <X size={16} />
          </Button>
        </div>

        <Separator className="my-3 mx-4" />

        {/* Content */}
        <div className="px-4 pb-4">
          <Stack spacing={3}>

            {/* Reseller Name */}
            <Box>
              <Typography variant="caption" fontWeight={500} sx={{ color: '#1F384C' }}>
                Reseller Name
              </Typography>
              <Autocomplete
                size="small"
                options={Array.isArray(resellers) ? resellers : []}
                value={reseller}
                onChange={(_, v) => setReseller(v)}
                getOptionLabel={(o) => o?.businessName || o?.ownerName || ''}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                disablePortal
                slotProps={{
                  popper: {
                    sx: {
                      zIndex: 10000
                    }
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select reseller" />
                )}
              />
            </Box>

            {/* Status */}
            <Box>
              <Typography variant="caption" fontWeight={500} sx={{ color: '#1F384C' }}>
                Status
              </Typography>
              <Autocomplete
                size="small"
                options={statusOptions}
                value={status}
                onChange={(_, v) => setStatus(v)}
                getOptionLabel={(o) => o.label}
                isOptionEqualToValue={(a, b) => a.value === b.value}
                disablePortal
                slotProps={{
                  popper: {
                    sx: {
                      zIndex: 10000
                    }
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select status" />
                )}
              />
            </Box>

            {/* Products Owned */}
            <Box>
              <Typography variant="caption" fontWeight={500} sx={{ color: '#1F384C' }}>
                Products Owned
              </Typography>
              <Autocomplete
                size="small"
                options={Array.isArray(products) ? products : []}
                value={product}
                onChange={(_, v) => setProduct(v)}
                getOptionLabel={(o) =>
                  o?.name ||
                  o?.productName ||
                  o?.title ||
                  ''
                }
                isOptionEqualToValue={(a, b) => a.id === b.id}
                disablePortal
                slotProps={{
                  popper: {
                    sx: { zIndex: 10000 }
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select product" />
                )}
              />
            </Box>

          </Stack>
        </div>

        <Separator />

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={handleClear}
              className="h-8 text-xs px-3 text-[#6b7280]"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="h-8 text-xs px-3"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}