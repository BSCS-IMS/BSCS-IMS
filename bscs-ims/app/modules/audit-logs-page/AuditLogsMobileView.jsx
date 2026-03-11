import { useState } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUpAZ,
  ArrowDownAZ,
  Calendar,
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
  
  const { action, oldData, newData, entityType } = log
  
  if (action === 'CREATE') {
    switch (entityType) {
      case 'announcement':
        return `Created new announcement: "${newData?.title || 'Untitled'}"`
      case 'product':
        return `Added new product: "${newData?.name || newData?.productName || 'Unnamed'}"`
      case 'reseller':
        return `Added new reseller: "${newData?.businessName || newData?.ownerName || 'Unnamed'}"`
      case 'inventory':
        return `Added new inventory item: "${newData?.itemName || newData?.name || newData?.productName || 'Unnamed'}"`
      default:
        return 'New record created'
    }
  }
  
  if (action === 'DELETE') {
    switch (entityType) {
      case 'announcement':
        return `Deleted announcement: "${oldData?.title || 'Untitled'}"`
      case 'product':
        return `Removed product: "${oldData?.name || oldData?.productName || 'Unnamed'}"`
      case 'reseller':
        return `Removed reseller: "${oldData?.businessName || oldData?.ownerName || 'Unnamed'}"`
      case 'inventory':
        return `Removed inventory item: "${oldData?.itemName || oldData?.name || oldData?.productName || 'Unnamed'}"`
      default:
        return 'Record deleted'
    }
  }
  
  return 'Updated'
}

export default function AuditLogsMobileView({ 
  logs, 
  loading = false,
  search,
  setSearch,
  onSearchSubmit,
  actionFilter,
  setActionFilter,
  moduleFilter,
  setModuleFilter,
  sortOrder,
  setSortOrder
}) {
  const [expandedId, setExpandedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const handleActionFilter = (action) => {
    setActionFilter(action === actionFilter ? '' : action)
  }

  const handleModuleFilter = (module) => {
    setModuleFilter(module === moduleFilter ? '' : module)
  }

  const handleSort = (order) => {
    setSortOrder(order === sortOrder ? null : order)
  }

  const activeStyle = 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]'
  const inactiveStyle = 'hover:bg-[#f3f4f6]'

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
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
            placeholder='Search by module or record ID...'
            className='w-full pr-10 focus-visible:ring-[#1e40af]/30 focus-visible:ring-offset-0'
          />
          <Button
            variant='ghost'
            onClick={onSearchSubmit}
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
              isFilterOpen || actionFilter || moduleFilter ? activeStyle : ''
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
              isSortOpen || sortOrder ? activeStyle : ''
            }`}
          >
            <ArrowUpDown size={16} />
            Sort
          </Button>
        </div>

        {isFilterOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb] space-y-3'>
            {/* Action filter */}
            <div>
              <p className='text-xs text-[#6b7280] mb-2 font-medium'>Filter by Action</p>
              <div className='flex gap-2'>
                {[
                  { label: 'All',    value: '' },
                  { label: 'Create', value: 'CREATE' },
                  { label: 'Update', value: 'UPDATE' },
                  { label: 'Delete', value: 'DELETE' },
                ].map(({ label, value }) => (
                  <Button
                    key={value}
                    variant='outline'
                    onClick={() => handleActionFilter(value)}
                    className={`flex-1 border-[#e5e7eb] text-[#4A5568] cursor-pointer text-xs ${
                      (value === '' ? !actionFilter : actionFilter === value)
                        ? activeStyle
                        : inactiveStyle
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Module filter */}
            <div>
              <p className='text-xs text-[#6b7280] mb-2 font-medium'>Filter by Module</p>
              <div className='grid grid-cols-2 gap-2'>
                {[
                  { label: 'All Modules',   value: '' },
                  { label: 'Announcement',  value: 'announcement' },
                  { label: 'Product',       value: 'product' },
                  { label: 'Reseller',      value: 'reseller' },
                  { label: 'Inventory',     value: 'inventory' },
                ].map(({ label, value }) => (
                  <Button
                    key={value}
                    variant='outline'
                    onClick={() => handleModuleFilter(value)}
                    className={`border-[#e5e7eb] text-[#4A5568] cursor-pointer text-xs ${
                      (value === '' ? !moduleFilter : moduleFilter === value)
                        ? activeStyle
                        : inactiveStyle
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isSortOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb]'>
            <p className='text-xs text-[#6b7280] mb-2 font-medium'>Sort audit logs</p>
            <div className='space-y-2'>
              {[
                { label: 'Newest First',   value: 'date-desc',   icon: <Calendar size={14} /> },
                { label: 'Oldest First',   value: 'date-asc',    icon: <Calendar size={14} /> },
                { label: 'Module (A to Z)', value: 'module-asc', icon: <ArrowUpAZ size={14} /> },
                { label: 'Module (Z to A)', value: 'module-desc', icon: <ArrowDownAZ size={14} /> },
              ].map(({ label, value, icon }) => (
                <Button
                  key={value}
                  variant='outline'
                  onClick={() => handleSort(value)}
                  className={`w-full flex items-center justify-start gap-2 border-[#e5e7eb] text-[#4A5568] cursor-pointer text-xs ${
                    sortOrder === value ? activeStyle : inactiveStyle
                  }`}
                >
                  {icon}
                  {label}
                </Button>
              ))}
              {sortOrder && (
                <Button
                  variant='outline'
                  onClick={() => setSortOrder(null)}
                  className='w-full flex items-center justify-center gap-2 border-[#e5e7eb] text-[#6b7280] hover:bg-[#f3f4f6] cursor-pointer text-xs'
                >
                  <X size={14} />
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
          ) : logs.length === 0 ? (
            <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm border border-[#e5e7eb]'>
              No audit logs found
            </div>
          ) : (
            logs.map((log) => {
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
                          <p className='font-medium text-[#374151] mt-1 text-xs break-all'>
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