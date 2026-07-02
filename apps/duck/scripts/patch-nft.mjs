#!/usr/bin/env node
/**
 * Patch .nft.json files and clean up the standalone output to remove
 * build-time-only packages, keeping the Netlify Lambda under 250 MB.
 *
 * Why this script exists
 * ──────────────────────
 * @netlify/plugin-nextjs enables `output: 'standalone'` in its preBuild hook.
 * `next build` then creates `.next/standalone/` with all node_modules referenced
 * by the .nft.json files — before this script has a chance to run (postbuild).
 * The plugin's postBuild copies physical files from the standalone directory
 * into `.netlify/functions-internal/`, IGNORING the (already patched) .nft.json.
 *
 * To actually reduce Lambda size we must:
 *   1. Patch .nft.json files (prevents packages from being re-added on future
 *      builds when the standalone is re-created from a turbo cache hit).
 *   2. Delete excluded packages from .next/standalone/ (the physical files that
 *      the plugin copies into the Lambda).
 *   3. Remove hashed symlinks in .next/node_modules/ that point to excluded pkgs.
 */
import { readdir, readFile, readlink, rm, stat, unlink, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const nextDir = join(__dirname, '../.next')

// ─── Exclusion list ──────────────────────────────────────────────────────────
// Mirrors `outputFileTracingExcludes` in next.config.ts (which is a no-op in
// non-standalone mode). Checked as p.includes(needle) on any path string.
const BUILD_TIME_NEEDLES = [
  // Image processing — Netlify CDN handles /_next/image; next/og uses resvg-wasm
  '/@img/',
  '/node_modules/@img/',
  '/node_modules/sharp/',
  // TypeScript AST parser — only used in force-static blocks/charts pages
  '/@ts-morph/',
  '/node_modules/ts-morph/',
  '/node_modules/@ts-morph/',
  // Syntax highlighting — all highlighted pages are force-static
  '/node_modules/shiki/',
  '/node_modules/@shikijs/',
  // MDX / unified toolchain — only runs during next build
  '/node_modules/unified/',
  '/node_modules/remark/',
  '/node_modules/rehype/',
  '/node_modules/mdast-util-',
  '/node_modules/hast-util-',
  '/node_modules/@mdx-js/',
  '/node_modules/micromark',
  '/node_modules/vfile',
  // Mermaid + heavy graph/chart deps — rendered to PNG at build time via Puppeteer
  '/node_modules/mermaid/',
  '/node_modules/@mermaid-js/',
  '/node_modules/d3/',
  '/node_modules/dagre-d3-es/',
  '/node_modules/cytoscape/',
  '/node_modules/roughjs/',
  '/node_modules/khroma/',
  '/node_modules/katex/',
  // Puppeteer / headless Chrome
  '/node_modules/puppeteer/',
  '/node_modules/@puppeteer/',
  // Build toolchains
  '/node_modules/@swc/core',
  '/node_modules/esbuild/',
  '/node_modules/webpack/',
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
  // Source registries — transpiled into build output
  '/packages/registry-blocks/',
  '/packages/registry-examples/',
  '/packages/registry-internals/',
  '/packages/registry-ui/',
  '/packages/deprecated/',
  '/packages/wip/',
]

const isExcluded = (p) => BUILD_TIME_NEEDLES.some((needle) => p.includes(needle))

// ─── Step 1: Discover hashed symlinks in .next/node_modules/ ─────────────────
// Next.js creates symlinks like "shiki-3b5baa013725c51f → ../../../../node_modules/.bun/shiki@4.1.0/node_modules/shiki"
// The hashed names don't match our needles, so we discover them dynamically.
const nextNodeModules = join(nextDir, 'node_modules')
const excludedHashedNames = new Set()

try {
  for (const entry of await readdir(nextNodeModules, { withFileTypes: true })) {
    if (!entry.isSymbolicLink()) continue
    const target = await readlink(join(nextNodeModules, entry.name))
    // Symlink targets don't end with '/' but needles expect it
    if (isExcluded(target) || isExcluded(target + '/')) {
      excludedHashedNames.add(entry.name)
    }
  }
} catch {
  // .next/node_modules might not exist in all build modes
}

if (excludedHashedNames.size > 0) {
  console.log(
    `[patch-nft] found ${excludedHashedNames.size} excluded hashed symlink(s): ${[...excludedHashedNames].join(', ')}`,
  )
}

const isExcludedFull = (p) => {
  if (isExcluded(p)) return true
  for (const name of excludedHashedNames) {
    if (p.includes(`node_modules/${name}`)) return true
  }
  return false
}

// ─── Step 2: Patch all .nft.json files ───────────────────────────────────────
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
  data.files = data.files.filter((p) => !isExcludedFull(p))
  const removed = before - data.files.length
  if (removed > 0) {
    await writeFile(f, JSON.stringify(data))
    console.log(`[patch-nft] ${relative(nextDir, f)}: -${removed} entries`)
    totalRemoved += removed
    filesPatched++
  }
}

console.log(`[patch-nft] patched ${filesPatched} files, removed ${totalRemoved} entries total`)

// ─── Step 3: Remove the hashed symlinks so the plugin can't follow them ──────
for (const name of excludedHashedNames) {
  try {
    await unlink(join(nextNodeModules, name))
    console.log(`[patch-nft] deleted symlink .next/node_modules/${name}`)
  } catch {}
}

// ─── Step 4: Delete excluded packages from .next/standalone/ ─────────────────
// @netlify/plugin-nextjs copies physical files from the standalone directory
// into the Lambda. We must delete excluded packages here (AFTER next build
// created them) so the plugin doesn't bundle them.
//
// The standalone mirrors absolute paths from the outputFileTracingRoot, so
// package dirs may be nested deeply (e.g. standalone/opt/build/repo/node_modules/
// .bun/shiki@4.1.0/node_modules/shiki/). We walk the full tree and delete any
// directory whose absolute path matches an exclusion needle.
const standaloneDir = join(nextDir, 'standalone')

async function cleanupStandalone(dir, depth = 0) {
  if (depth > 20) return
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const full = join(dir, entry.name)
    // Use absolute path with trailing slash for needle matching
    const absWithSlash = full + '/'
    if (isExcludedFull(absWithSlash)) {
      try {
        await rm(full, { recursive: true, force: true })
        const short = full.replace(nextDir + '/standalone', 'standalone')
        console.log(`[patch-nft] removed standalone: ${short}`)
      } catch {}
      // don't recurse into the deleted directory
    } else {
      await cleanupStandalone(full, depth + 1)
    }
  }
}

try {
  await stat(standaloneDir)
  console.log('[patch-nft] cleaning standalone node_modules...')
  await cleanupStandalone(standaloneDir)
} catch {
  // no standalone dir locally (plugin enables it only on Netlify)
  console.log('[patch-nft] no standalone dir found — skipping standalone cleanup')
}
