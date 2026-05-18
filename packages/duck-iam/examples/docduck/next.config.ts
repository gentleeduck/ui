import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@gentleduck/iam',
    '@gentleduck/primitives',
    '@gentleduck/libs',
    '@gentleduck/variants',
    '@gentleduck/hooks',
  ],
}

export default nextConfig
