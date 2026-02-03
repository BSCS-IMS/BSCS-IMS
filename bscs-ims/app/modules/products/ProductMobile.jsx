'use client'

import { useState } from 'react'
import {
  Search,
  Plus,
  Edit as Edit2,
  Trash2,
  Filter,
  ArrowUpAZ,
  ArrowDownAZ,
  ChevronDown,
  ChevronUp,
  ArrowUpDown
} from 'lucide-react'

export default function ProductMobile({
  products,
  loading,
  onCreate,
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const filteredProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortOrder) return 0
      if (sortOrder === 'asc') return a.name.localeCompare(b.name)
      if (sortOrder === 'desc') return b.name.localeCompare(a.name)
      return 0
    })

  return (
    <div className='min-h-screen bg-[#f5f7fb] py-6 px-3 sm:px-6'>
      <div className='w-full max-w-6xl mx-auto space-y-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold text-[#1F384C]'>Products</h1>
        </div>

        {/* Floating Add Button */}
        <button
          onClick={onCreate}
          className='fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#1F384C] text-white shadow-lg flex items-center justify-center hover:bg-[#162A3F] active:scale-95 transition'
        >
          <Plus size={24} />
        </button>

        {/* Search */}
        <div className='w-full relative'>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search products...'
            className='w-full pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          <button
            className='absolute right-1 top-1/2 -translate-y-1/2 p-1.5 h-auto w-auto text-white bg-[#1F384C] rounded hover:bg-[#162A3F]'
          >
            <Search size={14} />
          </button>
        </div>

        {/* Filter + Sort Buttons */}
        <div className='flex gap-2 w-full'>
          <button
            onClick={() => {
              setIsFilterOpen((prev) => !prev)
              setIsSortOpen(false)
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 border rounded-md py-2 text-sm ${
              isFilterOpen
                ? 'bg-blue-50 border-blue-500 text-blue-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Filter
          </button>

          <button
            onClick={() => {
              setIsSortOpen((prev) => !prev)
              setIsFilterOpen(false)
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 border rounded-md py-2 text-sm ${
              isSortOpen
                ? 'bg-blue-50 border-blue-500 text-blue-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ArrowUpDown size={16} />
            Sort
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-gray-200'>
            <p className='text-xs text-gray-500 mb-2'>Filter by status</p>
            <div className='flex gap-2'>
              <button className='flex-1 border rounded-md py-2 text-sm hover:bg-gray-50'>
                All
              </button>
              <button className='flex-1 border rounded-md py-2 text-sm hover:bg-gray-50'>
                Available
              </button>
              <button className='flex-1 border rounded-md py-2 text-sm hover:bg-gray-50'>
                Not Available
              </button>
            </div>
          </div>
        )}

        {/* Sort Panel */}
        {isSortOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-gray-200'>
            <p className='text-xs text-gray-500 mb-2'>Sort products</p>
            <div className='flex gap-2'>
              <button
                onClick={() => setSortOrder('asc')}
                className={`flex-1 flex items-center justify-center gap-1 border rounded-md py-2 text-sm ${
                  sortOrder === 'asc'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <ArrowUpAZ size={16} />A to Z
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`flex-1 flex items-center justify-center gap-1 border rounded-md py-2 text-sm ${
                  sortOrder === 'desc'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <ArrowDownAZ size={16} />Z to A
              </button>
            </div>
          </div>
        )}

        {/* Product Cards */}
        <div className='space-y-3'>
          {filteredProducts.length === 0 && (
            <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm border border-gray-200'>
              {loading ? 'Loading...' : 'No products found'}
            </div>
          )}

          {filteredProducts.map((product) => {
            const isOpen = expandedId === product.id
            return (
              <div
                key={product.id}
                className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'
              >
                <button
                  onClick={() => toggleExpand(product.id)}
                  className='w-full flex items-center justify-between px-4 py-3 text-left hover:bg-transparent'
                >
                  <div className='text-left'>
                    <span className='font-semibold text-[#1F384C]'>{product.name}</span>
                    <p className='text-xs text-gray-500 mt-0.5'>{product.sku}</p>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={18} className='text-gray-500 shrink-0' />
                  ) : (
                    <ChevronDown size={18} className='text-gray-500 shrink-0' />
                  )}
                </button>

                {isOpen && (
                  <div className='px-4 pb-4 space-y-3 text-sm border-t border-gray-200'>
                    <div className='flex items-center gap-3 pt-3'>
                      <img
                        src={product.image}
                        alt=''
                        className='w-12 h-12 rounded-md object-cover'
                      />
                      <div>
                        <div className='font-medium text-[#1F384C]'>{product.name}</div>
                        <div className='text-xs text-gray-500'>SKU: {product.sku}</div>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-y-2.5'>
                      <div>
                        <span className='text-gray-500'>Unit</span>
                        <p className='font-medium'>{product.priceUnit}</p>
                      </div>
                      <div>
                        <span className='text-gray-500'>Price</span>
                        <p className='font-medium'>₱{product.price}</p>
                      </div>
                      <div>
                        <span className='text-gray-500'>Status</span>
                        <p
                          className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'Available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {product.status}
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-2 pt-1'>
                      <button
                        onClick={() => onEdit(product)}
                        className='flex-1 border rounded-md py-2 text-sm flex items-center justify-center gap-1 hover:bg-gray-50'
                      >
                        <Edit2 size={15} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className='flex-1 border rounded-md py-2 text-sm flex items-center justify-center gap-1 text-red-600 hover:bg-red-50'
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
