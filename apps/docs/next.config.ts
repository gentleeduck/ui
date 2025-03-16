import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@gentelduck/registry-ui-duckui',
    '@gentelduck/registry-examples-duckui',
  ],
}

export default nextConfig
