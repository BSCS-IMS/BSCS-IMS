import { useState } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp
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

function formatDateTime(timestamp) {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getActionColor(action) {
  switch (action) {
    case 'CREATE':
      return 'bg-green-100 text-green-700'
    case 'UPDATE':
      return 'bg-blue-100 text-blue-700'
    case 'DELETE':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function formatChanges(log) {
  if (!log) return '-'
  
  const { action, oldData, newData } = log
  
  if (action === 'CREATE') {
    return 'New record created'
  }
  
  if (action === 'DELETE') {
    return 'Record deleted'
  }
  
  if (action === 'UPDATE' && oldData && newData) {
    const changes = []
    Object.keys(newData).forEach(key => {
      if (key !== 'updatedAt' && key !== 'updatedByEmail' && JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        changes.push(key)
      }
    })
    return changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No changes detected'
  }
  
  return '-'
}

export default function AuditLogsMobileView({ logs, loading = false }) {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const filteredLogs = logs.filter((log) =>
    log.entityType?.toLowerCase().includes(search.toLowerCase()) ||
    log.entityId?.toLowerCase().includes(search.toLowerCase()) ||
    log.performedBy?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='min-h-screen py-6 px-3 sm:px-6'>
      <div className='w-full max-w-6xl mx-auto space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold text-[#1F384C]'>Audit Logs</h1>
        </div>

        <div className='w-full relative'>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search logs...'
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
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`flex-1 flex items-center justify-center gap-1.5 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer ${
              isFilterOpen ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : ''
            }`}
          >
            <Filter size={16} />
            Filter
          </Button>
        </div>

        {isFilterOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb]'>
            <p className='text-xs text-[#6b7280] mb-2'>Filter by action</p>
            <div className='flex gap-2'>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer'>
                All
              </Button>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer'>
                Create
              </Button>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer'>
                Update
              </Button>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer'>
                Delete
              </Button>
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
          ) : filteredLogs.length === 0 ? (
            <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm border border-[#e5e7eb]'>
              No audit logs found
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isOpen = expandedId === log.id
              return (
                <div key={log.id} className='bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden'>
                  <Button
                    variant='ghost'
                    onClick={() => toggleExpand(log.id)}
                    className='w-full flex items-center justify-between px-4 py-3 text-left h-auto rounded-none hover:bg-transparent cursor-pointer'
                  >
                    <div className='text-left flex-1 pr-2'>
                      <span className='font-semibold text-[#1F384C] capitalize'>{log.entityType}</span>
                      <p className='text-xs text-[#6b7280] mt-0.5'>
                        {formatDateTime(log.timestamp)}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
                      >
                        {log.action}
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
                      <div className='pt-3 grid grid-cols-2 gap-3'>
                        <div>
                          <span className='text-[#6b7280] text-xs'>Record ID</span>
                          <p className='font-mono text-[#374151] mt-1 text-xs break-all'>
                            {log.entityId}
                          </p>
                        </div>
                        <div>
                          <span className='text-[#6b7280] text-xs'>Performed By</span>
                          <p className='font-medium text-[#374151] mt-1 text-xs'>
                            {log.performedBy || 'SYSTEM'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className='text-[#6b7280] text-xs'>Changes</span>
                        <p className='font-medium text-[#374151] mt-1 text-xs'>
                          {formatChanges(log)}
                        </p>
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