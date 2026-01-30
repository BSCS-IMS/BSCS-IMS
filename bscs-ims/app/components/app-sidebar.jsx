'use client'

import { usePathname } from 'next/navigation'
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

  const handleLogout = () => {
    console.log('Logout clicked')
  }

  return (
    <Sidebar className='bg-[#F8F9FA]'>
      <SidebarHeader className='h-16 border-b border-[#E5E7EB] bg-[#F8F9FA]'>
        <div className='flex items-center gap-3 px-8 h-full'>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#1e40af] text-white font-bold text-sm shrink-0'>
            M
          </div>
          <div className='flex flex-col'>
            <h2 className='text-sm font-bold text-[#1e40af] leading-tight'>Murang Bigas</h2>
            <h2 className='text-sm font-bold text-[#1e40af] leading-tight'>Livelihood</h2>
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
                          ? 'bg-[#1e40af]/15 text-[#1e40af] font-medium'
                          : 'text-[#4A5568] font-normal hover:bg-[#1e40af]/8'
                      }`}
                    >
                      <a href={menuitem.url} className='flex items-center gap-3'>
                        <menuitem.icon
                          className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#1e40af]' : 'text-[#718096]'}`}
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
                          ? 'bg-[#1e40af]/15 text-[#1e40af] font-medium'
                          : 'text-[#4A5568] font-normal hover:bg-[#1e40af]/8'
                      }`}
                    >
                      <a href={otheritem.url} className='flex items-center gap-3'>
                        <otheritem.icon
                          className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#1e40af]' : 'text-[#718096]'}`}
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
              className='h-12 px-3 text-base transition-colors rounded-lg text-[#1e40af] font-normal hover:bg-[#1e40af]/8'
            >
              <div className='flex items-center gap-3 w-full'>
                <LogOut className='w-5 h-5 shrink-0' />
                <span className='truncate'>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
