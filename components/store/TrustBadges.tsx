import { getActiveTrustBadges } from "@/lib/store/content"
import { getStoreIcon } from "@/lib/store/icons"

export async function TrustBadges() {
  const badges = await getActiveTrustBadges()
  if (badges.length === 0) return null

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {badges.map((b) => {
          const Icon = getStoreIcon(b.icon)
          return (
            <div
              key={b.id}
              className="flex flex-col items-center text-center gap-3 p-4"
            >
              <div className="w-16 h-16 rounded-full bg-pink-light flex items-center justify-center text-pink-deep border-2 border-gold/40 shadow-[0_4px_14px_rgba(212,175,55,0.18)]">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg sm:text-xl !text-text-dark mt-1">
                {b.title}
              </h3>
              <p className="text-sm text-text-mid">{b.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
