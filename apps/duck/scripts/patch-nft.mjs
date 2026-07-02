#!/usr/bin/env node
/**
 * Patch .nft.json files to remove build-time-only packages that are never
 * called at Lambda request time, keeping the Netlify function under 250 MB.
 *
 * `outputFileTracingExcludes` in next.config.ts is a no-op unless
 * `output: 'standalone'` is set — which Netlify does NOT use. This script
 * replicates those exclusions by patching the .nft.json files directly.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const nextDir = join(__dirname, '../.next')

// Packages that only run at build time and are safe to drop from the Lambda.
// Mirrors the `outputFileTracingExcludes` list in next.config.ts.
const BUILD_TIME_ONLY = [
  // Image processing — Netlify CDN handles /_next/image; next/og uses resvg-wasm
  '/@img/',
  '/node_modules/@img',
  '.bun/@img+',
  '/node_modules/sharp/',
  '.bun/sharp+',
  // TypeScript AST parser — only used in force-static blocks/charts pages
  '/@ts-morph/',
  '/ts-morph/',
  '.bun/@ts-morph+',
  '.bun/ts-morph+',
  // Syntax highlighting — all highlighted pages are force-static
  '/node_modules/shiki/',
  '/node_modules/@shikijs/',
  '.bun/shiki+',
  '.bun/@shikijs+',
  // MDX / unified toolchain — only runs during next build
  '/node_modules/unified/',
  '/node_modules/remark/',
  '/node_modules/remark-',
  '/node_modules/rehype/',
  '/node_modules/rehype-',
  '/node_modules/mdast-util-',
  '/node_modules/hast-util-',
  '/node_modules/@mdx-js/',
  '/node_modules/micromark',
  '/node_modules/micromark-',
  '/node_modules/vfile',
  '/node_modules/vfile-',
  // Mermaid + heavy graph/chart deps — rendered to PNG at build time via Puppeteer
  '/node_modules/mermaid/',
  '/node_modules/@mermaid-js/',
  '/node_modules/d3/',
  '/node_modules/d3-',
  '/node_modules/dagre-d3-es/',
  '/node_modules/cytoscape/',
  '/node_modules/cytoscape-',
  '/node_modules/roughjs/',
  '/node_modules/khroma/',
  '/node_modules/katex/',
  // Puppeteer / headless Chrome
  '/node_modules/puppeteer/',
  '/node_modules/puppeteer-',
  '/node_modules/@puppeteer/',
  // Build toolchains
  '/node_modules/@swc/',
  '/node_modules/esbuild/',
  '/node_modules/webpack/',
  '/node_modules/webpack-',
  '/node_modules/terser/',
  '/node_modules/typescript/',
  '/node_modules/@biomejs/',
  '/node_modules/turbo/',
  '/node_modules/velite/',
  // PostCSS / CSS pipeline — build time only
  '/node_modules/postcss/',
  '/node_modules/critters/',
  // gentleduck build-time packages (~95 MB of prebuilt .node binaries)
  '/node_modules/@gentleduck/md/',
  '.bun/@gentleduck+md+',
  // Source registries — transpiled into build output
  '/packages/registry-blocks/',
  '/packages/registry-examples/',
  '/packages/registry-internals/',
  '/packages/registry-ui/',
  '/packages/deprecated/',
  '/packages/wip/',
]

const isExcluded = (p) => BUILD_TIME_ONLY.some((needle) => p.includes(needle))

async function* walkNft(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walkNft(full)
    else if (entry.name.endsWith('.nft.json')) yield full
  }
}

let totalRemoved = 0
let filesPatched = 0

for await (const f of walkNft(nextDir)) {
  const data = JSON.parse(await readFile(f, 'utf8'))
  const before = data.files.length
  data.files = data.files.filter((p) => !isExcluded(p))
  const removed = before - data.files.length
  if (removed > 0) {
    await writeFile(f, JSON.stringify(data))
    console.log(`[patch-nft] ${relative(nextDir, f)}: -${removed} entries`)
    totalRemoved += removed
    filesPatched++
  }
}

console.log(`[patch-nft] patched ${filesPatched} files, removed ${totalRemoved} entries total`)
