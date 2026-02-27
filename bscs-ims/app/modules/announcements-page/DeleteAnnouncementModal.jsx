'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { X, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function DeleteAnnouncementModal({ announcement, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await axios.delete(`/api/announcement?id=${announcement.id}`)
      toast.success('Announcement deleted successfully')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to delete announcement:', error)
      toast.error(error.response?.data?.message || 'Failed to delete announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white w-full max-w-sm overflow-hidden rounded-xl shadow-xl relative'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 pt-5 pb-1'>
          <div>
            <h2 className='text-base font-semibold text-[#1F384C]'>Delete Announcement</h2>
            <p className='text-xs text-[#6b7280] mt-0.5'>This action cannot be undone.</p>
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

        {/* Content */}
        <div className='px-4 sm:px-6 pb-4'>
          <div className='flex items-start gap-3'>
            <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0'>
              <AlertTriangle className='w-5 h-5 text-red-600' />
            </div>
            <div>
              <p className='text-sm text-[#374151]'>
                Are you sure you want to delete this announcement?
              </p>
              <p className='text-sm font-medium text-[#1F384C] mt-2'>
                &ldquo;{announcement.title}&rdquo;
              </p>
            </div>
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
            type='button'
            onClick={handleDelete}
            disabled={loading}
            className='bg-red-600 hover:bg-red-700 text-white h-8 text-xs px-3'
          >
            {loading ? (
              <>
                <Loader2 className='w-3 h-3 mr-1.5 animate-spin' />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
