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
  SidebarHeader,
} from "@/components/ui/sidebar"
import { ClipboardClock, ChartColumn, ShoppingCart, UserRound, Settings, Archive } from "lucide-react"

// Menu items
const menuitems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartColumn,
  },
  {
    title: "Products",
    url: "/products",
    icon: ShoppingCart,
  },
  {
    title: "History",
    url: "/history",
    icon: ClipboardClock,
  },
  {
    title: "Resellers",
    url: "/resellers",
    icon: UserRound,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Archive,
  },
]

const otheritems = [
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: Settings,
  },
]
 
export function AppSidebar() {
  const pathname = usePathname()
  
  return (
    <Sidebar className="bg-[#F1F2F7]">
      {/* Custom Header with Logo */}
      <SidebarHeader className="h-16 border-b border-[#E0E2E9] bg-[#F1F2F7]">
        <div className="flex items-center gap-3 px-8 h-full">
          {/* Logo placeholder - shows first letter */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5A67BA] text-white font-bold text-sm shrink-0">
            M
          </div>
          {/* System name */}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-[#5A67BA] leading-tight">
              Murang Bigas
            </h2>
            <h2 className="text-sm font-bold text-[#5A67BA] leading-tight">
              Livelihood
            </h2>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#F1F2F7]">
        {/* Menu Group with Custom Styling */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-normal text-[#082431] uppercase tracking-wider px-8 py-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-8">
              {menuitems.map((menuitem) => {
                const isActive = pathname === menuitem.url
                return (
                  <SidebarMenuItem key={menuitem.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`h-11 px-3 text-lg transition-colors rounded-lg ${
                        isActive 
                          ? 'bg-[#707FDD]/20 text-[#5A6ACF] font-medium' 
                          : 'text-[#273240] font-normal hover:bg-[#707FDD]/10'
                      }`}
                    >
                      <a href={menuitem.url} className="flex items-center gap-3">
                        <menuitem.icon 
                          className={`w-8 h-8 shrink-0 ${
                            isActive ? 'text-[#707FDD]' : 'text-[#A6ABC8]'
                          }`} 
                        />
                        <span className="truncate">{menuitem.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Others Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-normal text-[#082431] uppercase tracking-wider px-8 py-2">
            Others
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-8">
              {otheritems.map((otheritem) => {
                const isActive = pathname === otheritem.url
                return (
                  <SidebarMenuItem key={otheritem.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`h-11 px-3 text-lg transition-colors rounded-lg ${
                        isActive 
                          ? 'bg-[#707FDD]/20 text-[#5A6ACF] font-medium' 
                          : 'text-[#273240] font-normal hover:bg-[#707FDD]/10'
                      }`}
                    >
                      <a href={otheritem.url} className="flex items-center gap-3">
                        <otheritem.icon 
                          className={`w-8 h-8 shrink-0 ${
                            isActive ? 'text-[#707FDD]' : 'text-[#A6ABC8]'
                          }`} 
                        />
                        <span className="truncate">{otheritem.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}