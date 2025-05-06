import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'sdmntprwestus.oaiusercontent.com',
      },
    ],
  },
  transpilePackages: ['@gentleduck/registry-ui-duckui', '@gentleduck/registry-examples-duckui'],
}

export default nextConfig
