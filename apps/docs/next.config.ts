import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@gentelduck/registry-ui-duckui',
    '@gentelduck/registry-examples-duckui',
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
    ],
  },
}

export default nextConfig
