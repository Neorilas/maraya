import type { ComponentType } from "react"
import { Construction } from "lucide-react"

/**
 * Placeholder consistente para las secciones del admin que aún no implementamos.
 * Se sustituye en su Step correspondiente.
 */
export function PlaceholderPage({
  title,
  description,
  icon: Icon = Construction,
  step,
}: {
  title: string
  description: string
  icon?: ComponentType<{ className?: string }>
  step: string
}) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">{title}</h1>
        <p className="text-text-mid mt-1 text-sm">{description}</p>
      </header>

      <div className="card-maraya gold-border p-10 text-center max-w-xl mx-auto">
        <div className="mx-auto w-14 h-14 rounded-full bg-gold-light flex items-center justify-center text-gold mb-4">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="font-display !text-text-dark text-xl">
          En construcción
        </h2>
        <p className="text-sm text-text-mid mt-2">
          Esta sección se monta en{" "}
          <span className="font-bold text-pink-deep">{step}</span> del plan.
        </p>
      </div>
    </div>
  )
}
