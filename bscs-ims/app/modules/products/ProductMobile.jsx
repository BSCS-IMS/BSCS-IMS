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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductFormModal from './ProductFormModal'

export default function ProductMobile({
  products,
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  onCreate,
  onEdit,
  onDelete,
  isProductModalOpen,
  setIsProductModalOpen,
  productModalMode,
  productModalInitialValues,
  onConfirm
}) {
  const [expandedId, setExpandedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const filteredProducts = products

  return (
    <>
      <div className='min-h-screen py-6 px-3 sm:px-6'>
        <div className='w-full max-w-6xl mx-auto space-y-4'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold text-[#1F384C]'>Products</h1>
          </div>

          {/* Floating Add Button */}
          <Button
            onClick={onCreate}
            className='fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#1F384C] text-white shadow-lg flex items-center justify-center hover:bg-[#162A3F] active:scale-95 p-0'
          >
            <Plus size={24} />
          </Button>

          {/* Search */}
          <div className='w-full relative'>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search products...'
              className='w-full pr-10 focus-visible:ring-[#1e40af]/30 focus-visible:ring-offset-0'
            />
            <Button
              variant='ghost'
              className='absolute right-1 top-1/2 -translate-y-1/2 p-1.5 h-auto w-auto text-white bg-[#1F384C] rounded hover:bg-[#162A3F]'
            >
              <Search size={14} />
            </Button>
          </div>

          {/* Filter + Sort Buttons */}
          <div className='flex gap-2 w-full'>
            <Button
              variant='outline'
              onClick={() => {
                setIsFilterOpen((prev) => !prev)
                setIsSortOpen(false)
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] ${
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
              className={`flex-1 flex items-center justify-center gap-1.5 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6] ${
                isSortOpen ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : ''
              }`}
            >
              <ArrowUpDown size={16} />
              Sort
            </Button>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb]'>
              <p className='text-xs text-[#6b7280] mb-2'>Filter by status</p>
              <div className='flex gap-2'>
                <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6]'>
                  All
                </Button>
                <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6]'>
                  Available
                </Button>
                <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6]'>
                  Not Available
                </Button>
              </div>
            </div>
          )}

          {/* Sort Panel */}
          {isSortOpen && (
            <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb]'>
              <p className='text-xs text-[#6b7280] mb-2'>Sort products</p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setSortOrder('asc')}
                  className={`flex-1 flex items-center justify-center gap-1 border-[#e5e7eb] text-[#4A5568] ${
                    sortOrder === 'asc' ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : 'hover:bg-[#f3f4f6]'
                  }`}
                >
                  <ArrowUpAZ size={16} />A to Z
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setSortOrder('desc')}
                  className={`flex-1 flex items-center justify-center gap-1 border-[#e5e7eb] text-[#4A5568] ${
                    sortOrder === 'desc' ? 'bg-[#1e40af]/10 border-[#1e40af] text-[#1e40af]' : 'hover:bg-[#f3f4f6]'
                  }`}
                >
                  <ArrowDownAZ size={16} />Z to A
                </Button>
              </div>
            </div>
          )}

          {/* Product Cards */}
          <div className='space-y-3 pb-20'>
            {filteredProducts.length === 0 && (
              <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm border border-[#e5e7eb]'>
                No products found
              </div>
            )}

            {filteredProducts.map((product) => {
              const isOpen = expandedId === product.id
              return (
                <div key={product.id} className='bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden'>
                  <Button
                    variant='ghost'
                    onClick={() => toggleExpand(product.id)}
                    className='w-full flex items-center justify-between px-4 py-3 text-left h-auto rounded-none hover:bg-transparent'
                  >
                    <div className='text-left'>
                      <span className='font-semibold text-[#1F384C]'>{product.name}</span>
                      <p className='text-xs text-[#6b7280] mt-0.5'>{product.sku}</p>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={18} className='text-[#6b7280] shrink-0' />
                    ) : (
                      <ChevronDown size={18} className='text-[#6b7280] shrink-0' />
                    )}
                  </Button>

                  {isOpen && (
                    <div className='px-4 pb-4 space-y-3 text-sm border-t border-[#e5e7eb]'>
                      <div className='flex items-center gap-3 pt-3'>
                        <img src={product.image} alt='' className='w-12 h-12 rounded-md object-cover' />
                        <div>
                          <div className='font-medium text-[#1F384C]'>{product.name}</div>
                          <div className='text-xs text-[#6b7280]'>SKU: {product.sku}</div>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-y-2.5'>
                        <div>
                          <span className='text-[#6b7280]'>Unit</span>
                          <p className='font-medium text-[#1F384C]'>{product.priceUnit}</p>
                        </div>
                        <div>
                          <span className='text-[#6b7280]'>Price</span>
                          <p className='font-medium text-[#374151]'>₱{product.price}</p>
                        </div>
                        <div>
                          <span className='text-[#6b7280]'>Status</span>
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
                        <Button
                          variant='outline'
                          onClick={() => onEdit(product)}
                          className='flex-1 border-[#e5e7eb] text-[#1F384C] hover:bg-[#f3f4f6]'
                        >
                          <Edit2 size={15} className='mr-1.5' />
                          Edit
                        </Button>
                        <Button
                          variant='outline'
                          onClick={() => onDelete(product.id)}
                          className='flex-1 border-[#e5e7eb] text-[#991b1b] hover:bg-[#991b1b]/8 hover:text-[#991b1b]'
                        >
                          <Trash2 size={15} className='mr-1.5' />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {isProductModalOpen && (
        <ProductFormModal
          onClose={() => setIsProductModalOpen(false)}
          product={productModalMode === 'edit' ? productModalInitialValues : null}
          onConfirm={onConfirm}
        />
      )}
    </>
  )
}
