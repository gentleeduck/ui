import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'core/index': 'src/core/index.ts',

    // Adapters
    'adapters/memory/index': 'src/adapters/memory/index.ts',
    'adapters/prisma/index': 'src/adapters/prisma/index.ts',
    'adapters/drizzle/index': 'src/adapters/drizzle/index.ts',
    'adapters/http/index': 'src/adapters/http/index.ts',

    // Server
    'server/express/index': 'src/server/express/index.ts',
    'server/nest/index': 'src/server/nest/index.ts',
    'server/hono/index': 'src/server/hono/index.ts',
    'server/next/index': 'src/server/next/index.ts',
    'server/generic/index': 'src/server/generic/index.ts',

    // Client
    'client/react/index': 'src/client/react/index.ts',
    'client/vue/index': 'src/client/vue/index.ts',
    'client/vanilla/index': 'src/client/vanilla/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: false,
  sourcemap: true,
  treeshake: true,
  outDir: './dist',
  platform: 'neutral',
  target: 'esnext',
  external: [
    'react',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'vue',
    '@prisma/client',
    'drizzle-orm',
    'hono',
    '@nestjs/common',
    '@nestjs/core',
    'express',
    'next',
    'next/server',
  ],
})
