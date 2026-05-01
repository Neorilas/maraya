/**
 * Esquina decorativa dorada estilo barroco. Sirve para sugerir el "marco
 * dorado" sobre paneles enteros (hero, secciones) sin dibujar el marco
 * completo. Cuatro variantes según esquina.
 */
type Corner = "tl" | "tr" | "bl" | "br"

const ROTATION: Record<Corner, string> = {
  tl: "0deg",
  tr: "90deg",
  br: "180deg",
  bl: "270deg",
}

export function GoldCornerOrnament({
  corner,
  size = 80,
  className = "",
}: {
  corner: Corner
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ transform: `rotate(${ROTATION[corner]})` }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`gold-${corner}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A57F22" />
        </linearGradient>
      </defs>
      {/* Voluta principal */}
      <path
        d="M 0 8 L 30 8 Q 18 8 14 14 Q 8 22 8 30 L 8 60 Q 4 70 0 60 Z"
        fill={`url(#gold-${corner})`}
        stroke="#A57F22"
        strokeWidth="0.6"
      />
      {/* Hojita interior */}
      <path
        d="M 16 16 Q 24 14 30 18 Q 22 22 18 28 Q 14 22 16 16 Z"
        fill={`url(#gold-${corner})`}
        opacity="0.85"
      />
      {/* Punto pequeño */}
      <circle cx="11" cy="40" r="2" fill="#FEF9C3" />
      <circle cx="40" cy="11" r="2" fill="#FEF9C3" />
    </svg>
  )
}

/** Las 4 esquinas a la vez, posicionadas absolutas dentro del padre. */
export function GoldCorners({ size = 80 }: { size?: number }) {
  return (
    <>
      <GoldCornerOrnament corner="tl" size={size} className="absolute top-2 left-2 pointer-events-none" />
      <GoldCornerOrnament corner="tr" size={size} className="absolute top-2 right-2 pointer-events-none" />
      <GoldCornerOrnament corner="bl" size={size} className="absolute bottom-2 left-2 pointer-events-none" />
      <GoldCornerOrnament corner="br" size={size} className="absolute bottom-2 right-2 pointer-events-none" />
    </>
  )
}
