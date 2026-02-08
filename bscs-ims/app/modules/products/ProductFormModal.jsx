'use client'

import { useMemo, useState } from 'react'
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
  imageFile: null,
  imageUrl: ''
}

export default function ProductFormModal({ onClose, product = null, onConfirm }) {
  const initialFormState = useMemo(() => {
    if (product) {
      return {
        sku: product.sku ?? '',
        productName: product.name ?? product.productName ?? '',
        amount: product.currentPrice ?? '',
        priceUnit: product.priceUnit ?? 'Kg',
        status: product.isActive === false ? 'Inactive' : 'Active',
        description: product.description ?? '',
        imageFile: null,
        imageUrl: product.imageUrl || ''
      }
    }
    return defaultValues
  }, [product])

  const [form, setForm] = useState(initialFormState)
  const [imageName, setImageName] = useState(product?.imageUrl ? 'Current image' : '')
  const [imagePreviewUrl, setImagePreviewUrl] = useState(product?.imageUrl || '')

  const title = product ? 'Edit Product' : 'Create Product'
  const subtitle = product
    ? 'Update the product details.'
    : 'Fill out the details for the new product.'

  // ✅ ONLY SKU + NAME REQUIRED
  const isValid = useMemo(() => {
    if (!form.productName.trim()) return false
    if (!form.sku.trim()) return false
    return true
  }, [form.productName, form.sku])

  const handleImageChange = (e) => {
    const f = e.target.files?.[0] || null

    setForm((p) => ({ ...p, imageFile: f }))
    setImageName(f?.name || '')

    if (imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl)
    }

    if (f) {
      setImagePreviewUrl(URL.createObjectURL(f))
    } else if (form.imageUrl) {
      setImagePreviewUrl(form.imageUrl)
      setImageName('Current image')
    } else {
      setImagePreviewUrl('')
    }
  }

  async function handleSubmit() {
    try {
      const formData = new FormData()

      // REQUIRED
      formData.append('name', form.productName.trim())
      formData.append('sku', form.sku.trim())

      // OPTIONAL FIELDS
      if (form.amount !== '') formData.append('currentPrice', form.amount)
      if (form.priceUnit) formData.append('priceUnit', form.priceUnit)
      if (form.status) formData.append('isActive', form.status === 'Active' ? 'true' : 'false')
      if (form.description?.trim()) formData.append('description', form.description.trim())
      if (product && form.imageUrl) formData.append('imageUrl', form.imageUrl)
      if (form.imageFile) formData.append('file', form.imageFile)

      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const res = await fetch(url, { method, body: formData })
      const data = await res.json()

      if (!data?.success) {
        alert(data?.error || 'Failed to save product')
        return
      }

      const listRes = await fetch('/api/products')
      const listData = await listRes.json()

      if (listData?.success) onConfirm?.(listData.products)

      onClose?.()
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save product')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl relative">
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

        {/* Form Fields */}
        <ProductFormFields
          form={form}
          setForm={setForm}
          imageName={imageName}
          imagePreviewUrl={imagePreviewUrl}
          onImageChange={handleImageChange}
          isEditMode={!!product}
          showAsteriskFields={['productName', 'sku']}
        />

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-7 py-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="bg-[#1F384C] text-white hover:bg-[#162A3F]"
          >
            {product ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  )
}
