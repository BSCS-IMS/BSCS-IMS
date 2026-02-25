'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'react-toastify'
import ResellerFormFields from './ResellerFormFields'

export default function ResellerFormModal({
  onClose,
  onSuccess,
  reseller = null
}) {

  const [form, setForm] = useState({
    businessName: reseller?.businessName || '',
    contactNumber: reseller?.contactNumber || '',
    address: reseller?.address || '',
    status: reseller?.status || 'active',
    description: reseller?.notes || '',
    assignedProducts: [],
    image: null
  })
  const [products, setProducts] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])


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
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
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
      const method = reseller ? 'put' : 'post'
      const url = reseller ? `/api/resellers/${reseller.id}` : '/api/resellers'

      const res = await axios[method](url, {
        businessName: form.businessName,
        contactNumber: form.contactNumber,
        address: form.address,
        status: form.status,
        notes: form.description,
        userId: 'SYSTEM'
      })

      const resellerId = reseller ? reseller.id : res.data.id

      if (reseller) {
        await axios.delete(`/api/resellers-product/${resellerId}`)
      }

      for (const productId of form.assignedProducts) {
        await axios.post('/api/resellers-product', {
          resellerId,
          productId,
          isActive: true,
          userId: 'SYSTEM'
        })
      }

      toast.success(reseller ? 'Reseller updated successfully' : 'Reseller created successfully')
      onSuccess(reseller ? 'edit' : 'create')

    } catch (err) {
      console.error(err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save reseller'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl relative'>
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>{reseller ? 'Edit Reseller' : 'Create Reseller'}</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>
              {reseller ? 'Update the reseller details.' : 'Fill out the details for the new reseller.'}
            </p>
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

        <ResellerFormFields
          form={form}
          setForm={setForm}
          products={products}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          errors={errors}
        />

        <Separator />
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
            disabled={loading}
            className='bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3'
          >
            {loading ? 'Saving...' : (reseller ? 'Update' : 'Confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
