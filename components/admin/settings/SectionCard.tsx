import type { ComponentType } from "react"

/** Tarjeta de sección para forms del admin. Title + descripción + grid de hijos. */
export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  cols = 2,
}: {
  title: string
  description?: string
  icon?: ComponentType<{ className?: string }>
  children: React.ReactNode
  cols?: 1 | 2
}) {
  const gridClass = cols === 2 ? "sm:grid-cols-2" : "grid-cols-1"
  return (
    <section className="card-maraya p-5 sm:p-6 space-y-4">
      <header className="flex items-start gap-3">
        {Icon && (
          <span className="w-10 h-10 rounded-full bg-pink-light text-pink-deep flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </span>
        )}
        <div>
          <h2 className="font-display !text-text-dark text-lg leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-text-mid mt-0.5">{description}</p>
          )}
        </div>
      </header>

      <div className={`grid grid-cols-1 ${gridClass} gap-4`}>{children}</div>
    </section>
  )
}
