import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ResellerFormFields({ form, setForm, products, imagePreview, onImageChange }) {
  const [showProductDropdown, setShowProductDropdown] = useState(false)

  return (
    <div className='px-7 pb-6 space-y-5'>
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

      <div className='relative space-y-1.5'>
        <Label className='text-sm font-medium text-[#374151]'>Assigned Products</Label>
        <div
          onClick={() => setShowProductDropdown((prev) => !prev)}
          className='w-full border border-[#e5e7eb] rounded-md px-3 py-2 min-h-[42px] flex flex-wrap gap-2 items-center cursor-pointer bg-white hover:bg-[#f9fafb] transition'
        >
          {form.assignedProducts.length === 0 && <span className='text-sm text-[#6b7280]'>Select products</span>}

          {products
            .filter((p) => form.assignedProducts.includes(p.id))
            .map((p) => (
              <span
                key={p.id}
                className='flex items-center gap-1 text-xs px-2 py-1 bg-[#E8F1FA] text-[#1F384C] rounded-full'
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
                  className='w-4 h-4 flex items-center justify-center rounded-full text-[10px] bg-[#D6E8F7] text-[#1F384C] hover:bg-[#1F384C] hover:text-white active:scale-90 transition cursor-pointer'
                >
                  ✕
                </button>
              </span>
            ))}
        </div>

        {showProductDropdown && (
          <div className='absolute z-10 w-full mt-1 bg-white border border-[#e5e7eb] rounded-md shadow-md max-h-40 overflow-y-auto'>
            {products.length === 0 ? (
              <div className='px-3 py-4 text-center text-sm text-[#6b7280]'>No products available</div>
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
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#1F384C]/10 ${
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

      <div className='space-y-1.5'>
        <Label className='text-sm font-medium text-[#374151]'>
          Description <span className='text-[#991b1b]'>*</span>
        </Label>
        <textarea
          rows='3'
          className='w-full border border-[#e5e7eb] rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1e40af]'
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder='Enter description'
        />
      </div>
    </div>
  )
}
