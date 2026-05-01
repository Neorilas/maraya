/** Ilustración SVG estilizada del bolso "Maraya". Fallback cuando no hay imagen real. */
export function BagIllustration() {
  return (
    <div className="relative mx-auto max-w-md aspect-square">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-[0_20px_40px_rgba(244,114,182,0.35)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="bag-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="bag-accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <radialGradient id="bag-shine" cx="0.3" cy="0.3" r="0.6">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <path
          d="M 130 130 Q 200 40 270 130"
          fill="none"
          stroke="url(#bag-accent)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 130 130 Q 200 40 270 130"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <rect
          x="80"
          y="125"
          width="240"
          height="220"
          rx="28"
          fill="url(#bag-body)"
          stroke="#D4AF37"
          strokeWidth="3"
        />
        <rect x="80" y="125" width="240" height="220" rx="28" fill="url(#bag-shine)" />

        <rect x="180" y="180" width="40" height="60" rx="6" fill="url(#bag-accent)" />
        <rect x="186" y="200" width="28" height="6" rx="2" fill="#1F1F1F" opacity="0.4" />
        <circle cx="200" cy="220" r="4" fill="#1F1F1F" opacity="0.5" />

        <path
          d="M 100 145 L 300 145"
          stroke="#FEF9C3"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.7"
        />
        <path
          d="M 100 325 L 300 325"
          stroke="#FEF9C3"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.7"
        />

        <text
          x="200"
          y="305"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="18"
          fontStyle="italic"
          fill="#FEF9C3"
          fontWeight="bold"
        >
          Maraya
        </text>
      </svg>
    </div>
  )
}
