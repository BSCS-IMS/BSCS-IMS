import { useState } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  ArrowUpAZ,
  ArrowDownAZ,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function SkeletonCard() {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden p-4'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2 flex-1'>
          <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
          <div className='h-3 w-24 bg-gray-200 rounded animate-pulse' />
        </div>
        <div className='h-5 w-5 bg-gray-200 rounded animate-pulse' />
      </div>
    </div>
  )
}

function formatDate(timestamp) {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function truncateText(text, maxLength = 80) {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default function AnnouncementsMobileView({ announcements, onEdit, onDelete, onCreate, loading = false }) {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const filteredAnnouncements = announcements
    .filter((a) => a.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortOrder) return 0
      if (sortOrder === 'asc') return a.title.localeCompare(b.title)
      if (sortOrder === 'desc') return b.title.localeCompare(a.title)
      return 0
    })

  return (
    <div className='min-h-screen py-6 px-3 sm:px-6'>
      <div className='w-full max-w-6xl mx-auto space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold text-[#1F384C]'>Announcements</h1>
        </div>

        <Button
          onClick={onCreate}
          className='fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#1F384C] text-white shadow-lg flex items-center justify-center hover:bg-[#162A3F] active:scale-95 p-0 cursor-pointer'
        >
          <Plus size={24} />
        </Button>

        <div className='w-full relative'>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search announcements...'
            className='w-full pr-10 focus-visible:ring-[#1e40af]/30 focus-visible:ring-offset-0'
          />
          <Button
            variant='ghost'
            className='absolute right-1 top-1/2 -translate-y-1/2 p-1.5 h-auto w-auto text-white bg-[#1F384C] rounded hover:bg-[#162A3F] cursor-pointer'
          >
            <Search size={14} />
          </Button>
        </div>

        <div className='flex gap-2 w-full'>
          <Button
            variant='outline'
            onClick={() => {
              setIsFilterOpen((prev) => !prev)
              setIsSortOpen(false)
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer ${
              isFilterOpen ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : ''
            }`}
          >
            <Filter size={16} />
            Filter
          </Button>
          <Button
            variant='outline'
            onClick={() => {
              setIsSortOpen((prev) => !prev)
              setIsFilterOpen(false)
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer ${
              isSortOpen ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : ''
            }`}
          >
            <ArrowUpDown size={16} />
            Sort
          </Button>
        </div>

        {isFilterOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb]'>
            <p className='text-xs text-[#6b7280] mb-2'>Filter by status</p>
            <div className='flex gap-2'>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer'>
                All
              </Button>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer'>
                Published
              </Button>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer'>
                Draft
              </Button>
            </div>
          </div>
        )}

        {isSortOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb]'>
            <p className='text-xs text-[#6b7280] mb-2 font-medium'>Sort announcements</p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setSortOrder('asc')}
                className={`flex-1 flex items-center justify-center gap-1 border-[#e5e7eb] text-[#4A5568] cursor-pointer ${
                  sortOrder === 'asc' ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : 'hover:bg-[#f3f4f6]'
                }`}
              >
                <ArrowUpAZ size={16} />
                A to Z
              </Button>
              <Button
                variant='outline'
                onClick={() => setSortOrder('desc')}
                className={`flex-1 flex items-center justify-center gap-1 border-[#e5e7eb] text-[#4A5568] cursor-pointer ${
                  sortOrder === 'desc' ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : 'hover:bg-[#f3f4f6]'
                }`}
              >
                <ArrowDownAZ size={16} />
                Z to A
              </Button>
              {sortOrder && (
                <Button
                  variant='outline'
                  onClick={() => setSortOrder(null)}
                  className='flex items-center justify-center gap-1 border-[#e5e7eb] text-[#6b7280] hover:bg-[#f3f4f6] cursor-pointer px-3'
                >
                  <X size={16} />
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}

        <div className='space-y-3 pb-20'>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredAnnouncements.length === 0 ? (
            <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm border border-[#e5e7eb]'>
              No announcements found
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => {
              const isOpen = expandedId === announcement.id
              return (
                <div key={announcement.id} className='bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden'>
                  <Button
                    variant='ghost'
                    onClick={() => toggleExpand(announcement.id)}
                    className='w-full flex items-center justify-between px-4 py-3 text-left h-auto rounded-none hover:bg-transparent cursor-pointer'
                  >
                    <div className='text-left flex-1 pr-2'>
                      <span className='font-semibold text-[#1F384C]'>{announcement.title}</span>
                      <p className='text-xs text-[#6b7280] mt-0.5'>
                        {formatDate(announcement.createdAt)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          announcement.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {announcement.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={18} className='text-[#6b7280] shrink-0' />
                      ) : (
                        <ChevronDown size={18} className='text-[#6b7280] shrink-0' />
                      )}
                    </div>
                  </Button>

                  {isOpen && (
                    <div className='px-4 pb-4 space-y-3 text-sm border-t border-[#e5e7eb]'>
                      <div className='pt-3'>
                        <span className='text-[#6b7280] text-xs'>Content</span>
                        <p className='font-medium text-[#374151] mt-1 whitespace-pre-wrap'>
                          {announcement.content}
                        </p>
                      </div>

                      <div className='flex gap-2 pt-1'>
                        <Button
                          variant='outline'
                          onClick={() => onEdit(announcement)}
                          className='flex-1 border-[#e5e7eb] text-[#1F384C] hover:bg-[#f3f4f6] cursor-pointer'
                        >
                          <Edit2 size={15} className='mr-1.5' />
                          Edit
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => onDelete(announcement)}
                          className='flex-1 border-[#e5e7eb] text-[#991b1b] hover:bg-[#991b1b]/8 hover:text-[#991b1b] cursor-pointer'
                        >
                          <Trash2 size={15} className='mr-1.5' />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
