import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  transpilePackages: [
    '@gentleduck/registry-ui-duckui',
    '@gentleduck/registry-examples-duckui',
    '@gentleduck/registry-blocks-duckui',
    '@gentleduck/variants',
    '@gentleduck/motion',
    '@gentleduck/primitives',
    '@gentleduck/libs',
    '@gentleduck/hooks',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zpgqhogoevbgpxustvmo.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'media.discordapp.net', // Add this line for Discord images
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Add this line for Discord images
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/components',
        destination: '/docs/components',
        permanent: true,
      },
      {
        source: '/docs/primitives/:path*',
        destination: '/docs/components/:path*',
        permanent: true,
      },
      {
        source: '/docs/forms',
        destination: '/docs/components/react-hook-form',
        permanent: false,
      },
      {
        source: '/docs/forms/react-hook-form',
        destination: '/docs/components/form',
        permanent: false,
      },
      {
        source: '/sidebar',
        destination: '/docs/components/sidebar',
        permanent: true,
      },
      {
        source: '/react-19',
        destination: '/docs/react-19',
        permanent: true,
      },
      {
        source: '/charts',
        destination: '/charts/area',
        permanent: true,
      },
      {
        source: '/view/styles/:style/:name',
        destination: '/view/:name',
        permanent: true,
      },
      {
        source: '/docs/:path*.mdx',
        destination: '/docs/:path*.md',
        permanent: true,
      },
      {
        source: '/mcp',
        destination: '/docs/mcp',
        permanent: false,
      },
    ]
  },
  // rewrites: async () => {
  //   return [
  //     {
  //       source: '/docs/:path*.md',
  //       destination: '/llm/:path*',
  //     },
  //   ]
  // },
}

export default nextConfig
