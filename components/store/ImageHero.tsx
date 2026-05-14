import Image from "next/image"
import Link from "next/link"

interface ImageHeroProps {
  src: string
  mobileSrc: string
  alt: string
  width: number
  height: number
  mobileWidth: number
  mobileHeight: number
  href?: string
  priority?: boolean
}

export function ImageHero({
  src,
  mobileSrc,
  alt,
  width,
  height,
  mobileWidth,
  mobileHeight,
  href,
  priority = false,
}: ImageHeroProps) {
  const inner = (
    <>
      <Image
        src={mobileSrc}
        alt={alt}
        width={mobileWidth}
        height={mobileHeight}
        priority={priority}
        className="sm:hidden w-full h-auto"
        sizes="100vw"
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="hidden sm:block w-full h-auto"
        sizes="100vw"
      />
    </>
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
