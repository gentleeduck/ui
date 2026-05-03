import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.join(currentDir, '../..')

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: monorepoRoot,
  // Trim what the @netlify/plugin-nextjs serverless function ships so it
  // stays under the 250 MB Lambda limit. Anything not actually imported by
  // the runtime route handlers gets excluded from file tracing.
  outputFileTracingExcludes: {
    '*': [
      '**/node_modules/@swc/core-linux-x64-gnu/**',
      '**/node_modules/@swc/core-linux-x64-musl/**',
      '**/node_modules/@esbuild/**',
      '**/node_modules/esbuild/**',
      '**/node_modules/typescript/**',
      '**/node_modules/webpack/**',
      '**/node_modules/terser/**',
      '**/node_modules/@biomejs/**',
      '**/node_modules/sherif/**',
      '**/node_modules/turbo/**',
      '**/node_modules/velite/**',
      '**/node_modules/shiki/**',
      '**/node_modules/@shikijs/**',
      '**/node_modules/rehype-*/**',
      '**/node_modules/remark-*/**',
      '**/node_modules/puppeteer/**',
      '**/.next/cache/**',
      '**/packages/_oldstuff_refactor/**',
      '**/packages/wip/**',
      '**/packages/deprecated/**',
      '**/apps/benchmark/**',
      '**/apps/duck-extension/**',
    ],
  },
  turbopack: {
    root: monorepoRoot,
  },
  allowedDevOrigins: ['192.168.1.36'],
  experimental: {
    externalDir: true,
    // Cap parallel page-data workers. The docs site holds ~93 MB of
    // pre-tokenized MDX in memory per worker, so 31 default forks blow past
    // the 8 GB Netlify build sandbox and SIGKILL.
    cpus: 4,
    workerThreads: false,
    // swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  productionBrowserSourceMaps: false,
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
