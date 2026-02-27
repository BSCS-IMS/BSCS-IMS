'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

export default function AnnouncementFormModal({ announcement, onSuccess, onClose }) {
  const isEdit = Boolean(announcement)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || '')
      setContent(announcement.content || '')
      setIsPublished(announcement.isPublished || false)
    } else {
      setTitle('')
      setContent('')
      setIsPublished(false)
    }
  }, [announcement])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        await axios.put('/api/announcement', {
          id: announcement.id,
          title: title.trim(),
          content: content.trim(),
          isPublished
        })
        toast.success('Announcement updated successfully')
      } else {
        await axios.post('/api/announcement', {
          title: title.trim(),
          content: content.trim(),
          isPublished
        })
        toast.success('Announcement created successfully')
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save announcement:', error)
      toast.error(error.response?.data?.message || 'Failed to save announcement')
    } finally {
      setLoading(false)
    }
  }

  const modalTitle = isEdit ? 'Edit Announcement' : 'Create Announcement'
  const subtitle = isEdit
    ? 'Update the announcement details.'
    : 'Fill out the details for the new announcement.'

  const isValid = title.trim() && content.trim()

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>{modalTitle}</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>{subtitle}</p>
          </div>

          <Button
            variant='ghost'
            onClick={onClose}
            className='h-7 w-7 p-0 text-[#6b7280] hover:text-[#1F384C] hover:bg-[#f3f4f6]'
          >
            <X size={16} />
          </Button>
        </div>

        <Separator className='my-3 mx-4 sm:mx-6' />

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className='px-4 sm:px-6 pb-4 space-y-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='title' className='text-xs font-medium text-[#374151]'>
                Title <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Enter announcement content'
                rows={6}
                className='resize-none focus-visible:ring-[#1F384C]/30 focus-visible:ring-offset-0'
              />
            </div>

            <div className='flex items-center justify-between pt-2'>
              <div>
                <Label className='text-xs font-medium text-[#374151]'>Publish Status</Label>
                <p className='text-xs text-[#6b7280] mt-0.5'>
                  {isPublished ? 'This announcement is published' : 'This announcement is a draft'}
                </p>
              </div>
              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className='flex items-center justify-end gap-2 px-4 sm:px-6 py-3'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={loading}
              className='h-8 text-xs px-3'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={!isValid || loading}
              className='bg-[#1F384C] text-white hover:bg-[#162A3F] h-8 text-xs px-3'
            >
              {loading ? (
                <>
                  <Loader2 className='w-3 h-3 mr-1.5 animate-spin' />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Update' : 'Confirm'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
