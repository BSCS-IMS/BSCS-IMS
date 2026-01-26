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
    url: "#",
    icon: Settings,
  },
]
 
export function AppSidebar() {
  return (
    <Sidebar>
      {/* Custom Header with Logo */}
      <SidebarHeader className=" h-16 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-8 h-full">
          {/* Logo placeholder - shows first letter */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm shrink-0">
            M
          </div>
          {/* System name */}
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold text-sidebar-foreground leading-tight">
              Murang Bigas
            </h2>
            <h2 className="text-sm font-semibold text-sidebar-foreground leading-tight">
              Livelihood
            </h2>
            {/* format for smaller subtitle */}
            {/* <p className="text-xs text-sidebar-foreground/70">
              Livelihood
            </p> */}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Menu Group with Custom Styling */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-8 py-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-8">
              {menuitems.map((menuitem) => (
                <SidebarMenuItem key={menuitem.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="h-11 px-3 text-xl font-medium hover:bg-sidebar-accent/80 data-[active=true]:bg-blue-600 data-[active=true]:text-white transition-colors"
                  >
                    <a href={menuitem.url} className="flex items-center gap-3">
                      <menuitem.icon className="w-8 h-8 shrink-0" />
                      <span className="truncate">{menuitem.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Others Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-8 py-2">
            Others
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-8">
              {otheritems.map((otheritem) => (
                <SidebarMenuItem key={otheritem.title}>
                  <SidebarMenuButton 
                    asChild
                    className="h-11 px-3 text-xl font-medium hover:bg-sidebar-accent/80 data-[active=true]:bg-blue-600 data-[active=true]:text-white transition-colors"
                  >
                    <a href={otheritem.url} className="flex items-center gap-3">
                      <otheritem.icon className="w-8 h-8 shrink-0" />
                      <span className="truncate">{otheritem.title}</span>
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

// import {
//     Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,  
//   SidebarFooter,  
//   SidebarHeader,

// } from "@/components/ui/sidebar"
// import { ClipboardClock, ChartColumn, ShoppingCart, UserRound, Settings, Archive } from "lucide-react"
 


// // export function AppSidebar() {
// //   return (
// //     <Sidebar>
// //       <SidebarHeader />
// //       <SidebarContent>
// //         <SidebarGroup />
// //         <SidebarGroup />
// //       </SidebarContent>
// //       <SidebarFooter />
// //     </Sidebar>
// //   )
// // }
// // Menu items.
// const menuitems = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: ChartColumn,
//   },
//   {
//     title: "Products",
//     url: "/products",
//     icon: ShoppingCart,
//   },
//   {
//     title: "History",
//     url: "/history",
//     icon: ClipboardClock,
//   },
//   {
//     title: "Resellers",
//     url: "/resellers",
//     icon: UserRound,
//   },
//   {
//     title: "Inventory",
//     url: "/inventory",
//     icon: Archive,
//   },
// ]
// const otheritems = [
//   {
//     title: "Audit Logs",
//     url: "#",
//     icon: Settings,
//   },
// ]
 
// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarHeader>
//         Murang Bigas Livelihood
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Menu</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuitems.map((menuitems) => (
//                 <SidebarMenuItem key={menuitems.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={menuitems.url}>
//                       <menuitems.icon />
//                       <span>{menuitems.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//         <SidebarGroup>
//           <SidebarGroupLabel>Others</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {otheritems.map((otheritems) => (
//                 <SidebarMenuItem key={otheritems.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={otheritems.url}>
//                       <otheritems.icon />
//                       <span>{otheritems.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }



// // "use client";
// // import React from "react";
// // import {
// //   Sidebar,
// //   SidebarContent,
// //   SidebarGroup,
// //   SidebarGroupLabel,
// //   SidebarHeader,
// //   SidebarFooter,
// // } from "@/components/ui/sidebar";

// // import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";

// // const items = [
// //   { title: "Home", icon: Home },
// //   { title: "Inbox", icon: Inbox },
// //   { title: "Calendar", icon: Calendar },
// //   { title: "Search", icon: Search },
// //   { title: "Settings", icon: Settings },
// // ];

// // export function AppSidebar() {
// //   return (
// //     <Sidebar>
// //       <SidebarHeader>Menu</SidebarHeader>
// //       <SidebarContent>
// //         <SidebarGroup>
// //           <SidebarGroupLabel>Application</SidebarGroupLabel>
// //           <div className="flex flex-col gap-1 mt-1">
// //             {items.map((item) => (
// //               <button
// //                 key={item.title}
// //                 className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
// //               >
// //                 <item.icon className="w-5 h-5" />
// //                 <span className="whitespace-nowrap">{item.title}</span>
// //               </button>
// //             ))}
// //           </div>
// //         </SidebarGroup>
// //       </SidebarContent>
// //       <SidebarFooter>© 2026 EUGENE IMS</SidebarFooter>
// //     </Sidebar>
// //   );
// // }
