'use client'

import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-toastify'
import ResellerFormFields from './ResellerFormFields'

const defaultValues = {
  businessName: '',
  contactNumber: '',
  address: '',
  status: 'active',
  description: '',
  assignedProducts: [],
  imageFile: null,
  imageUrl: ''
}

export default function ResellerFormModal({ onClose, onSuccess, reseller = null }) {
  const initialFormState = useMemo(() => {
    if (reseller) {
      return {
        businessName: reseller.businessName ?? '',
        contactNumber: reseller.contactNumber ?? '',
        address: reseller.address ?? '',
        status: reseller.status ?? 'active',
        description: reseller.notes ?? '',
        assignedProducts: [],
        imageFile: null,
        imageUrl: reseller.imageUrl || ''
      }
    }
    return defaultValues
  }, [reseller])

  const [form, setForm] = useState(initialFormState)
  const [products, setProducts] = useState([])
  const [imageName, setImageName] = useState(reseller?.imageUrl ? 'Current image' : '')
  const [imagePreviewUrl, setImagePreviewUrl] = useState(reseller?.imageUrl || '')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Cleanup blob URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

  const title = reseller ? 'Edit Reseller' : 'Create Reseller'
  const subtitle = reseller
    ? 'Update the reseller details.'
    : 'Fill out the details for the new reseller.'

  // Form validation - only businessName is required
  const isValid = useMemo(() => {
    if (!form.businessName.trim()) return false
    // Contact number validation (optional, but must be numbers if provided)
    if (form.contactNumber.trim() && !/^\d+$/.test(form.contactNumber)) return false
    return true
  }, [form.businessName, form.contactNumber])

  // Fetch products for assignment dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products')
        const productArray = Array.isArray(res.data.products) ? res.data.products : []
        setProducts(productArray)
      } catch (err) {
        console.error(err)
        setProducts([])
      }
    }
    fetchProducts()
  }, [])

  // Fetch assigned products when editing
  useEffect(() => {
    if (!reseller) return

    const fetchAssignedProducts = async () => {
      try {
        const res = await axios.get(`/api/resellers-product/${reseller.id}`)
        setForm((prev) => ({
          ...prev,
          assignedProducts: Array.isArray(res.data.products) ? res.data.products.map((p) => p.id) : []
        }))
      } catch (err) {
        console.error(err)
      }
    }

    fetchAssignedProducts()
  }, [reseller])

  const handleImageChange = (e) => {
    const f = e.target.files?.[0] || null

    setForm((p) => ({ ...p, imageFile: f }))
    setImageName(f?.name || '')

    // Revoke previous blob URL to prevent memory leak
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

  const validateForm = () => {
    const newErrors = {}

    if (!form.businessName.trim()) {
      newErrors.businessName = 'Reseller name is required'
    }

    // Contact number is optional, but if provided must be numbers only
    if (form.contactNumber.trim() && !/^\d+$/.test(form.contactNumber)) {
      newErrors.contactNumber = 'Contact number must contain numbers only'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the highlighted errors')
      return false
    }

    return true
  }

  async function handleSubmit() {
    if (!validateForm()) return
    if (loading) return
    setLoading(true)

    try {
      const formData = new FormData()

      // Required field
      formData.append('businessName', form.businessName.trim())

      // Optional fields
      formData.append('contactNumber', form.contactNumber.trim())
      formData.append('address', form.address.trim())
      formData.append('status', form.status)
      formData.append('notes', form.description.trim())
      formData.append('userId', 'SYSTEM')

      // Image file
      if (form.imageFile) {
        formData.append('file', form.imageFile)
      }
      if (form.removeImage) {
        formData.append('removeImage', 'true')
      }

      const method = reseller ? 'put' : 'post'
      const url = reseller ? `/api/resellers/${reseller.id}` : '/api/resellers'

      const res = await axios[method](url, formData)

      if (!res.data?.success && !res.data?.id) {
        toast.error(res.data?.error || 'Failed to save reseller')
        return
      }

      const resellerId = reseller ? reseller.id : res.data.id

      // Clear existing product assignments when editing
      if (reseller) {
        await axios.delete(`/api/resellers-product/${resellerId}`)
      }

      // Add new product assignments
      for (const productId of form.assignedProducts) {
        await axios.post('/api/resellers-product', {
          resellerId,
          productId,
          isActive: true,
          userId: 'SYSTEM'
        })
      }

      toast.success(reseller ? 'Reseller updated successfully' : 'Reseller created successfully')
      onSuccess?.(reseller ? 'edit' : 'create')
      onClose?.()

    } catch (err) {
      console.error('Save failed:', err)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to save reseller'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>{title}</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>{subtitle}</p>
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

        {/* Form Fields */}
        <ResellerFormFields
          form={form}
          setForm={setForm}
          products={products}
          imageName={imageName}
          imagePreviewUrl={imagePreviewUrl}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          errors={errors}
          isEditMode={!!reseller}
        />

        <Separator />

        {/* Footer */}
        <div className='flex items-center justify-end gap-2 px-4 sm:px-6 py-3'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={loading}
            className='h-8 text-xs px-3'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className='bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3'
          >
            {loading ? 'Saving...' : (reseller ? 'Update' : 'Confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
