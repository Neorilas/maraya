/**
 * Hoja tropical decorativa (tipo Monstera). SVG reutilizable, varía color y rotación.
 * Para los detalles laterales del hero a lo Maraya.
 */
export function TropicalLeaf({
  className = "",
  rotate = 0,
  color = "#2DD4BF",
  size = 160,
}: {
  className?: string
  rotate?: number
  color?: string
  size?: number
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`leaf-${rotate}-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* Cuerpo de la hoja */}
      <path
        d="M 50 95 Q 30 78 22 60 Q 12 40 18 22 Q 30 8 50 10 Q 70 8 82 22 Q 88 40 78 60 Q 70 78 50 95 Z"
        fill={`url(#leaf-${rotate}-${color.replace(/[^a-z0-9]/gi, "")})`}
      />
      {/* Recortes característicos de Monstera */}
      <path d="M 20 25 Q 30 35 32 50 L 22 52 Q 20 38 16 28 Z" fill="white" opacity="0.95" />
      <path d="M 20 60 Q 32 65 36 78 L 24 80 Q 20 70 17 62 Z" fill="white" opacity="0.95" />
      <path d="M 80 25 Q 70 35 68 50 L 78 52 Q 80 38 84 28 Z" fill="white" opacity="0.95" />
      <path d="M 80 60 Q 68 65 64 78 L 76 80 Q 80 70 83 62 Z" fill="white" opacity="0.95" />
      {/* Vena central */}
      <path d="M 50 12 L 50 92" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
    </svg>
  )
}
