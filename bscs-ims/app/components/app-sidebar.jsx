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
 


// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader />
//       <SidebarContent>
//         <SidebarGroup />
//         <SidebarGroup />
//       </SidebarContent>
//       <SidebarFooter />
//     </Sidebar>
//   )
// }
// Menu items.
const menuitems = [
  {
    title: "Dashboard",
    url: "#",
    icon: ChartColumn,
  },
  {
    title: "Products",
    url: "#",
    icon: ShoppingCart,
  },
  {
    title: "History",
    url: "#",
    icon: ClipboardClock,
  },
  {
    title: "Resellers",
    url: "#",
    icon: UserRound,
  },
  {
    title: "Inventory",
    url: "#",
    icon: Archive,
  },
]
const otheritems = [
  {
    title: "Audit Logs",
    url: "#",
    icon: Settings,
  },
]
 
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuitems.map((menuitems) => (
                <SidebarMenuItem key={menuitems.title}>
                  <SidebarMenuButton asChild>
                    <a href={menuitems.url}>
                      <menuitems.icon />
                      <span>{menuitems.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otheritems.map((otheritems) => (
                <SidebarMenuItem key={otheritems.title}>
                  <SidebarMenuButton asChild>
                    <a href={otheritems.url}>
                      <otheritems.icon />
                      <span>{otheritems.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}



// "use client";
// import React from "react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarFooter,
// } from "@/components/ui/sidebar";

// import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";

// const items = [
//   { title: "Home", icon: Home },
//   { title: "Inbox", icon: Inbox },
//   { title: "Calendar", icon: Calendar },
//   { title: "Search", icon: Search },
//   { title: "Settings", icon: Settings },
// ];

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader>Menu</SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Application</SidebarGroupLabel>
//           <div className="flex flex-col gap-1 mt-1">
//             {items.map((item) => (
//               <button
//                 key={item.title}
//                 className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
//               >
//                 <item.icon className="w-5 h-5" />
//                 <span className="whitespace-nowrap">{item.title}</span>
//               </button>
//             ))}
//           </div>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter>© 2026 EUGENE IMS</SidebarFooter>
//     </Sidebar>
//   );
// }
