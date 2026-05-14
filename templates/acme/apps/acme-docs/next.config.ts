import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.join(currentDir, '../..')

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
        protocol: 'https',
      },
      {
        hostname: 'zpgqhogoevbgpxustvmo.supabase.co',
        protocol: 'https',
      },
      {
        hostname: 'media.discordapp.net',
        protocol: 'https',
      },
      {
        hostname: 'images.unsplash.com',
        protocol: 'https',
      },
      {
        hostname: 'images.pexels.com',
        protocol: 'https',
      },
      {
        hostname: 'plus.unsplash.com',
        protocol: 'https',
      },
      {
        hostname: 'github.com',
        protocol: 'https',
      },
      {
        hostname: 'raw.githubusercontent.com',
        protocol: 'https',
      },
    ],
  },
  reactStrictMode: false,
  redirects: async () => {
    return [
      {
        destination: '/docs/components',
        permanent: true,
        source: '/components',
      },
      {
        destination: '/docs/components/:path*',
        permanent: true,
        source: '/docs/primitives/:path*',
      },
      {
        destination: '/docs/components/react-hook-form',
        permanent: false,
        source: '/docs/forms',
      },
      {
        destination: '/docs/components/react-hook-form',
        permanent: false,
        source: '/docs/forms/react-hook-form',
      },
      {
        destination: '/docs/components/sidebar',
        permanent: true,
        source: '/sidebar',
      },
      {
        destination: '/docs/javascript',
        permanent: true,
        source: '/react-19',
      },
      {
        destination: '/charts/area',
        permanent: true,
        source: '/charts',
      },
      {
        destination: '/view/:name',
        permanent: true,
        source: '/view/styles/:style/:name',
      },
      {
        destination: '/docs/:path*.md',
        permanent: true,
        source: '/docs/:path*.mdx',
      },
      {
        destination: '/api/mcp',
        permanent: false,
        source: '/mcp',
      },
    ]
  },
  rewrites: async () => {
    return [
      {
        source: '/docs/:path*.md',
        destination: '/llm/:path*',
      },
    ]
  },
  transpilePackages: ['@gentleduck/registry-ui', '@gentleduck/registry-examples', '@gentleduck/registry-blocks'],
}

export default nextConfig
