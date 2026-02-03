'use client'

import { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const defaultValues = {
  title: '',
  status: 'Active',
  message: ''
}

export default function AnnouncementModal({
  open,
  mode = 'create', // "create" | "edit" (optional, ready if you need later)
  initialValues,
  onClose,
  onConfirm
}) {
  const mergedDefaults = useMemo(() => ({ ...defaultValues, ...(initialValues || {}) }), [initialValues])

  const [values, setValues] = useState(mergedDefaults)
  const [saving, setSaving] = useState(false)

  const firstInputRef = useRef(null)

  useEffect(() => {
    if (!open) return

    setValues(mergedDefaults)
    setSaving(false)

    setTimeout(() => firstInputRef.current?.focus?.(), 0)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, mergedDefaults, onClose])

  if (!open) return null

  const setField = (key, val) => setValues((p) => ({ ...p, [key]: val }))

  const titleText = mode === 'edit' ? 'Announcement Edit' : 'Announcement Create'
  const subtitleText = 'Create an announcement that will appear in the system.'

  const handleConfirm = () => {
    setSaving(true)

    const payload = {
      title: values.title.trim(),
      status: values.status,
      message: values.message.trim()
    }

    console.log('Announcement Modal Submit:', payload)
    onConfirm?.(payload)

    setTimeout(() => {
      setSaving(false)
      onClose?.()
    }, 250)
  }

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose?.()
        }}
        role='dialog'
        aria-modal='true'
      >
        <motion.div
          className='w-full flex justify-center'
          initial={{ opacity: 0, y: 14, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        >
          <div
            className='
              rounded-[28px] bg-white
              shadow-[0_24px_70px_-20px_rgba(0,0,0,0.45)]
              overflow-hidden
              origin-center
              w-[940px] h-[560px]
              max-w-[94vw] max-h-[92vh]
              scale-[0.92] sm:scale-100
            '
          >
            {/* HEADER */}
            <div className='relative px-8 pt-7'>
              <button
                type='button'
                onClick={onClose}
                className='absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200'
                aria-label='Close'
              >
                <span className='text-2xl leading-none'>×</span>
              </button>

              <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white'>
                {/* Same simple icon style */}
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#64748b'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7' />
                  <path d='M8 10V6a4 4 0 0 1 8 0v4' />
                </svg>
              </div>

              <h2 className='text-[30px] font-extrabold tracking-tight text-gray-900'>{titleText}</h2>
              <p className='mt-2 text-[18px] text-gray-400'>{subtitleText}</p>
            </div>

            {/* BODY */}
            <div className='px-8 pt-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Field label='Title*'>
                  <Input
                    ref={firstInputRef}
                    placeholder='Enter announcement title'
                    value={values.title}
                    onChange={(e) => setField('title', e.target.value)}
                  />
                </Field>

                <Field label='Status*'>
                  <select
                    className='h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 text-[18px] text-gray-900 outline-none focus:ring-4 focus:ring-blue-100'
                    value={values.status}
                    onChange={(e) => setField('status', e.target.value)}
                  >
                    <option value='Active'>Active</option>
                    <option value='Inactive'>Inactive</option>
                  </select>
                </Field>
              </div>

              <div className='mt-6'>
                <Field label='Message*'>
                  <textarea
                    className='h-[260px] w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[18px] text-gray-900 outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-blue-100'
                    placeholder='Write the announcement message...'
                    value={values.message}
                    onChange={(e) => setField('message', e.target.value)}
                  />
                </Field>
              </div>

              <p className='mt-4 text-[14px] text-gray-400'>
                Note: This is UI-only for now. Saving will only log values to the console.
              </p>
            </div>

            {/* FOOTER */}
            <div className='flex items-center justify-end gap-6 px-8 pb-7 pt-5'>
              <button
                type='button'
                onClick={onClose}
                disabled={saving}
                className='h-14 w-[320px] rounded-2xl border border-gray-200 bg-white text-[18px] font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-60'
              >
                Cancel
              </button>

              <motion.button
                type='button'
                onClick={handleConfirm}
                disabled={saving}
                whileTap={{ scale: 0.985 }}
                className='h-14 w-[420px] rounded-2xl bg-[#6D5EF6] text-[18px] font-semibold text-white hover:bg-[#5b4fe0] disabled:opacity-60'
              >
                {saving ? 'Saving...' : 'Confirm'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Field({ label, children }) {
  return (
    <div className='w-full'>
      <label className='mb-3 block text-[18px] font-bold text-gray-900'>{label}</label>
      {children}
    </div>
  )
}

const Input = forwardRef(function Input(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className='h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 text-[18px] text-gray-900 outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-blue-100'
    />
  )
})
