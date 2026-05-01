/**
 * Estrella/chispa decorativa estilo "sparkle". Cuatro puntas + halo.
 */
export function Sparkle({
  size = 24,
  color = "#FEF9C3",
  className = "",
}: {
  size?: number
  color?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <path
        d="M 12 2 L 13.2 10.8 L 22 12 L 13.2 13.2 L 12 22 L 10.8 13.2 L 2 12 L 10.8 10.8 Z"
        fill={color}
      />
    </svg>
  )
}

type SparklePos = {
  top?: string
  left?: string
  right?: string
  bottom?: string
  size?: number
  rotate?: number
  opacity?: number
  color?: string
}

/** Capa de sparkles posicionados absolutamente dentro del padre. */
export function SparkleField({ items }: { items: SparklePos[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            transform: `rotate(${p.rotate ?? 0}deg)`,
            opacity: p.opacity ?? 0.8,
          }}
        >
          <Sparkle size={p.size ?? 18} color={p.color ?? "#FEF9C3"} />
        </span>
      ))}
    </div>
  )
}
