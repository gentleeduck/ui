#!/usr/bin/env node
/**
 * Patch .nft.json files to remove packages that are not needed in the
 * Netlify Lambda at request time, keeping the function under the 250 MB limit.
 *
 * @img/sharp  — Netlify serves images via its own CDN; sharp is never called
 *               at request time. next/og uses resvg-wasm, not sharp.
 * ts-morph    — Only used in lib/get-registry-item.ts, which is only called
 *               from force-static pages (blocks, charts, view). Those pages
 *               are pre-rendered at build time; the Lambda never executes them.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const nextDir = join(__dirname, '../.next')

const isExcluded = (p) =>
  // sharp native binaries and all @img scoped packages
  p.includes('/@img/') ||
  p.includes('/node_modules/@img') ||
  p.includes('.bun/@img+') ||
  // ts-morph and its bundled typescript.js (~12 MB)
  p.includes('/@ts-morph/') ||
  p.includes('/ts-morph/') ||
  p.includes('.bun/@ts-morph+') ||
  p.includes('.bun/ts-morph+')

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
