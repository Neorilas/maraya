import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Build standalone para que el contenedor Docker sea pequeño y autocontenido
  output: "standalone",
  images: {
    // Permite cualquier host HTTPS mientras estamos prototipando.
    // Cuando se conecte Hetzner S3, restringir a ese hostname concreto.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
}

export default nextConfig
