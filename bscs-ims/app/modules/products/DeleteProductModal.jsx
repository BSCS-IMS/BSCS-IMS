'use client'

import { useState } from 'react'
import axios from 'axios'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-toastify'

export default function DeleteProductModal({ onClose, product, onSuccess }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)

    try {
      const res = await axios.delete(`/api/products/${product.id}`)

      if (!res.data.success) {
        toast.error(res.data.error || 'Failed to delete product')
        return
      }

      toast.success('Product deleted successfully')
      onSuccess?.()
      onClose?.()
    } catch (err) {
      console.error('Delete failed:', err)
      const errorMsg = err.response?.data?.error || 'Failed to delete product'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white w-full max-w-sm max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 rounded-full bg-[#ffebee]'>
              <AlertTriangle size={16} className='text-[#c62828]' />
            </div>
            <h2 className='text-base font-semibold text-[#1F384C]'>Delete Product</h2>
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

        {/* Content */}
        <div className='px-4 sm:px-6 pb-4'>
          <div className='bg-[#fff8f8] border border-[#ffcdd2] rounded-lg p-3 mb-4'>
            <p className='text-xs font-medium text-[#1F384C]'>{product.name}</p>
            <p className='text-xs text-[#6b7280]'>SKU: {product.sku}</p>
          </div>

          <p className='text-xs text-[#374151] leading-relaxed'>
            Are you sure you want to delete this product? This action will deactivate the product and it will no longer
            appear in the product list.
          </p>
        </div>

        <Separator />

        {/* Footer */}
        <div className='flex items-center justify-end gap-2 px-4 sm:px-6 py-3'>
          <Button variant='outline' onClick={onClose} disabled={loading} className='h-8 text-xs px-3'>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className='bg-[#c62828] text-white hover:bg-[#b71c1c] h-8 text-xs px-3'
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
