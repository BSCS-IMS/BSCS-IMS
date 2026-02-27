'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Menu,
  Stack,
  Autocomplete,
  TextField,
  Button,
  Divider
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' }
]

export default function AnnouncementsFilterDialog({
  anchorEl,
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

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: 320,
          mt: 1,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          p: 2
        }
      }}
    >
      <Typography variant='subtitle2' fontWeight={600} sx={{ color: '#1F384C', mb: 2 }}>
        Filter Announcements
      </Typography>

      <Stack spacing={2.5}>
        {/* Status Filter */}
        <Box>
          <Typography variant='caption' sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
            Status
          </Typography>
          <Autocomplete
            size='small'
            options={statusOptions}
            value={status}
            onChange={(_, newValue) => setStatus(newValue)}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
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
          <Typography variant='caption' sx={{ color: '#6b7280', mb: 0.5, display: 'block' }}>
            Created Date Range
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction='row' spacing={1} alignItems='center'>
              <DatePicker
                value={dateFrom}
                onChange={(newValue) => setDateFrom(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    placeholder: 'From',
                    sx: {
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#1F384C' },
                        '&.Mui-focused fieldset': { borderColor: '#1F384C' }
                      }
                    }
                  }
                }}
                format='MM/DD/YYYY'
              />
              <Typography variant='body2' sx={{ color: '#6b7280' }}>
                to
              </Typography>
              <DatePicker
                value={dateTo}
                onChange={(newValue) => setDateTo(newValue)}
                minDate={dateFrom || undefined}
                slotProps={{
                  textField: {
                    size: 'small',
                    placeholder: 'To',
                    sx: {
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#1F384C' },
                        '&.Mui-focused fieldset': { borderColor: '#1F384C' }
                      }
                    }
                  }
                }}
                format='MM/DD/YYYY'
              />
            </Stack>
          </LocalizationProvider>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Action Buttons */}
      <Stack direction='row' spacing={1} justifyContent='flex-end'>
        {hasActiveFilters && (
          <Button
            variant='text'
            onClick={handleClear}
            sx={{
              color: '#6b7280',
              textTransform: 'none',
              '&:hover': { bgcolor: '#f3f4f6' }
            }}
          >
            Clear
          </Button>
        )}
        <Button
          variant='contained'
          onClick={handleApply}
          sx={{
            bgcolor: '#1F384C',
            textTransform: 'none',
            '&:hover': { bgcolor: '#162A3F' }
          }}
        >
          Apply Filters
        </Button>
      </Stack>
    </Menu>
  )
}
