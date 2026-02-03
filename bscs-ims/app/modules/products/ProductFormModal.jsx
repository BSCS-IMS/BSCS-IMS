'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ProductFormFields from './ProductFormFields'

const defaultValues = {
  sku: '',
  productName: '',
  amount: '',
  priceUnit: 'Kg',
  status: 'Active',
  description: '',
  imageFile: null
}

export default function ProductFormModal({ onClose, product = null, onConfirm }) {
  const [form, setForm] = useState({
    ...defaultValues,
    ...(product
      ? {
          sku: product.sku ?? '',
          productName: product.name ?? product.productName ?? '',
          amount: product.currentPrice ?? product.amount ?? '',
          priceUnit: product.priceUnit ?? 'Kg',
          status: product.isActive === false ? 'Inactive' : 'Active',
          description: product.description ?? ''
        }
      : {})
  })

  const [imageName, setImageName] = useState('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  useEffect(() => {
    if (product?.imageUrl) {
      setImagePreviewUrl(product.imageUrl)
      setImageName('Current image')
    }
  }, [product])

  const title = product ? 'Edit Product' : 'Create Product'
  const subtitle = product ? 'Update the product details.' : 'Fill out the details for the new product.'

  const isValid = useMemo(() => {
    if (!form.productName?.trim()) return false
    if (!form.sku?.trim()) return false

    if (String(form.amount).trim() === '') return false
    const n = Number(form.amount)
    if (Number.isNaN(n)) return false

    if (!form.priceUnit?.trim()) return false
    if (!form.status?.trim()) return false
    if (!form.description?.trim()) return false
    return true
  }, [form])

  const handleImageChange = (e) => {
    const f = e.target.files?.[0] || null

    setForm((p) => ({ ...p, imageFile: f }))
    setImageName(f?.name || '')

    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl)
    }

    if (f) setImagePreviewUrl(URL.createObjectURL(f))
    else setImagePreviewUrl(product?.imageUrl || '')
  }

  async function handleSubmit() {
    try {
      const payload = {
        name: form.productName.trim(),
        sku: form.sku.trim(),
        currentPrice: Number(form.amount),
        priceUnit: form.priceUnit,
        imageUrl: imagePreviewUrl || '', // temporary until real upload
        isActive: form.status === 'Active',
        description: form.description
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!data?.success) {
        alert(data?.error || 'Failed to save product')
        return
      }

      onConfirm?.(data.products)
      onClose?.()
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save product')
    }
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white w-170 max-h-[90vh] overflow-y-auto rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-7 pt-6 pb-1'>
          <div>
            <h2 className='text-lg font-semibold text-[#1F384C]'>{title}</h2>
            <p className='text-sm text-[#6b7280] mt-0.5'>{subtitle}</p>
          </div>

          <Button
            variant='ghost'
            onClick={onClose}
            className='h-8 w-8 p-0 text-[#6b7280] hover:text-[#1F384C] hover:bg-[#f3f4f6] rounded-md cursor-pointer'
          >
            <X size={18} />
          </Button>
        </div>

        <Separator className='my-4 mx-7' />

        <ProductFormFields
          form={form}
          setForm={setForm}
          imageName={imageName}
          imagePreviewUrl={imagePreviewUrl}
          onImageChange={handleImageChange}
        />

        <Separator />
        <div className='flex items-center justify-end gap-3 px-7 py-4'>
          <Button
            variant='outline'
            onClick={onClose}
            className='border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6] cursor-pointer'
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!isValid}
           className='bg-[#1F384C] text-white hover:bg-[#162A3F] px-5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'

          >
            {product ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  )
}
