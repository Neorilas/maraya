import { prisma } from "@/lib/prisma"
import { TrustBadgesEditor } from "@/components/admin/content/TrustBadgesEditor"
import { CollectionsEditor } from "@/components/admin/content/CollectionsEditor"
import { MenuItemsEditor } from "@/components/admin/content/MenuItemsEditor"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Contenido web · Maraya Admin",
  robots: { index: false, follow: false },
}

export default async function ContenidoPage() {
  const [badges, collections, menuItems] = await Promise.all([
    prisma.trustBadge.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.homeCollection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.menuItem.findMany({ orderBy: { sortOrder: "asc" } }),
  ])

  return (
    <div className="space-y-10 max-w-5xl">
      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">
          Contenido web
        </h1>
        <p className="text-text-mid mt-1 text-sm">
          Menú, trust badges y colecciones del home. Datos de tienda y claves Stripe en{" "}
          <a href="/admin/configuracion" className="font-bold text-pink-deep underline">
            Configuración
          </a>
          .
        </p>
      </header>

      <MenuItemsEditor items={menuItems} />
      <TrustBadgesEditor badges={badges} />
      <CollectionsEditor collections={collections} />
    </div>
  )
}
