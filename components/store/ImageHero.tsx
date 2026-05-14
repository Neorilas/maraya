import Image from "next/image"
import Link from "next/link"

interface ImageHeroProps {
  src: string
  alt: string
  href?: string
  priority?: boolean
  /** CSS object-position — controls which part of the image is visible on mobile crop */
  objectPosition?: string
}

export function ImageHero({
  src,
  alt,
  href,
  priority = false,
  objectPosition = "center",
}: ImageHeroProps) {
  const inner = (
    <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        style={{ objectPosition }}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
    </div>
  )

  return (
    <section className="relative w-full overflow-hidden">
      {href ? (
        <Link href={href} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </section>
  )
}
