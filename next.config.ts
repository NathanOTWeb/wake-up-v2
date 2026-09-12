import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // content/**/*.json is read at runtime via fs.readFileSync (lib/tina.ts),
  // not imported, so Next's file tracer can't discover it on its own and
  // Vercel's serverless bundle ships without it -- readLocalJson() then
  // throws ENOENT in production (silently caught, hero renders blank).
  outputFileTracingIncludes: {
    '/': ['./content/**/*.json'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tina.io',
        port: '',
      },
    ],
  },
};

export default nextConfig;