'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "./sidebar"
import { AppSidebar } from "../../app/components/app-sidebar"

export function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  if (isLoginPage) {
    return <div className="w-full h-full">{children}</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

//use when nested body is fix
// 'use client'

// import { usePathname } from 'next/navigation'
// import { SidebarProvider, SidebarTrigger, SidebarInset } from "./sidebar"
// import { AppSidebar } from "../../app/components/app-sidebar"

// export function ConditionalLayout({ children }) {
//   const pathname = usePathname()
//   const isLoginPage = pathname === '/login'

//   if (isLoginPage) {
//     return <>{children}</>
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//           <SidebarTrigger />
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4">
//           {children}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }