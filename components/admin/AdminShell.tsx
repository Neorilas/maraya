"use client"

import { createContext, useContext, useState } from "react"
import { Sidebar } from "@/components/admin/Sidebar"

type SidebarCtx = {
  open: boolean
  setOpen: (v: boolean) => void
}

const SidebarContext = createContext<SidebarCtx>({
  open: false,
  setOpen: () => {},
})

export function useAdminSidebar(): SidebarCtx {
  return useContext(SidebarContext)
}

/**
 * Wrapper cliente que provee el estado del drawer móvil de la sidebar.
 * Recibe como children todo el árbol del panel (topbar + main + footer).
 * Así el topbar puede ser server component y aún así disparar el drawer
 * vía un sub-componente cliente (MobileMenuButton) que lee este contexto.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="lg:grid lg:grid-cols-[16rem_1fr] min-h-dvh bg-cream">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex flex-col min-w-0">{children}</div>
      </div>
    </SidebarContext.Provider>
  )
}
