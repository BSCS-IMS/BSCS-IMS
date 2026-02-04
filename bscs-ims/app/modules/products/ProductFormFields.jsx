'use client'

import { Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProductFormFields({
  form = {},
  setForm,
  imageName,
  imagePreviewUrl,
  onImageChange,
  isEditMode = false
}) {
  return (
    <div className='px-4 sm:px-7 pb-6 space-y-5'>
      {/* Product Name + SKU */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>
            Product Name <span className='text-[#991b1b]'>*</span>
          </Label>
          <Input
            placeholder='Enter product name'
            value={form.productName || ''}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            className='border-[#e5e7eb]'
          />
        </div>

        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>
            SKU <span className='text-[#991b1b]'>*</span>
          </Label>
          <Input
            placeholder='e.g. RICE-5KG-001'
            value={form.sku || ''}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className='border-[#e5e7eb]'
          />
        </div>
      </div>

      {/* Amount + Price Unit */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>
            Amount <span className='text-[#991b1b]'>*</span>
          </Label>
          <Input
            placeholder='0'
            value={form.amount || ''}
            onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/[^\d.]/g, '') })}
            className='border-[#e5e7eb]'
          />
        </div>

        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>
            Price Unit <span className='text-[#991b1b]'>*</span>
          </Label>
          <Input
            placeholder='Kg'
            value={form.priceUnit || ''}
            onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
            className='border-[#e5e7eb]'
          />
        </div>
      </div>

      {/* Upload Image + Status */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>
            {isEditMode ? 'Update image (optional)' : 'Upload image'}{' '}
            {!isEditMode && <span className='text-[#991b1b]'>*</span>}
          </Label>

          <label className='cursor-pointer'>
            <input type='file' accept='image/*' className='hidden' onChange={onImageChange} />
            <span className='inline-flex items-center gap-2 w-full h-9 px-3 rounded-md border border-[#e5e7eb] bg-white text-sm text-[#374151] hover:bg-[#f3f4f6] transition cursor-pointer'>
              <Upload size={15} className='text-[#6b7280] shrink-0' />
              {imageName || (isEditMode ? 'Change image' : 'Browse')}
            </span>
          </label>

          <p className='text-xs text-[#9ca3af]'>PNG/JPG</p>
        </div>

        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>
            Status <span className='text-[#991b1b]'>*</span>
          </Label>

          <Select value={form.status || 'Active'} onValueChange={(value) => setForm({ ...form, status: value })}>
            <SelectTrigger className='w-full h-9 border-[#e5e7eb] cursor-pointer'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value='Active' className='cursor-pointer'>
                Active
              </SelectItem>
              <SelectItem value='Inactive' className='cursor-pointer'>
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className='space-y-1.5'>
        <Label className='text-sm font-medium text-[#374151]'>
          Description <span className='text-[#991b1b]'>*</span>
        </Label>

        <textarea
          className='min-h-28 w-full resize-none rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#c7d2fe]'
          placeholder='Write a short description...'
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {imagePreviewUrl && (
        <div className='flex items-center gap-3'>
          <div className='h-12 w-16 overflow-hidden rounded-md border border-[#e5e7eb] bg-[#f3f4f6]'>
            <img src={imagePreviewUrl} alt='preview' className='h-full w-full object-cover' />
          </div>
          <div className='text-xs text-[#6b7280]'>{imageName || 'Selected image'}</div>
        </div>
      )}
    </div>
  )
}
