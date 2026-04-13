import * as React from "react"
import { Outlet } from "react-router-dom"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

/** Width of the fixed sidebar rail; synced to `--sidebar-width` for inset offset. */
const SIDEBAR_WIDTH_PX = 216

export function AppShellLayout() {
  return (
    <SidebarProvider
      className="relative min-h-svh"
      style={
        {
          "--sidebar-width": `${SIDEBAR_WIDTH_PX}px`,
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="none" className="app-sidebar-rail">
        <SidebarContent className="app-sidebar-rail-body" />
      </Sidebar>
      <SidebarInset
        className={cn("app-main-inset", "flex min-h-svh flex-col")}
      >
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
