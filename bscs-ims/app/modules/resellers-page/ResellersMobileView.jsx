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
  ArrowUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function AssignedProductsCell({ resellerId }) {
  const [products, setProducts] = useState([])

  useState(() => {
    fetch(`/api/resellers-product/${resellerId}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || [])
      })
      .catch((err) => console.error(err))
  }, [resellerId])

  if (!products.length) return '-'
  return products.map((p) => p.name).join(', ')
}

export default function ResellersMobileView({ resellers, onEdit, onDelete, onCreate }) {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const filteredResellers = resellers
    .filter((r) => r.businessName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortOrder) return 0
      if (sortOrder === 'asc') return a.businessName.localeCompare(b.businessName)
      if (sortOrder === 'desc') return b.businessName.localeCompare(a.businessName)
      return 0
    })

  return (
    <div className='min-h-screen py-6 px-3 sm:px-6'>
      <div className='w-full max-w-6xl mx-auto space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold text-[#1F384C]'>Resellers</h1>
        </div>

        <Button
          onClick={onCreate}
          className='fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#1F384C] text-white shadow-lg flex items-center justify-center hover:bg-[#162A3F] active:scale-95 p-0'
        >
          <Plus size={24} />
        </Button>

        <div className='w-full relative'>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search reseller...'
            className='w-full pr-10 focus-visible:ring-[#1e40af]/30 focus-visible:ring-offset-0'
          />
          <Button
            variant='ghost'
            className='absolute right-1 top-1/2 -translate-y-1/2 p-1.5 h-auto w-auto text-white bg-[#1F384C] rounded hover:bg-[#162A3F]'
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

        {isFilterOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb]'>
            <p className='text-xs text-[#6b7280] mb-2'>Filter by status</p>
            <div className='flex gap-2'>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6]'>
                All
              </Button>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6]'>
                Active
              </Button>
              <Button variant='outline' className='flex-1 border-[#e5e7eb] text-[#4A5568] hover:bg-[#f3f4f6]'>
                Inactive
              </Button>
            </div>
          </div>
        )}

        {isSortOpen && (
          <div className='bg-white rounded-lg p-3 shadow-sm border border-[#e5e7eb]'>
            <p className='text-xs text-[#6b7280] mb-2'>Sort resellers</p>
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

        <div className='space-y-3'>
          {filteredResellers.length === 0 && (
            <div className='bg-white rounded-lg py-10 text-center text-gray-500 shadow-sm border border-[#e5e7eb]'>
              No resellers found
            </div>
          )}

          {filteredResellers.map((reseller) => {
            const isOpen = expandedId === reseller.id
            return (
              <div key={reseller.id} className='bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden'>
                <Button
                  variant='ghost'
                  onClick={() => toggleExpand(reseller.id)}
                  className='w-full flex items-center justify-between px-4 py-3 text-left h-auto rounded-none hover:bg-transparent'
                >
                  <div className='flex items-center gap-3'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage src={reseller.imageUrl} />
                      <AvatarFallback className='bg-[#E8F1FA] text-[#1F384C]'>
                        {reseller.businessName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className='text-left'>
                      <span className='font-semibold text-[#1F384C]'>{reseller.businessName}</span>
                      <p className='text-xs text-[#6b7280] mt-0.5'>{reseller.contactNumber}</p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={18} className='text-[#6b7280] shrink-0' />
                  ) : (
                    <ChevronDown size={18} className='text-[#6b7280] shrink-0' />
                  )}
                </Button>

                {isOpen && (
                  <div className='px-4 pb-4 space-y-3 text-sm border-t border-[#e5e7eb]'>
                    <div className='grid grid-cols-2 gap-y-2.5 pt-3'>
                      <div>
                        <span className='text-[#6b7280]'>Business Name</span>
                        <p className='font-medium text-[#1F384C]'>{reseller.businessName}</p>
                      </div>
                      <div>
                        <span className='text-[#6b7280]'>Contact</span>
                        <p className='font-medium text-[#1F384C]'>{reseller.contactNumber}</p>
                      </div>
                      <div>
                        <span className='text-[#6b7280]'>Address</span>
                        <p className='font-medium text-[#374151]'>{reseller.address || '-'}</p>
                      </div>
                      <div>
                        <span className='text-[#6b7280]'>Status</span>
                        <p
                          className={`font-medium ${reseller.status === 'active' ? 'text-green-700' : 'text-red-700'}`}
                        >
                          {reseller.status === 'active' ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      <div className='col-span-2'>
                        <span className='text-[#6b7280]'>Products</span>
                        <p className='font-medium text-[#374151]'>
                          <AssignedProductsCell resellerId={reseller.id} />
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-2 pt-1'>
                      <Button
                        variant='outline'
                        onClick={() => onEdit(reseller)}
                        className='flex-1 border-[#e5e7eb] text-[#1F384C] hover:bg-[#f3f4f6]'
                      >
                        <Edit2 size={15} className='mr-1.5' />
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => onDelete(reseller.id)}
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
  )
}
