import type { ComponentType } from "react"
import { cn } from "@/lib/cn"

export type StatsCardProps = {
  label: string
  value: string | number
  hint?: string
  icon: ComponentType<{ className?: string }>
  /** Estética del icono. */
  tone?: "pink" | "teal" | "gold" | "alert"
}

const TONE_BG: Record<NonNullable<StatsCardProps["tone"]>, string> = {
  pink: "bg-pink-light text-pink-deep",
  teal: "bg-teal-light text-teal-primary",
  gold: "bg-gold-light text-gold",
  alert: "bg-red-50 text-red-600",
}

export function StatsCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "pink",
}: StatsCardProps) {
  return (
    <div className="card-maraya p-5 flex items-start gap-4">
      <span
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center shrink-0",
          TONE_BG[tone],
        )}
      >
        <Icon className="w-5 h-5" />
      </span>

      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-text-mid">
          {label}
        </div>
        <div className="font-display !text-text-dark text-2xl sm:text-3xl mt-0.5">
          {value}
        </div>
        {hint && <div className="text-xs text-text-mid mt-1">{hint}</div>}
      </div>
    </div>
  )
}
