import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
  transpilePackages: [
    '@gentelduck/registry-ui-duckui',
    '@gentelduck/registry-examples-duckui',
  ],
}

export default nextConfig
