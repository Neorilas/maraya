import { AdminRow, type AdminRowData } from "./AdminRow"
import { CreateAdminForm } from "./CreateAdminForm"

export function AdminsEditor({
  admins,
  currentUserId,
}: {
  admins: AdminRowData[]
  currentUserId: string
}) {
  return (
    <div className="space-y-4">
      {admins.map((a) => (
        <AdminRow key={a.id} admin={a} isSelf={a.id === currentUserId} />
      ))}
      <CreateAdminForm />
    </div>
  )
}
