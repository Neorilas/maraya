"use client"

import { Menu } from "lucide-react"
import { useAdminSidebar } from "@/components/admin/AdminShell"

export function MobileMenuButton() {
  const { setOpen } = useAdminSidebar()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Abrir menú"
      className="p-2 -ml-2 rounded-full hover:bg-pink-light text-pink-deep"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}
