'use client'

import { useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

const defaultValues = {
  title: '',
  content: '',
  isPublished: false
}

export default function AnnouncementFormModal({ announcement = null, onSuccess, onClose }) {
  const initialFormState = useMemo(() => {
    if (announcement) {
      return {
        title: announcement.title ?? '',
        content: announcement.content ?? '',
        isPublished: announcement.isPublished ?? false
      }
    }
    return defaultValues
  }, [announcement])

  const [form, setForm] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const title = announcement ? 'Edit Announcement' : 'Create Announcement'
  const subtitle = announcement
    ? 'Update the announcement details.'
    : 'Fill out the details for the new announcement.'

  const isValid = useMemo(() => {
    if (!form.title.trim()) return false
    if (!form.content.trim()) return false
    return true
  }, [form.title, form.content])

  async function handleSubmit() {
    if (loading) return
    setLoading(true)

    try {
      if (announcement) {
        await axios.put('/api/announcement', {
          id: announcement.id,
          title: form.title.trim(),
          content: form.content.trim(),
          isPublished: form.isPublished
        })
        toast.success('Announcement updated successfully')
      } else {
        await axios.post('/api/announcement', {
          title: form.title.trim(),
          content: form.content.trim(),
          isPublished: form.isPublished
        })
        toast.success('Announcement created successfully')
      }

      onSuccess?.()
      onClose?.()
    } catch (err) {
      console.error('Save failed:', err)
      const errorMsg = err.response?.data?.message || 'Failed to save announcement'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-9999 p-4'>
      <div className='bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>{title}</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>{subtitle}</p>
          </div>

          <Button
            variant='ghost'
            onClick={onClose}
            className='h-7 w-7 p-0 text-[#6b7280] hover:text-[#1F384C] hover:bg-[#f3f4f6] cursor-pointer'
          >
            <X size={16} />
          </Button>
        </div>

        <Separator className='my-3 mx-4 sm:mx-6' />

        {/* Form Fields */}
        <div className='px-4 sm:px-6 pb-4 space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='title' className='text-xs font-medium text-[#374151]'>
              Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder='Enter announcement title'
              className='focus-visible:ring-[#1F384C]/30 focus-visible:ring-offset-0'
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='content' className='text-xs font-medium text-[#374151]'>
              Content <span className='text-red-500'>*</span>
            </Label>
            <Textarea
              id='content'
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder='Enter announcement content'
              rows={6}
              className='resize-none focus-visible:ring-[#1F384C]/30 focus-visible:ring-offset-0'
            />
          </div>

          <div className='flex items-center justify-between pt-2'>
            <div>
              <Label className='text-xs font-medium text-[#374151]'>Publish Status</Label>
              <p className='text-xs text-[#6b7280] mt-0.5'>
                {form.isPublished ? 'This announcement is published' : 'This announcement is a draft'}
              </p>
            </div>
            <Switch
              checked={form.isPublished}
              onCheckedChange={(checked) => setForm((p) => ({ ...p, isPublished: checked }))}
            />
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className='flex items-center justify-end gap-2 px-4 sm:px-6 py-3'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={loading}
            className='h-8 text-xs px-3 cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className='bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3 cursor-pointer'
          >
            {loading ? 'Saving...' : (announcement ? 'Update' : 'Confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
