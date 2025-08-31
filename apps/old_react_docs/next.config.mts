import { createContentlayerPlugin } from 'next-contentlayer2'
import { fileURLToPath } from 'node:url'
import createJiti from 'jiti'

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))('./src/env')

/** @type {import("next").NextConfig} */
const config: import('next').NextConfig = {
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
  // redirects() {
  //     return []
  // },
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    '@gentleduck/validators',
    '@gentleduck/registry-ui-duckui',
    '@gentleduck/registry-examples-duckui',
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
})

export default withContentlayer(config)
