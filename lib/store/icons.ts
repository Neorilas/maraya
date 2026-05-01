import {
  Truck, ShieldCheck, Sparkles, Gift, Crown, Heart, Star,
  Award, Package, Leaf, Flame, Diamond, Smile, Tag, Zap,
} from "lucide-react"
import type { ComponentType } from "react"

/**
 * Mapa de nombres → componentes para iconos editables desde admin.
 * Allowlist intencional: solo los que la editora puede elegir desde el panel.
 * Para añadir más, importa el icono y añádelo aquí.
 */
export const STORE_ICON_MAP: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  Truck,
  ShieldCheck,
  Sparkles,
  Gift,
  Crown,
  Heart,
  Star,
  Award,
  Package,
  Leaf,
  Flame,
  Diamond,
  Smile,
  Tag,
  Zap,
}

/** Lista de pares [valor, etiqueta] para selectores en admin. */
export const STORE_ICON_OPTIONS = Object.keys(STORE_ICON_MAP).map((name) => ({
  value: name,
  label: name,
}))

/** Devuelve el componente; si no se encuentra, fallback a Sparkles. */
export function getStoreIcon(name: string) {
  return STORE_ICON_MAP[name] ?? Sparkles
}
