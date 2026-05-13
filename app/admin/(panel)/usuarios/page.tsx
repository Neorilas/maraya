import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AdminsEditor } from "@/components/admin/users/AdminsEditor"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Usuarios · Maraya Admin",
  robots: { index: false, follow: false },
}

export default async function UsuariosPage() {
  const session = await auth()
  const admins = await prisma.admin.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">Usuarios</h1>
        <p className="text-text-mid mt-1 text-sm">
          Gestiona las cuentas de administrador. Para cambiar una contraseña, se
          enviará un email de confirmación antes de aplicar el cambio.
        </p>
      </header>

      <AdminsEditor admins={admins} currentUserId={session!.user.id} />
    </div>
  )
}
