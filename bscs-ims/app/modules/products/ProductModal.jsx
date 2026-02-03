'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const defaultValues = {
  sku: '',
  productName: '',
  amount: '',
  priceUnit: 'Kg',
  status: 'Active',
  imageFile: null,
  imageUrl: ''
}

export default function ProductModal({ open, mode = 'create', initialValues, onClose, onConfirm }) {
  const [values, setValues] = useState(defaultValues)
  const [imageName, setImageName] = useState('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  // ✅ Update values when initialValues change (for edit mode)
  useEffect(() => {
    if (open && mode === 'edit' && initialValues) {
      console.log('initialValues:', initialValues) // Debug log
      
      setValues({
        sku: initialValues.sku || '',
        productName: initialValues.name || '',
        amount: initialValues.currentPrice?.toString() || '',
        priceUnit: initialValues.priceUnit || 'Kg',
        status: initialValues.isActive ? 'Active' : 'Inactive',
        imageFile: null,
        imageUrl: initialValues.imageUrl || ''
      })
      
      // Set existing image preview
      if (initialValues.imageUrl) {
        setImagePreviewUrl(initialValues.imageUrl)
        setImageName('Current image')
      }
    } else if (open && mode === 'create') {
      // Reset for create mode
      setValues(defaultValues)
      setImagePreviewUrl('')
      setImageName('')
    }
  }, [open, mode, initialValues])

  if (!open) return null

  const setField = (key, val) => {
    setValues((p) => ({ ...p, [key]: val }))
  }

  const handleConfirm = async () => {
    try {
      const formData = new FormData()
      
      formData.append('name', values.productName.trim())
      formData.append('sku', values.sku.trim())
      formData.append('currentPrice', values.amount)
      formData.append('priceUnit', values.priceUnit)
      formData.append('isActive', values.status === 'Active' ? 'true' : 'false')

      // For edit mode, include existing imageUrl if no new file
      if (mode === 'edit') {
        formData.append('imageUrl', values.imageUrl)
      }
      
      // Add new image file if selected
      if (values.imageFile) {
        formData.append('file', values.imageFile)
      } else if (mode === 'create') {
        alert('Please upload an image')
        return
      }

      const url = mode === 'edit' ? `/api/products/${initialValues.id}` : '/api/products'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: formData,
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.error)
        return
      }

      // ✅ Fetch updated products list
      const listRes = await fetch("/api/products")
      const listData = await listRes.json()
      
      if (listData.success) {
        onConfirm?.(listData.products)
      }
      
      onClose?.()
    } catch (err) {
      console.error("Save failed:", err)
      alert("Failed to save product")
    }
  }

  const title = mode === 'create' ? 'Add Product' : 'Edit Product'
  const isEditMode = mode === 'edit'

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose?.()
        }}
        role='dialog'
        aria-modal='true'
      >
        {/* Modal */}
        <motion.div
          className='w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/5'
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.985 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className='relative border-b border-slate-100 bg-linear-to-b from-slate-50 to-white px-6 pb-5 pt-6 shrink-0'>
            <button
              type='button'
              onClick={onClose}
              className='absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-white hover:text-slate-900'
              aria-label='Close'
            >
              <span className='text-xl leading-none'>×</span>
            </button>

            <div className='flex items-start gap-4'>
              <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 text-indigo-600'>
                {/* grid icon */}
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <rect x='3' y='3' width='7' height='7' />
                  <rect x='14' y='3' width='7' height='7' />
                  <rect x='3' y='14' width='7' height='7' />
                  <rect x='14' y='14' width='7' height='7' />
                </svg>
              </div>

              <div className='min-w-0'>
                <h2 className='text-2xl font-semibold tracking-tight text-slate-900'>{title}</h2>
                <p className='mt-1 text-sm text-slate-500'>
                  {isEditMode ? 'Update the product details below' : 'Fill in the product details below'}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className='flex-1 overflow-y-auto px-6 py-6'>
            {/* Product Name + SKU */}
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <Field label='Product Name*'>
                <Input
                  placeholder='Enter product name'
                  value={values.productName}
                  onChange={(e) => setField('productName', e.target.value)}
                  disabled={isEditMode}
                  className={isEditMode ? 'bg-slate-50 cursor-not-allowed opacity-60' : ''}
                />
              </Field>

              <Field label='SKU*'>
                <Input
                  placeholder='e.g. RICE-5KG-001'
                  value={values.sku}
                  onChange={(e) => setField('sku', e.target.value)}
                  disabled={isEditMode}
                  className={isEditMode ? 'bg-slate-50 cursor-not-allowed opacity-60' : ''}
                />
              </Field>
            </div>

            {/* Amount + Price Unit */}
            <div className='mt-5 grid grid-cols-1 gap-5 md:grid-cols-2'>
              <Field label='Amount*'>
                <PrefixInput
                  prefix='₱'
                  placeholder='0'
                  value={values.amount}
                  onChange={(e) => setField('amount', e.target.value.replace(/[^\d.]/g, ''))}
                />
              </Field>

              <Field label='Price Unit*'>
                <Input
                  placeholder='Kg'
                  value={values.priceUnit}
                  onChange={(e) => setField('priceUnit', e.target.value)}
                />
              </Field>
            </div>

            {/* Upload image + Status */}
            <div className='mt-5 grid grid-cols-1 gap-5 md:grid-cols-2'>
              <Field label={isEditMode ? 'Update image (optional)' : 'Upload image*'}>
                <div className='flex items-center gap-3'>
                  <label className='group flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:bg-slate-50 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100'>
                    <span className='inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition group-hover:bg-indigo-700'>
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M12 19V5' />
                        <path d='M7 10l5-5 5 5' />
                      </svg>
                    </span>

                    <span className='min-w-0 flex-1 truncate text-slate-600'>
                      {imageName || (isEditMode ? 'Change image' : 'Choose an image')}
                    </span>

                    <span className='hidden text-xs text-slate-400 md:inline'>PNG/JPG</span>

                    <input
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null
                        setField('imageFile', f)
                        setImageName(f?.name || '')

                        if (imagePreviewUrl && !values.imageUrl) {
                          URL.revokeObjectURL(imagePreviewUrl)
                        }
                        if (f) setImagePreviewUrl(URL.createObjectURL(f))
                        else if (values.imageUrl) {
                          setImagePreviewUrl(values.imageUrl)
                          setImageName('Current image')
                        } else {
                          setImagePreviewUrl('')
                        }
                      }}
                    />
                  </label>

                  <div className='flex h-12 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-400'>
                    {imagePreviewUrl ? (
                      <img src={imagePreviewUrl} alt='preview' className='h-full w-full object-cover' />
                    ) : (
                      'IMG'
                    )}
                  </div>
                </div>
              </Field>

              <Field label='Status*'>
                <select
                  className='h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.02)] outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100'
                  value={values.status}
                  onChange={(e) => setField('status', e.target.value)}
                >
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Footer */}
          <div className='shrink-0 flex items-center justify-end gap-4 border-t border-slate-100 bg-white px-6 py-5'>
            <button
              type='button'
              onClick={onClose}
              className='h-12 min-w-40 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:bg-slate-50'
            >
              Cancel
            </button>

            <button
              type='button'
              onClick={handleConfirm}
              className='h-12 min-w-40 rounded-2xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-[0_10px_22px_-12px_rgba(79,70,229,0.65)] transition hover:bg-indigo-700 active:translate-y-px'
            >
              {isEditMode ? 'Update' : 'Confirm'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Field({ label, children }) {
  return (
    <div className='w-full'>
      <label className='mb-2 block text-sm font-semibold text-slate-900'>{label}</label>
      {children}
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-[0_1px_0_rgba(0,0,0,0.02)] outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${className}`}
    />
  )
}

function PrefixInput({ prefix, ...props }) {
  return (
    <div className='flex h-12 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)] transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100'>
      <div className='flex items-center justify-center border-r border-slate-200 px-4 text-sm text-slate-600'>
        {prefix}
      </div>
      <input {...props} className='h-full w-full px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400' />
    </div>
  )
}