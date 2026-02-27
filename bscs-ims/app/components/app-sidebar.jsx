'use client'
import { useState } from 'react'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { LogoutLoader } from '@/app/components/Loader'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar'
import { ClipboardClock, ChartColumn, ShoppingCart, UserRound, Settings, Archive, LogOut } from 'lucide-react'
import Image from 'next/image'

const menuitems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: ChartColumn
  },
  {
    title: 'Products',
    url: '/products',
    icon: ShoppingCart
  },
  {
    title: 'History',
    url: '/history',
    icon: ClipboardClock
  },
  {
    title: 'Resellers',
    url: '/resellers',
    icon: UserRound
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: Archive
  }
]

const otheritems = [
  {
    title: 'Audit Logs',
    url: '/audit-logs',
    icon: Settings
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await axios.post('/api/logout')

      toast.success('Logged out successfully.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      })

      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)

      toast.error('Logout failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
    }
  }

  return (
    <>
      {isLoggingOut && <LogoutLoader />}
      <Sidebar className='bg-[#F8F9FA]'>
      <SidebarHeader className='h-16 border-b border-[#E5E7EB] bg-[#F8F9FA]'>
        <div className='flex items-center gap-3 px-8 h-full'>
          <div className='flex items-center justify-center w-8 h-8 shrink-0'>
            <Image
              src="/LOGO_CLEAR.png"
              alt="Murang Bigas Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>

          <div className='flex flex-col'>
            <h2 className='text-sm font-bold text-[#1F384C] leading-tight'>Murang Bigas</h2>
            <h2 className='text-sm font-bold text-[#1F384C] leading-tight'>Livelihood</h2>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='bg-[#F8F9FA]'>
        <SidebarGroup>
          <SidebarGroupLabel className='text-xs font-normal text-[#4A5568] uppercase tracking-wider px-8 py-3 mb-1'>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='gap-2 px-8'>
              {menuitems.map((menuitem) => {
                const isActive = pathname === menuitem.url
                return (
                  <SidebarMenuItem key={menuitem.title}>
                    <SidebarMenuButton
                      asChild
                      className={`h-12 px-3 text-base transition-colors rounded-lg ${
                        isActive
                          ? 'bg-[#1F384C]/12 text-[#1F384C] font-medium'
                          : 'text-[#4A5568] font-normal hover:bg-[#1F384C]/8'
                      }`}
                    >
                      <a href={menuitem.url} className='flex items-center gap-3'>
                        <menuitem.icon
                          className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#1F384C]' : 'text-[#718096]'}`}
                        />
                        <span className='truncate'>{menuitem.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className='mt-4'>
          <SidebarGroupLabel className='text-xs font-normal text-[#4A5568] uppercase tracking-wider px-8 py-3 mb-1'>
            Others
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='gap-2 px-8'>
              {otheritems.map((otheritem) => {
                const isActive = pathname === otheritem.url
                return (
                  <SidebarMenuItem key={otheritem.title}>
                    <SidebarMenuButton
                      asChild
                      className={`h-12 px-3 text-base transition-colors rounded-lg ${
                        isActive
                          ? 'bg-[#1F384C]/12 text-[#1F384C] font-medium'
                          : 'text-[#4A5568] font-normal hover:bg-[#1F384C]/8'
                      }`}
                    >
                      <a href={otheritem.url} className='flex items-center gap-3'>
                        <otheritem.icon
                          className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#1F384C]' : 'text-[#718096]'}`}
                        />
                        <span className='truncate'>{otheritem.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t border-[#E5E7EB] bg-[#F8F9FA] p-4'>
        <SidebarMenu className='px-4'>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className='h-12 px-3 text-base transition-colors rounded-lg text-[#1F384C] font-normal hover:bg-[#1F384C]/8'
            >
              <div className='flex items-center gap-3 w-full cursor-pointer'>
                <LogOut className='w-5 h-5 shrink-0' />
                <span className='truncate'>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    </>
  )
}
