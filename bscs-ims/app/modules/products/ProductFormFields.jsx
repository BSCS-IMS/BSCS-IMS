import { Upload, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProductFormFields({
  form = {},
  setForm,
  imageName,
  imagePreviewUrl,
  onImageChange,
  onImageRemove,
  isEditMode = false
}) {
  return (
    <div className='px-4 sm:px-6 pb-5 space-y-4'>
      {/* Product Name + SKU */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='space-y-1'>
          <Label className='text-xs font-medium text-[#374151]'>
            Product Name <span className='text-[#991b1b]'>*</span>
          </Label>
          <Input
            placeholder='Enter product name'
            value={form.productName || ''}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            className='border-[#e5e7eb] h-8 text-xs'
          />
        </div>

        <div className='space-y-1'>
          <Label className='text-xs font-medium text-[#374151]'>
            SKU {!isEditMode && <span className='text-[#991b1b]'>*</span>}
          </Label>
          <Input
            placeholder='e.g. RICE-5KG-001'
            value={form.sku || ''}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            disabled={isEditMode}
            className={`border-[#e5e7eb] h-8 text-xs ${isEditMode ? 'bg-[#f3f4f6] cursor-not-allowed opacity-70' : ''}`}
          />
          {isEditMode && (
            <p className='text-[10px] text-[#9ca3af]'>SKU cannot be changed</p>
          )}
        </div>
      </div>

      {/* Amount + Price Unit (no asterisk) */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div className='space-y-1'>
          <Label className='text-xs font-medium text-[#374151]'>
            Amount
          </Label>
          <Input
            placeholder='0'
            value={form.amount || ''}
            onChange={(e) => {
              let value = e.target.value.replace(/[^\d.]/g, '')
              // Only allow one decimal point
              const parts = value.split('.')
              if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('')
              }
              setForm({ ...form, amount: value })
            }}
            className='border-[#e5e7eb] h-8 text-xs'
          />
        </div>

        <div className='space-y-1'>
          <Label className='text-xs font-medium text-[#374151]'>
            Price Unit
          </Label>
          <Input
            placeholder='Kg'
            value={form.priceUnit || ''}
            onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
            className='border-[#e5e7eb] h-8 text-xs'
          />
        </div>
      </div>

      {/* Upload Image + Status (no asterisk) */}
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
          <Label className='text-xs font-medium text-[#374151]'>
            Status
          </Label>

          <Select value={form.status || 'Active'} onValueChange={(value) => setForm({ ...form, status: value })}>
            <SelectTrigger className='w-full h-8 text-xs border-[#e5e7eb] cursor-pointer'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value='Active' className='cursor-pointer text-xs'>Active</SelectItem>
              <SelectItem value='Inactive' className='cursor-pointer text-xs'>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description (no asterisk) */}
      <div className='space-y-1'>
        <Label className='text-xs font-medium text-[#374151]'>Description</Label>
        <textarea
          className='min-h-24 w-full resize-none rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-xs text-[#111827] outline-none focus:ring-1 focus:ring-[#1F384C]/20 focus:border-[#1F384C]'
          placeholder='Write a short description...'
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {imagePreviewUrl && (
        <div className='space-y-1.5'>
          <Label className='text-xs font-medium text-[#374151]'>Image Preview</Label>
          <div
            className='relative w-full h-40 overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f3f4f6] group cursor-pointer'
            onClick={onImageRemove}
          >
            <img
              src={imagePreviewUrl}
              alt='preview'
              className='h-full w-full object-cover transition-all duration-200 group-hover:blur-sm group-hover:brightness-75'
            />
            {onImageRemove && (
              <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <div className='w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md'>
                  <Trash2 size={24} className='text-[#1F384C]' />
                </div>
              </div>
            )}
          </div>
          <div className='text-[10px] text-[#6b7280] truncate'>{imageName || 'Selected image'}</div>
        </div>
      )}
    </div>
  )
}
