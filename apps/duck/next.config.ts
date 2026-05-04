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
      // Build-time toolchains never run at request time.
      '**/node_modules/@swc/core-linux-x64-gnu/**',
      '**/node_modules/@swc/core-linux-x64-musl/**',
      '**/node_modules/@swc/core-darwin-*/**',
      '**/node_modules/@swc/core-win32-*/**',
      '**/node_modules/@esbuild/**',
      '**/node_modules/esbuild/**',
      '**/node_modules/typescript/**',
      '**/node_modules/webpack/**',
      '**/node_modules/webpack-*/**',
      '**/node_modules/terser/**',
      '**/node_modules/@biomejs/**',
      '**/node_modules/sherif/**',
      '**/node_modules/turbo/**',
      '**/node_modules/turbo-*/**',
      '**/node_modules/velite/**',
      '**/node_modules/shiki/**',
      '**/node_modules/@shikijs/**',
      '**/node_modules/rehype-*/**',
      '**/node_modules/remark-*/**',
      '**/node_modules/unified/**',
      '**/node_modules/mdast-util-*/**',
      '**/node_modules/hast-util-*/**',
      '**/node_modules/@mdx-js/**',
      '**/node_modules/puppeteer/**',
      '**/node_modules/puppeteer-*/**',
      '**/node_modules/@puppeteer/**',
      '**/node_modules/sharp/**',
      '**/node_modules/canvas/**',
      // 3D/animation libs that no app/component code imports.
      '**/node_modules/three/**',
      '**/node_modules/@splinetool/**',
      '**/node_modules/@rive-app/**',
      '**/node_modules/@google/generative-ai/**',
      // Heavy client-only libraries that should never end up in the
      // server bundle. They are still served as static assets to the
      // browser via the per-page chunks.
      '**/node_modules/recharts/**',
      '**/node_modules/three-stdlib/**',
      '**/node_modules/lucide-react/dist/cjs/**',
      // Source registries that are transpiled into the build output.
      '**/packages/registry-blocks/**',
      '**/packages/registry-examples/**',
      '**/packages/registry-internals/**',
      '**/packages/registry-ui/**',
      // Test files that occasionally land in the trace.
      '**/__test__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      // Build caches and workspace dirs that aren't shipped.
      '**/.next/cache/**',
      // The velite collections are already inlined into webpack chunks
      // (`with { type: 'json' }`); the raw JSON is a duplicate.
      '**/.velite/*.json',
      '**/.velite/index.js.map',
      '**/packages/_oldstuff_refactor/**',
      '**/packages/wip/**',
      '**/packages/deprecated/**',
      '**/apps/benchmark/**',
      '**/apps/duck-extension/**',
    ],
  },
  // Keep these packages external in the server bundle so they load from
  // node_modules at request time instead of being inlined into the Lambda
  // by Webpack.
  serverExternalPackages: ['@modelcontextprotocol/sdk', 'lunr', 'puppeteer'],
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
    // Inline ALL CSS directly into the HTML. Removes the
    // render-blocking <link rel="stylesheet"> tags Lighthouse flags.
    // Trade-off: per-page HTML grows by the size of the route's CSS;
    // acceptable for a docs site that already pre-renders every page.
    inlineCss: true,
    // Rewrite barrel imports for these packages so Next ships only the
    // referenced symbols. Cuts the "unused JavaScript" Lighthouse hit
    // on the shared chunks (lucide alone is ~30 KB unused per route).
    optimizePackageImports: [
      'lucide-react',
      'jotai',
      'jotai/utils',
      'motion',
      'motion/react',
      '@tanstack/react-table',
      '@tanstack/react-virtual',
      'recharts',
      'date-fns',
      'culori',
      'next-themes',
      'sonner',
      'react-resizable-panels',
      'react-markdown',
      '@gentleduck/hooks',
    ],
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
        destination: '/duck-ui/components',
        permanent: true,
        source: '/components',
      },
      {
        destination: '/duck-ui/components/:path*',
        permanent: true,
        source: '/docs/primitives/:path*',
      },
      {
        destination: '/duck-ui/components/:path*',
        permanent: true,
        source: '/docs/components/:path*',
      },
      {
        destination: '/duck-ui/components',
        permanent: true,
        source: '/docs/components',
      },
      {
        destination: '/duck-ui/installation/:path*',
        permanent: true,
        source: '/docs/installation/:path*',
      },
      {
        destination: '/duck-ui/installation',
        permanent: true,
        source: '/docs/installation',
      },
      {
        destination: '/duck-ui/theming',
        permanent: true,
        source: '/docs/theming',
      },
      {
        destination: '/duck-ui/javascript',
        permanent: true,
        source: '/docs/javascript',
      },
      {
        destination: '/www/:path*',
        permanent: true,
        source: '/docs/:path*',
      },
      {
        destination: '/www',
        permanent: true,
        source: '/docs',
      },
      {
        destination: '/duck-ui/components/react-hook-form',
        permanent: false,
        source: '/forms',
      },
      {
        destination: '/duck-ui/components/react-hook-form',
        permanent: false,
        source: '/forms/react-hook-form',
      },
      {
        destination: '/duck-ui/components/sidebar',
        permanent: true,
        source: '/sidebar',
      },
      {
        destination: '/duck-ui/javascript',
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
        destination: '/:path*.md',
        permanent: true,
        source: '/:path*.mdx',
      },
    ]
  },
  rewrites: async () => {
    return [
      // Any *.md URL (e.g. /duck-ui/components/calendar.md) serves the
      // pre-rendered markdown source via the /llm/[...slug] route. Used
      // by the "View as Markdown" item in the Copy Page dropdown.
      {
        source: '/:path*.md',
        destination: '/llm/:path*',
      },
    ]
  },
  transpilePackages: ['@gentleduck/registry-ui', '@gentleduck/registry-examples', '@gentleduck/registry-blocks'],
}

export default nextConfig
