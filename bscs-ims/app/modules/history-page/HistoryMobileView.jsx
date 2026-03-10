'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import HistoryFilterDialog from './HistoryFilterDialog'
import HistorySortDialog from './HistorySortDialog'

function SkeletonCard() {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden p-4'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2 flex-1'>
          <div className='h-4 w-36 bg-gray-200 rounded animate-pulse' />
          <div className='h-3 w-24 bg-gray-200 rounded animate-pulse' />
        </div>
        <div className='h-5 w-5 bg-gray-200 rounded animate-pulse' />
      </div>
    </div>
  )
}

function formatDateTime(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export default function HistoryMobileView({
  history = [],
  loading = false,
  search,
  setSearch,
  onSearchSubmit,
  productFilter,
  setProductFilter,
  locationFilter,
  setLocationFilter,
  adjustmentFilter,
  setAdjustmentFilter,
  sortOrder,
  setSortOrder,
  products  = [],
  locations = [],
}) {
  const [expandedId, setExpandedId] = useState(null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false)

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const activeFilterCount = [productFilter, locationFilter, adjustmentFilter].filter(Boolean).length

  // Handler for filter dialog
  const handleFilterApply = (filters) => {
    setProductFilter(filters.product)
    setLocationFilter(filters.location)
    setAdjustmentFilter(filters.adjustment)
  }

  // Handler for sort dialog
  const handleSortSelect = (order) => {
    setSortOrder(order)
  }

  return (
    <div className='min-h-screen py-6 px-3 sm:px-6'>
      <div className='w-full max-w-6xl mx-auto space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold text-[#1F384C]'>Inventory History</h1>
        </div>

        {/* Search */}
        <div className='w-full relative'>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
            placeholder='Search by product name or SKU...'
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

        {/* Filter / Sort toggles */}
        <div className='flex gap-2 w-full'>
          <Button
            variant='outline'
            onClick={() => setIsFilterDialogOpen(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer ${
              activeFilterCount > 0 ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : ''
            }`}
          >
            <Filter size={16} />
            Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
          <Button
            variant='outline'
            onClick={() => setIsSortDialogOpen(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] cursor-pointer ${
              sortOrder ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : ''
            }`}
          >
            <ArrowUpDown size={16} />
            Sort
          </Button>
        </div>

        {/* Cards */}
        <div className='space-y-3 pb-20'>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : history.length === 0 ? (
            <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm border border-[#e5e7eb]'>
              No history records found
            </div>
          ) : (
            history.map((row) => {
              const isOpen = expandedId === row.id
              const isAdd  = row.adjustment > 0
              return (
                <div key={row.id} className='bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden'>
                  <Button
                    variant='ghost'
                    onClick={() => toggle(row.id)}
                    className='w-full flex items-center justify-between px-4 py-3 text-left h-auto rounded-none hover:bg-transparent cursor-pointer'
                  >
                    <div className='text-left flex-1 pr-2'>
                      <span className='font-semibold text-[#1F384C]'>{row.productName}</span>
                      <p className='text-xs text-[#9ca3af] font-mono mt-0.5'>{row.productSku}</p>
                      <p className='text-xs text-[#6b7280] mt-0.5'>{formatDateTime(row.timestamp)}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          isAdd
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isAdd ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isAdd ? '+' : ''}{row.adjustment}
                      </span>
                      {isOpen
                        ? <ChevronUp size={18} className='text-[#6b7280] shrink-0' />
                        : <ChevronDown size={18} className='text-[#6b7280] shrink-0' />
                      }
                    </div>
                  </Button>

                  {isOpen && (
                    <div className='px-4 pb-4 space-y-3 text-sm border-t border-[#e5e7eb]'>
                      <div className='pt-3 grid grid-cols-2 gap-3'>
                        <div>
                          <span className='text-[#6b7280] text-xs'>Location</span>
                          <p className='font-medium text-[#374151] mt-1 text-xs'>{row.locationName}</p>
                        </div>
                        <div>
                          <span className='text-[#6b7280] text-xs'>Category</span>
                          <p className={`font-semibold mt-1 text-xs ${isAdd ? 'text-green-700' : 'text-red-700'}`}>
                            {row.category}
                          </p>
                        </div>
                        <div>
                          <span className='text-[#6b7280] text-xs'>Previous Qty</span>
                          <p className='font-medium text-[#374151] mt-1 text-xs'>{row.previousQuantity}</p>
                        </div>
                        <div>
                          <span className='text-[#6b7280] text-xs'>Resulting Qty</span>
                          <p className='font-bold text-[#1F384C] mt-1 text-xs'>{row.resultingQuantity}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Filter Dialog */}
      <HistoryFilterDialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={{
          product: productFilter,
          location: locationFilter,
          adjustment: adjustmentFilter
        }}
        products={products}
        locations={locations}
        onApply={handleFilterApply}
      />

      {/* Sort Dialog */}
      <HistorySortDialog
        open={isSortDialogOpen}
        onClose={() => setIsSortDialogOpen(false)}
        sortOrder={sortOrder}
        onSortSelect={handleSortSelect}
      />
    </div>
  )
}