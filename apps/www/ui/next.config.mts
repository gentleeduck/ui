import { createContentlayerPlugin } from 'next-contentlayer2'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'uploads.codesandbox.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  redirects() {
    return []
  },
}

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
})

export default withContentlayer(nextConfig)
