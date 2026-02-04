'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ResellerFormFields from './ResellerFormFields'

export default function ResellerFormModal({ onClose, reseller = null }) {
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        const productArray = Array.isArray(data.products) ? data.products : []
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
        const res = await fetch(`/api/resellers-product/${reseller.id}`)
        const data = await res.json()

        setForm((prev) => ({
          ...prev,
          assignedProducts: Array.isArray(data.products) ? data.products.map((p) => p.id) : []
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

  async function handleSubmit() {
    const method = reseller ? 'PATCH' : 'POST'
    const url = reseller ? `/api/resellers/${reseller.id}` : '/api/resellers'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: form.businessName,
        contactNumber: form.contactNumber,
        address: form.address,
        status: form.status,
        notes: form.description,
        userId: 'SYSTEM'
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert('Failed to save reseller')
      return
    }

    const resellerId = reseller ? reseller.id : data.id

    if (reseller) {
      await fetch(`/api/resellers-product/${resellerId}`, {
        method: 'DELETE'
      })
    }

    for (const productId of form.assignedProducts) {
      await fetch('/api/resellers-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resellerId,
          productId,
          isActive: true,
          userId: 'SYSTEM'
        })
      })
    }

    onClose()
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white w-170 max-h-[90vh] overflow-y-auto rounded-xl shadow-xl relative'>
        <div className='flex items-center justify-between px-7 pt-6 pb-1'>
          <div>
            <h2 className='text-lg font-semibold text-[#1F384C]'>{reseller ? 'Edit Reseller' : 'Create Reseller'}</h2>
            <p className='text-sm text-[#6b7280] mt-0.5'>
              {reseller ? 'Update the reseller details.' : 'Fill out the details for the new reseller.'}
            </p>
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

        <ResellerFormFields
          form={form}
          setForm={setForm}
          products={products}
          imagePreview={imagePreview}
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
          <Button onClick={handleSubmit} className='bg-[#1e40af] text-white hover:bg-[#1e3a8a] px-5 cursor-pointer'>
            {reseller ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  )
}
