import { useState } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function ResellerFormFields({
  form,
  setForm,
  products,
  imageName,
  imagePreviewUrl,
  onImageChange,
  onImageRemove,
  errors,
  isEditMode = false
}) {
  const [showProductDropdown, setShowProductDropdown] = useState(false)

  return (
    <div className='px-4 sm:px-6 pb-5 space-y-4'>
      {/* Reseller Name */}
      <div className='space-y-1'>
        <Label className='text-xs font-medium text-[#374151]'>
          Reseller Name <span className='text-[#991b1b]'>*</span>
        </Label>
        <Input
          placeholder='Enter reseller name'
          value={form.businessName || ''}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          className={`h-8 text-xs border ${errors?.businessName ? 'border-red-500' : 'border-[#e5e7eb]'}`}
        />
        {errors?.businessName && (
          <p className='text-[10px] text-red-600'>{errors.businessName}</p>
        )}
      </div>

      {/* Contact Number + Address */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='space-y-1'>
          <Label className='text-xs font-medium text-[#374151]'>
            Contact Number
          </Label>
          <Input
            placeholder='e.g. 09123456789'
            value={form.contactNumber || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              setForm({ ...form, contactNumber: value })
            }}
            className={`h-8 text-xs border ${errors?.contactNumber ? 'border-red-500' : 'border-[#e5e7eb]'}`}
          />
          {errors?.contactNumber && (
            <p className='text-[10px] text-red-600'>{errors.contactNumber}</p>
          )}
        </div>
        <div className='space-y-1'>
          <Label className='text-xs font-medium text-[#374151]'>Address</Label>
          <Input
            placeholder='Enter address'
            value={form.address || ''}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className='h-8 text-xs border-[#e5e7eb]'
          />
        </div>
      </div>

      {/* Upload Image + Status */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='space-y-1'>
          <Label className='text-xs font-medium text-[#374151]'>
            {isEditMode ? 'Update image (optional)' : 'Upload image'}
          </Label>
          <label className='cursor-pointer block'>
            <input type='file' accept='image/*' className='hidden' onChange={onImageChange} />
            <Button
              type='button'
              variant='outline'
              className='w-full h-8 justify-start gap-2 font-normal text-xs border-[#e5e7eb] hover:bg-[#f3f4f6]'
              asChild
            >
              <span>
                <Upload size={14} className='text-[#6b7280] shrink-0' />
                <span className='truncate flex-1 text-left'>
                  {imageName || (isEditMode ? 'Change image' : 'Browse')}
                </span>
              </span>
            </Button>
          </label>
          <p className='text-[10px] text-[#9ca3af]'>PNG/JPG</p>
        </div>

        <div className='space-y-1'>
          <Label className='text-xs font-medium text-[#374151]'>Status</Label>
          <Select value={form.status || 'active'} onValueChange={(value) => setForm({ ...form, status: value })}>
            <SelectTrigger className='w-full h-8 text-xs border-[#e5e7eb] cursor-pointer'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='active' className='cursor-pointer text-xs'>Active</SelectItem>
              <SelectItem value='inactive' className='cursor-pointer text-xs'>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assigned Products */}
      <div className='relative space-y-1'>
        <Label className='text-xs font-medium text-[#374151]'>Assigned Products</Label>
        <div
          onClick={() => setShowProductDropdown((prev) => !prev)}
          className='w-full border border-[#e5e7eb] rounded-md px-3 py-2 min-h-[36px] flex flex-wrap gap-1.5 items-center cursor-pointer bg-white hover:bg-[#f9fafb] transition'
        >
          {form.assignedProducts.length === 0 && <span className='text-xs text-[#6b7280]'>Select products</span>}

          {products
            .filter((p) => form.assignedProducts.includes(p.id))
            .map((p) => (
              <span
                key={p.id}
                className='flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#E8F1FA] text-[#1F384C] rounded-full'
              >
                {p.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setForm((prev) => ({
                      ...prev,
                      assignedProducts: prev.assignedProducts.filter((id) => id !== p.id)
                    }))
                  }}
                  className='w-3.5 h-3.5 flex items-center justify-center rounded-full text-[8px] bg-[#D6E8F7] text-[#1F384C] hover:bg-[#1F384C] hover:text-white active:scale-90 transition cursor-pointer'
                >
                  ✕
                </button>
              </span>
            ))}
        </div>

        {showProductDropdown && (
          <div className='absolute z-[10000] w-full mt-1 bg-white border border-[#e5e7eb] rounded-md shadow-md max-h-40 overflow-y-auto'>
            {products.length === 0 ? (
              <div className='px-3 py-3 text-center text-xs text-[#6b7280]'>No products available</div>
            ) : (
              products.map((p) => {
                const selected = form.assignedProducts.includes(p.id)
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        assignedProducts: selected
                          ? prev.assignedProducts.filter((id) => id !== p.id)
                          : [...prev.assignedProducts, p.id]
                      }))
                    }}
                    className={`px-3 py-2 text-xs cursor-pointer hover:bg-[#1F384C]/10 ${
                      selected ? 'font-medium text-[#1F384C]' : ''
                    }`}
                  >
                    {p.name}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <div className='space-y-1'>
        <Label className='text-xs font-medium text-[#374151]'>Description</Label>
        <textarea
          className='min-h-20 w-full resize-none rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-xs text-[#111827] outline-none focus:ring-1 focus:ring-[#1F384C]/20 focus:border-[#1F384C]'
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder='Write a short description...'
        />
      </div>

      {/* Image Preview */}
      {imagePreviewUrl && (
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <div className='h-10 w-14 overflow-hidden rounded-md border border-[#e5e7eb] bg-[#f3f4f6]'>
              <img src={imagePreviewUrl} alt='preview' className='h-full w-full object-cover' />
            </div>
            <div className='text-[10px] text-[#6b7280] truncate'>{imageName || 'Selected image'}</div>
          </div>
          {onImageRemove && (
            <button
              type='button'
              onClick={onImageRemove}
              className='w-7 h-7 border border-red-300 hover:border-red-500 hover:bg-red-50 text-red-500 rounded-md flex items-center justify-center transition-colors'
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
