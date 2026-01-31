import { Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ResellerFormFields({ form, setForm, products, imagePreview, onImageChange }) {
  return (
    <div className='px-7 pb-6 space-y-5'>
      {/* Reseller Name */}
      <div className='space-y-1.5'>
        <Label className='text-sm font-medium text-[#374151]'>
          Reseller Name <span className='text-[#991b1b]'>*</span>
        </Label>
        <Input
          placeholder='Enter reseller name'
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          className='border-[#e5e7eb]'
        />
      </div>

      {/* Contact + Address */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>Contact Number</Label>
          <Input
            placeholder='e.g. 09123456789'
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            className='border-[#e5e7eb]'
          />
        </div>
        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>Address</Label>
          <Input
            placeholder='Enter address'
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className='border-[#e5e7eb]'
          />
        </div>
      </div>

      {/* Upload Image + Status */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>Upload Image</Label>
          <label className='cursor-pointer'>
            <input type='file' accept='image/*' className='hidden' onChange={onImageChange} />
            <span className='inline-flex items-center gap-2 w-full h-9 px-3 rounded-md border border-[#e5e7eb] bg-white text-sm text-[#374151] hover:bg-[#f3f4f6] transition cursor-pointer'>
              <Upload size={15} className='text-[#6b7280] shrink-0' />
              {imagePreview ? 'Change Image' : 'Browse'}
            </span>
          </label>
        </div>

        <div className='space-y-1.5'>
          <Label className='text-sm font-medium text-[#374151]'>
            Status <span className='text-[#991b1b]'>*</span>
          </Label>
          <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
            <SelectTrigger className='w-full h-9 border-[#e5e7eb] cursor-pointer'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='active' className='cursor-pointer'>
                Active
              </SelectItem>
              <SelectItem value='inactive' className='cursor-pointer'>
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assigned Products */}
      <div className='space-y-1.5'>
        <Label className='text-sm font-medium text-[#374151]'>Assigned Product</Label>
        <Select value={form.assignedProduct} onValueChange={(value) => setForm({ ...form, assignedProduct: value })}>
          <SelectTrigger className='w-full border-[#e5e7eb] cursor-pointer'>
            <SelectValue placeholder='Select a product' />
          </SelectTrigger>
          <SelectContent>
            {products.length === 0 ? (
              <div className='px-3 py-4 text-center text-sm text-[#6b7280]'>No products available</div>
            ) : (
              products.map((p) => (
                <SelectItem key={p.id} value={p.id} className='cursor-pointer'>
                  {p.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className='space-y-1.5'>
        <Label className='text-sm font-medium text-[#374151]'>
          Description <span className='text-[#991b1b]'>*</span>
        </Label>
        <textarea
          rows={3}
          placeholder='Add a brief description...'
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className='w-full border border-[#e5e7eb] rounded-md px-3 py-2 text-sm text-[#374151] placeholder-[#9ca3af] resize-none outline-none'
        />
      </div>
    </div>
  )
}
