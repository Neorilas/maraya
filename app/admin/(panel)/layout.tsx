import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminShell } from "@/components/admin/AdminShell"
import { AdminTopBar } from "@/components/admin/AdminTopBar"

export const metadata = {
  title: "Panel Maraya · Admin",
  robots: { index: false, follow: false },
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Defense-in-depth. El proxy.ts ya redirige sin sesión.
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  return (
    <AdminShell>
      <AdminTopBar
        user={{ name: session.user.name, email: session.user.email }}
      />
      {children}
    </AdminShell>
  )
}
