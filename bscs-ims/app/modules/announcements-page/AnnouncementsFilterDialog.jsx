'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Stack,
  Autocomplete,
  TextField
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' }
]

export default function AnnouncementsFilterDialog({
  open,
  onClose,
  filters,
  onApply
}) {
  const [status, setStatus] = useState(null)
  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)

  // Sync internal state with external filters when dialog opens
  useEffect(() => {
    if (open) {
      const statusOption = statusOptions.find((opt) => opt.value === filters.status) || null
      setStatus(statusOption)
      setDateFrom(filters.dateFrom ? dayjs(filters.dateFrom) : null)
      setDateTo(filters.dateTo ? dayjs(filters.dateTo) : null)
    }
  }, [open, filters])

  const handleApply = () => {
    onApply({
      status: status?.value || '',
      dateFrom: dateFrom ? dateFrom.format('YYYY-MM-DD') : '',
      dateTo: dateTo ? dateTo.format('YYYY-MM-DD') : ''
    })
    onClose()
  }

  const handleClear = () => {
    setStatus(null)
    setDateFrom(null)
    setDateTo(null)
    onApply({
      status: '',
      dateFrom: '',
      dateTo: ''
    })
    onClose()
  }

  const hasActiveFilters = status?.value || dateFrom || dateTo

  if (!open) return null

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-9999 p-4'>
      <div className='bg-white w-full max-w-md overflow-hidden rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>Filter Announcements</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>Apply filters to narrow down results</p>
          </div>

          <Button
            variant='ghost'
            onClick={onClose}
            className='h-7 w-7 p-0 text-[#6b7280] hover:text-[#1F384C] hover:bg-[#f3f4f6]'
          >
            <X size={16} />
          </Button>
        </div>

        <Separator className='my-3 mx-4 sm:mx-6' />

        {/* Filter Content */}
        <div className='px-4 sm:px-6 pb-4'>
          <Stack spacing={3}>
            {/* Status Filter */}
            <Box>
              <Typography variant='caption' sx={{ color: '#374151', fontWeight: 500, mb: 0.5, display: 'block' }}>
                Status
              </Typography>
              <Autocomplete
                size='small'
                options={statusOptions}
                value={status}
                onChange={(_, newValue) => setStatus(newValue)}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                slotProps={{
                  popper: {
                    sx: { zIndex: 10000 }
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder='Select status'
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

            {/* Date Range Filter */}
            <Box>
              <Typography variant='caption' sx={{ color: '#374151', fontWeight: 500, mb: 1, display: 'block' }}>
                Created Date Range
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={2}>
                  <DatePicker
                    label='From'
                    value={dateFrom}
                    onChange={(newValue) => setDateFrom(newValue)}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            '& fieldset': { borderColor: '#e5e7eb' },
                            '&:hover fieldset': { borderColor: '#1F384C' },
                            '&.Mui-focused fieldset': { borderColor: '#1F384C' }
                          }
                        }
                      },
                      popper: {
                        sx: { zIndex: 10000 }
                      }
                    }}
                    format='MM/DD/YYYY'
                  />
                  <DatePicker
                    label='To'
                    value={dateTo}
                    onChange={(newValue) => setDateTo(newValue)}
                    minDate={dateFrom || undefined}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            '& fieldset': { borderColor: '#e5e7eb' },
                            '&:hover fieldset': { borderColor: '#1F384C' },
                            '&.Mui-focused fieldset': { borderColor: '#1F384C' }
                          }
                        }
                      },
                      popper: {
                        sx: { zIndex: 10000 }
                      }
                    }}
                    format='MM/DD/YYYY'
                  />
                </Stack>
              </LocalizationProvider>
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
              className='h-8 text-xs px-3 text-[#6b7280] hover:text-[#1F384C]'
            >
              Clear All
            </Button>
          )}
          <Button
            variant='outline'
            onClick={onClose}
            className='h-8 text-xs px-3'
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className='bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3'
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
