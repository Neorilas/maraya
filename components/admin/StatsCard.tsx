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
    <div className="card-maraya p-3 sm:p-5 flex items-start gap-2.5 sm:gap-4">
      <span
        className={cn(
          "w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0",
          TONE_BG[tone],
        )}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </span>

      <div className="min-w-0">
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-text-mid leading-tight">
          {label}
        </div>
        <div className="font-display !text-text-dark text-lg sm:text-2xl lg:text-3xl mt-0.5 leading-tight">
          {value}
        </div>
        {hint && (
          <div className="text-[10px] sm:text-xs text-text-mid mt-1 hidden sm:block">
            {hint}
          </div>
        )}
      </div>
    </div>
  )
}
