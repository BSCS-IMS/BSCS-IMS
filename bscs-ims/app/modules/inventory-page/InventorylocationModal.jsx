'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/app/components/ToastProvider'

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FieldLabel({ label, required }) {
  return (
    <label className='block text-xs font-medium text-[#1F384C] mb-1'>
      {label}
      {required && <span className='text-red-500 ml-0.5'>*</span>}
    </label>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const newProductRow = () => ({ id: crypto.randomUUID(), productId: '', qty: '' })

function buildInitialItems(entry) {
  if (!entry) return [newProductRow()]
  if (entry.items?.length) {
    const filtered = entry.items
      .filter((i) => Number(i.qty) > 0)
      .map((i) => ({ id: crypto.randomUUID(), productId: i.productId, qty: String(i.qty) }))
    return filtered.length > 0 ? filtered : [newProductRow()]
  }
  if (Number(entry.qty) > 0) {
    return [{ id: crypto.randomUUID(), productId: entry.productId ?? '', qty: String(entry.qty ?? '') }]
  }
  return [newProductRow()]
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export default function InventoryLocationModal({ onClose, entry = null, onConfirm }) {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get('/api/products')
        if (res.data?.success) {
          setProducts(
            res.data.products.map((p) => ({
              value: p.id,
              label: `${p.sku} – ${p.name}`,
              isActive: p.isActive !== false
            }))
          )
        }
      } catch (err) {
        console.error('Failed to load products:', err)
        toast.error('Failed to load products')
      } finally {
        setProductsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const [locationName, setLocationName] = useState(entry?.locationName ?? '')
  const [items, setItems] = useState(() => buildInitialItems(entry))
  const [loading, setLoading] = useState(false)

  const isEditing = !!entry
  const title = isEditing ? 'Edit Inventory Location' : 'Add Inventory Location'
  const subtitle = isEditing
    ? 'Update the location and its assigned products.'
    : 'Create a location and optionally assign products to it.'

  const isValid = useMemo(() => {
    // Location name is always required
    if (locationName.trim().length === 0) return false

    // If there are any filled items, they must be complete
    const filledItems = items.filter((r) => r.productId || r.qty)
    if (filledItems.length > 0) {
      return filledItems.every((r) => r.productId && r.qty !== '' && Number(r.qty) > 0)
    }

    // Allow creating location without any products
    return true
  }, [locationName, items])

  const selectedProductIds = useMemo(() => items.map((r) => r.productId).filter(Boolean), [items])

  const updateItem = (id, key, val) => setItems((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: val } : r)))

  const addItem = () => setItems((prev) => [...prev, newProductRow()])

  const removeItem = (id) => setItems((prev) => prev.filter((r) => r.id !== id))

  async function handleSubmit() {
    if (loading || !isValid) return
    setLoading(true)

    try {
      let locationId = null

      if (isEditing) {
        const renameRes = await axios.put(`/api/location/${entry.locationId}`, { name: locationName.trim() })
        if (!renameRes.data?.success) {
          toast.error(renameRes.data?.error || 'Failed to update location name')
          return
        }
        locationId = entry.locationId
      } else {
        try {
          const locationRes = await axios.post('/api/location', { name: locationName.trim() })
          if (!locationRes.data?.success) {
            toast.error(locationRes.data?.error || 'Failed to create location')
            return
          }
          locationId = locationRes.data.id
        } catch (err) {
          if (err.response?.status === 409) {
            toast.error(err.response?.data?.error || 'Location name already exists')
            return
          } else {
            throw err
          }
        }
      }

      // Filter out items that are actually filled (have productId and quantity)
      const filledItems = items.filter((r) => r.productId && r.qty && Number(r.qty) > 0)

      const currentProductIds = filledItems.map((r) => r.productId)
      const removedItems = isEditing
        ? (entry.items ?? []).filter((i) => !currentProductIds.includes(i.productId) && Number(i.qty) > 0)
        : []

      const allOps = [
        ...removedItems.map((i) =>
          axios.post('/api/inventory/deduct', {
            productId: i.productId,
            locationId,
            quantity: Number(i.qty)
          })
        ),
        ...filledItems.map((row) => {
          const newQty = Number(row.qty)

          if (isEditing) {
            const original = entry.items?.find((i) => i.productId === row.productId)
            const currentQty = original ? Number(original.qty) : 0
            const diff = newQty - currentQty

            if (diff === 0) return Promise.resolve({ data: { success: true } })
            if (diff > 0) {
              return axios.post('/api/inventory/add', {
                productId: row.productId,
                locationId,
                quantity: diff
              })
            } else {
              return axios.post('/api/inventory/deduct', {
                productId: row.productId,
                locationId,
                quantity: Math.abs(diff)
              })
            }
          }

          return axios.post('/api/inventory/add', {
            productId: row.productId,
            locationId,
            quantity: newQty
          })
        })
      ]

      // Only process inventory operations if there are any
      if (allOps.length > 0) {
        const results = await Promise.allSettled(allOps)
        const failed = results.filter((r) => r.status === 'rejected' || r.value?.data?.success === false)

        if (failed.length > 0) {
          const firstErr =
            failed[0].reason?.response?.data?.error || failed[0].value?.data?.error || 'Some products failed to save'
          toast.error(firstErr)
          onConfirm?.()
          return
        }
      }

      toast.success(isEditing ? 'Inventory location updated' : 'Inventory location created')
      onConfirm?.()
      onClose?.()
    } catch (err) {
      console.error('Save failed:', err)
      toast.error(err.response?.data?.error || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>{title}</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>{subtitle}</p>
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

        {/* Body */}
        <div className='px-4 sm:px-6 pb-4 flex flex-col gap-5'>
          {/* Location Name */}
          <div>
            <FieldLabel label='Location Name' required />
            <input
              type='text'
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder='e.g. Warehouse A – Shelf 1'
              className='w-full h-9 rounded-md border border-[#d1d5db] bg-white px-3 text-xs text-[#1F384C] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1F384C]/20 focus:border-[#1F384C] transition-colors'
            />
          </div>

          {/* Product rows */}
          <div>
            <div className='grid grid-cols-[1fr_90px_32px] gap-2 mb-1.5'>
              <span className='text-xs font-medium text-[#1F384C]'>
                Product Name <span className='text-[#6b7280] font-normal'>(Optional)</span>
              </span>
              <span className='text-xs font-medium text-[#1F384C]'>Quantity </span>
              <span />
            </div>

            {productsLoading ? (
              <p className='text-xs text-[#6b7280] py-2'>Loading products…</p>
            ) : (
              <div className='flex flex-col gap-2'>
                {items.map((row) => (
                  <div key={row.id} className='grid grid-cols-[1fr_90px_32px] gap-2 items-center'>
                    <Select value={row.productId} onValueChange={(value) => updateItem(row.id, 'productId', value)}>
                      <SelectTrigger className='w-full h-9 text-xs border-[#e5e7eb] cursor-pointer'>
                        <SelectValue placeholder='Select product' />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem
                            key={p.value}
                            value={p.value}
                            disabled={
                              (selectedProductIds.includes(p.value) && p.value !== row.productId) || !p.isActive
                            }
                            className='cursor-pointer text-xs'
                          >
                            {p.isActive ? p.label : `${p.label} [Inactive]`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <input
                      type='number'
                      min='1'
                      step='1'
                      value={row.qty}
                      onChange={(e) => updateItem(row.id, 'qty', e.target.value)}
                      placeholder='0'
                      className='w-full h-9 rounded-md border border-[#d1d5db] bg-white px-3 text-xs text-[#1F384C] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1F384C]/20 focus:border-[#1F384C] transition-colors'
                    />

                    <button
                      onClick={() => removeItem(row.id)}
                      disabled={items.length === 1}
                      className='h-9 w-8 flex items-center justify-center rounded-md text-[#9ca3af] hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors'
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={addItem}
              disabled={productsLoading || items.length >= products.length}
              className='mt-3 flex items-center gap-1.5 text-xs font-medium text-[#1F384C] hover:text-[#162A3F] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors'
            >
              <Plus size={14} />
              Add product
            </button>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className='flex items-center justify-end gap-2 px-4 sm:px-6 py-3'>
          <Button variant='outline' onClick={onClose} disabled={loading} className='h-8 text-xs px-3 cursor-pointer'>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading || productsLoading}
            className='bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3 cursor-pointer'
          >
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </div>

      {/* Spin buttons pointer fix */}
      <style jsx global>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
