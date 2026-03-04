'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function ProductFilterDialog({
  open,
  onClose,
  onApply
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [filterType, setFilterType] = useState('')
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')

  useEffect(() => {
    if (!open) {
      setFilterType('')
      setValue('')
      setStatusValue('')
    }
  }, [open])

  const handleApply = () => {
    if (!filterType) return

    if (filterType === 'status') {
      onApply({ type: 'status', value: statusValue })
    } else {
      onApply({ type: filterType, value })
    }

    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          p: 1
        }
      }}
    >
      {/* TITLE + CLOSE */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        <Typography fontSize={14} fontWeight={600}>
          Filter Products
        </Typography>

        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <FormControl fullWidth>
            <InputLabel sx={{ fontSize: 12 }}>Filter By</InputLabel>
            <Select
              value={filterType}
              label="Filter By"
              onChange={(e) => {
                setFilterType(e.target.value)
                setValue('')
                setStatusValue('')
              }}
              sx={{ fontSize: 12 }}
            >
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="sku">Product SKU</MenuItem>
              <MenuItem value="inventory">Inventory Location</MenuItem>
            </Select>
          </FormControl>

          {filterType === 'status' && (
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: 12 }}>Status</InputLabel>
              <Select
                value={statusValue}
                label="Status"
                onChange={(e) => setStatusValue(e.target.value)}
                sx={{ fontSize: 12 }}
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Not Available">Not Available</MenuItem>
              </Select>
            </FormControl>
          )}

          {(filterType === 'sku' || filterType === 'inventory') && (
            <TextField
              fullWidth
              label={
                filterType === 'sku'
                  ? 'Enter Product SKU'
                  : 'Enter Inventory Location'
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              InputLabelProps={{ sx: { fontSize: 12 } }}
              inputProps={{ style: { fontSize: 12 } }}
            />
          )}
        </Stack>
      </DialogContent>

      {filterType && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            sx={{ textTransform: 'none', fontSize: 12 }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleApply}
            sx={{ textTransform: 'none', fontSize: 12 }}
            disabled={
              (filterType === 'status' && !statusValue) ||
              (filterType !== 'status' && !value)
            }
          >
            Confirm
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}