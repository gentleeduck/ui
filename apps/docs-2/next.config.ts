import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@duck/registry-ui-duckui',
    '@duck/registry-examples-duckui',
  ],
}

export default nextConfig
