import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
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
        hostname: 'media.discordapp.net', // Add this line for Discord images
        protocol: 'https',
      },
      {
        hostname: 'images.unsplash.com', // Add this line for Discord images
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
        destination: '/docs/components/form',
        permanent: false,
        source: '/docs/forms/react-hook-form',
      },
      {
        destination: '/docs/components/sidebar',
        permanent: true,
        source: '/sidebar',
      },
      {
        destination: '/docs/react-19',
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
        destination: '/docs/mcp',
        permanent: false,
        source: '/mcp',
      },
    ]
  },
  transpilePackages: [
    '@gentleduck/registry-ui-duckui',
    '@gentleduck/registry-examples-duckui',
    '@gentleduck/registry-blocks-duckui',
    '@gentleduck/docs',
  ],
  typescript: {},
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
