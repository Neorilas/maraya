import { prisma } from "@/lib/prisma"
import { TrustBadgesEditor } from "@/components/admin/content/TrustBadgesEditor"
import { CollectionsEditor } from "@/components/admin/content/CollectionsEditor"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Contenido web · Maraya Admin",
  robots: { index: false, follow: false },
}

export default async function ContenidoPage() {
  const [badges, collections] = await Promise.all([
    prisma.trustBadge.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.homeCollection.findMany({ orderBy: { sortOrder: "asc" } }),
  ])

  return (
    <div className="space-y-10 max-w-5xl">
      <header>
        <h1 className="font-display italic text-3xl !text-text-dark">
          Contenido web
        </h1>
        <p className="text-text-mid mt-1 text-sm">
          Trust badges y colecciones del home. Para textos y CTAs ve a{" "}
          <a href="/admin/configuracion" className="font-bold text-pink-deep underline">
            Configuración
          </a>
          .
        </p>
      </header>

      <TrustBadgesEditor badges={badges} />
      <CollectionsEditor collections={collections} />
    </div>
  )
}
