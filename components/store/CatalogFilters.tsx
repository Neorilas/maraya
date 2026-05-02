import Link from "next/link"
import { SlidersHorizontal, ChevronDown } from "lucide-react"
import { cn } from "@/lib/cn"

type CategoryOption = { slug: string; label: string }

type Props = {
  categories: CategoryOption[]
  active: { cat?: string; filter?: string; sort?: string }
}

const QUICK_FILTERS = [
  { value: "",     label: "Todo" },
  { value: "new",  label: "Novedades" },
  { value: "top",  label: "Best sellers" },
  { value: "sale", label: "Ofertas" },
]

const SORT_OPTIONS = [
  { value: "newest",     label: "Más nuevos" },
  { value: "price-asc",  label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
]

export function CatalogFilters({ categories, active }: Props) {
  // Cuenta filtros activos (excluyendo el sort por defecto)
  const activeCount =
    (active.filter ? 1 : 0) +
    (active.cat ? 1 : 0) +
    (active.sort && active.sort !== "newest" ? 1 : 0)

  return (
    <>
      {/* Móvil: filtros colapsables como <details> */}
      <details className="lg:hidden card-maraya">
        <summary className="px-4 py-3 cursor-pointer flex items-center justify-between gap-3 list-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 font-semibold text-text-dark">
            <SlidersHorizontal className="w-4 h-4 text-pink-deep" />
            Filtros y orden
            {activeCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-pink-primary text-white text-[10px] font-bold">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown className="w-4 h-4 text-text-mid transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4 pt-2 border-t border-pink-light space-y-5">
          <FiltersBody categories={categories} active={active} />
        </div>
      </details>

      {/* Desktop: sidebar fijo */}
      <aside className="hidden lg:block space-y-6">
        <FiltersBody categories={categories} active={active} />
      </aside>
    </>
  )
}

function FiltersBody({ categories, active }: Props) {
  return (
    <>
      <FilterGroup title="Mostrar">
        {QUICK_FILTERS.map((f) => (
          <FilterChip
            key={f.value}
            href={hrefWith(active, { filter: f.value || undefined })}
            active={(active.filter ?? "") === f.value}
            label={f.label}
          />
        ))}
      </FilterGroup>

      {categories.length > 0 && (
        <FilterGroup title="Categoría">
          <FilterChip
            href={hrefWith(active, { cat: undefined })}
            active={!active.cat}
            label="Todas"
          />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              href={hrefWith(active, { cat: c.slug })}
              active={active.cat === c.slug}
              label={c.label}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Ordenar por">
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((s) => (
            <Link
              key={s.value}
              href={hrefWith(active, { sort: s.value })}
              className={cn(
                "block px-3 py-1.5 rounded-full text-sm transition",
                (active.sort ?? "newest") === s.value
                  ? "bg-pink-light text-pink-deep font-bold"
                  : "text-text-mid hover:bg-pink-light/50 hover:text-pink-deep",
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </FilterGroup>
    </>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-wider text-text-mid mb-3">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </section>
  )
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex px-3 py-1.5 rounded-full text-xs font-semibold transition",
        active
          ? "bg-pink-primary text-white"
          : "bg-pink-light/50 text-text-dark hover:bg-pink-light",
      )}
    >
      {label}
    </Link>
  )
}

function hrefWith(
  active: { cat?: string; filter?: string; sort?: string },
  patch: { cat?: string; filter?: string; sort?: string },
): string {
  const merged = { ...active, ...patch }
  const params = new URLSearchParams()
  if (merged.cat)    params.set("cat", merged.cat)
  if (merged.filter) params.set("filter", merged.filter)
  if (merged.sort)   params.set("sort", merged.sort)
  const qs = params.toString()
  return qs ? `/bolsos?${qs}` : "/bolsos"
}
