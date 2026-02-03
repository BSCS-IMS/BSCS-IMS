'use client'

export default function ProductFormFields({ form, setForm, imageName, imagePreviewUrl, onImageChange }) {
  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className='px-7 pb-6'>
      {/* Product Name + SKU */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Field label='Product Name*'>
          <Input
            placeholder='Enter product name'
            value={form.productName}
            onChange={(e) => setField('productName', e.target.value)}
          />
        </Field>

        <Field label='SKU*'>
          <Input
            placeholder='e.g. RICE-5KG-001'
            value={form.sku}
            onChange={(e) => setField('sku', e.target.value)}
          />
        </Field>
      </div>

      {/* Amount + Price Unit */}
      <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Field label='Amount*'>
          <Input
            placeholder='0'
            value={form.amount}
            onChange={(e) => setField('amount', e.target.value.replace(/[^\d.]/g, ''))}
          />
        </Field>

        <Field label='Price Unit*'>
          <Input
            placeholder='Kg'
            value={form.priceUnit}
            onChange={(e) => setField('priceUnit', e.target.value)}
          />
        </Field>
      </div>

      {/* Upload image + Status */}
      <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Field label='Upload image*'>
          <div className='flex items-center gap-3'>
            <label className='flex h-10 w-full cursor-pointer items-center rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] hover:bg-[#f9fafb]'>
              <span className='truncate'>
                {imageName || (imagePreviewUrl ? 'Current image' : 'Choose an image')}
              </span>
              <input type='file' accept='image/*' className='hidden' onChange={onImageChange} />
            </label>

            <div className='flex h-10 w-14 items-center justify-center overflow-hidden rounded-md border border-[#e5e7eb] bg-[#f3f4f6] text-[10px] font-semibold text-[#6b7280]'>
              {imagePreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreviewUrl} alt='preview' className='h-full w-full object-cover' />
              ) : (
                'IMG'
              )}
            </div>
          </div>
          <p className='mt-1 text-xs text-[#9ca3af]'>PNG/JPG</p>
        </Field>

        <Field label='Status*'>
          <select
            className='h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#c7d2fe]'
            value={form.status}
            onChange={(e) => setField('status', e.target.value)}
          >
            <option value='Active'>Active</option>
            <option value='Inactive'>Inactive</option>
          </select>
        </Field>
      </div>

      {/* Description */}
      <div className='mt-4'>
        <Field label='Description*'>
          <textarea
            className='min-h-28 w-full resize-none rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#c7d2fe]'
            placeholder='Write a short description...'
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
          />
        </Field>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className='w-full'>
      <label className='mb-1 block text-sm font-medium text-[#374151]'>{label}</label>
      {children}
    </div>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className='h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#c7d2fe]'
    />
  )
}
