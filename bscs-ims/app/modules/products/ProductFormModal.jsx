'use client'

import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-toastify'
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
  const [loading, setLoading] = useState(false)

  // Cleanup blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

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

  const handleImageRemove = () => {
    if (imagePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl)
    }
    setForm((p) => ({ ...p, imageFile: null, imageUrl: '', removeImage: true }))
    setImageName('')
    setImagePreviewUrl('')
  }

  async function handleSubmit() {
    if (loading) return
    setLoading(true)

    try {
      const formData = new FormData()

      // REQUIRED
      formData.append('name', form.productName.trim())
      formData.append('sku', form.sku.trim())

      // OPTIONAL FIELDS
      if (form.amount !== '') formData.append('currentPrice', form.amount)
      if (form.priceUnit) formData.append('priceUnit', form.priceUnit)
      if (form.status) formData.append('isActive', form.status === 'Active' ? 'true' : 'false')
      // Always send description in edit mode to allow clearing, only send if has content for create
      if (product) {
        formData.append('description', form.description?.trim() || '')
      } else if (form.description?.trim()) {
        formData.append('description', form.description.trim())
      }
      if (product && form.imageUrl) formData.append('imageUrl', form.imageUrl)
      if (form.imageFile) formData.append('file', form.imageFile)
      if (form.removeImage) formData.append('removeImage', 'true')

      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'put' : 'post'

      const res = await axios[method](url, formData)

      if (!res.data?.success) {
        toast.error(res.data?.error || 'Failed to save product')
        return
      }

      toast.success(product ? 'Product updated successfully' : 'Product created successfully')

      const listRes = await axios.get('/api/products')
      if (listRes.data?.success) onConfirm?.(listRes.data.products)

      onClose?.()
    } catch (err) {
      console.error('Save failed:', err)
      const errorMsg = err.response?.data?.error || 'Failed to save product'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-1">
          <div>
            <h2 className="text-base font-semibold text-[#1F384C]">{title}</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">{subtitle}</p>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="h-7 w-7 p-0 text-[#6b7280] hover:text-[#1F384C] hover:bg-[#f3f4f6]"
          >
            <X size={16} />
          </Button>
        </div>

        <Separator className="my-3 mx-4 sm:mx-6" />

        {/* Form Fields */}
        <ProductFormFields
          form={form}
          setForm={setForm}
          imageName={imageName}
          imagePreviewUrl={imagePreviewUrl}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          isEditMode={!!product}
          showAsteriskFields={['productName', 'sku']}
        />

        <Separator />

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-3">
          <Button variant="outline" onClick={onClose} disabled={loading} className="h-8 text-xs px-3">Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3"
          >
            {loading ? 'Saving...' : (product ? 'Update' : 'Confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
