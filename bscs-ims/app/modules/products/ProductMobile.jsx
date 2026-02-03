'use client'

import {
  Search,
  Plus,
  Edit as Edit2,
  Trash2,
  Filter,
  ArrowUpAZ,
  ArrowDownAZ,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function ProductMobile({
  products,
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  expandedId,
  toggleExpand,
  isFilterOpen,
  setIsFilterOpen,
  onCreate,
  onEdit,
  onDelete
}) {
  return (
    <div className='min-h-screen bg-[#f5f7fb] py-6 px-3 sm:px-6 relative'>
      <div className='max-w-6xl mx-auto space-y-4'>
        {/* Header */}
        <h1 className='text-xl font-bold'>Products</h1>

        {/* Floating Add Button */}
        <button
          onClick={onCreate}
          className='fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#1F384C] text-white shadow-lg flex items-center justify-center hover:bg-[#162A3F] active:scale-95 transition'
        >
          <Plus size={24} />
        </button>

        {/* Search + Filter */}
        <div className='bg-white rounded-lg p-3 shadow-sm space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='flex-1 relative'>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search'
                className='w-full pl-3 pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <button
                onClick={() => {}}
                className='absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white hover:bg-[#1F384C] rounded'
              >
                <Search size={16} />
              </button>
            </div>

            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className='flex items-center gap-1 border rounded-md px-3 py-2 text-sm hover:bg-gray-50'
            >
              <Filter size={16} />
              Filter
            </button>
          </div>

          {isFilterOpen && (
            <div className='flex gap-2 mt-2'>
              <button
                onClick={() => setSortOrder('asc')}
                className={`flex-1 border rounded-md py-2 text-sm flex items-center justify-center gap-1 ${
                  sortOrder === 'asc' ? 'bg-gray-100' : ''
                }`}
              >
                <ArrowUpAZ size={16} />
                Asc
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`flex-1 border rounded-md py-2 text-sm flex items-center justify-center gap-1 ${
                  sortOrder === 'desc' ? 'bg-gray-100' : ''
                }`}
              >
                <ArrowDownAZ size={16} />
                Desc
              </button>
            </div>
          )}
        </div>

        {/* Products */}
        <div className='space-y-3'>
          {products.length === 0 && (
            <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm'>
              No products found
            </div>
          )}

          {products.map((product) => {
            const isOpen = expandedId === product.id
            return (
              <div key={product.id} className='bg-white rounded-lg shadow-sm border overflow-hidden'>
                <button
                  onClick={() => toggleExpand(product.id)}
                  className='w-full flex items-center justify-between px-4 py-3 text-left'
                >
                  <span className='font-semibold'>{product.name}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div className='px-4 pb-4 space-y-3 text-sm border-t'>
                    <div className='flex items-center gap-3 pt-3'>
                      <img src={product.image} alt='' className='w-12 h-12 rounded-md object-cover' />
                      <div>
                        <div className='font-medium'>{product.name}</div>
                        <div className='text-xs text-gray-500'>SKU: {product.sku}</div>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-y-2'>
                      <div>
                        <span className='text-gray-500'>Unit:</span> {product.priceUnit}
                      </div>
                      <div>
                        <span className='text-gray-500'>Price:</span> ₱{product.price}
                      </div>
                      <div>
                        <span className='text-gray-500'>Status:</span>{' '}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.status === 'Available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-2 pt-2'>
                      <button
                        onClick={() => onEdit(product)}
                        className='flex-1 border rounded-md py-2 flex items-center justify-center gap-1 hover:bg-gray-50'
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className='flex-1 border rounded-md py-2 flex items-center justify-center gap-1 hover:bg-gray-50'
                      >
                        <Trash2 size={16} />
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
