#!/usr/bin/env node
/**
 * Distill the velite output into a slim search index for the client
 * Command Menu.
 *
 * The full per-package collections include the compiled MDX body, raw
 * content, excerpt, metadata, and other large fields — totalling ~50 MB.
 * Importing them in any client component drags the entire payload into
 * the shared layout chunk via webpack (JSON imports do not tree-shake).
 *
 * This script runs after `velite` and emits
 * `apps/duck/.gentleduck/_search-index.json`, containing only the fields
 * the Command Menu actually reads:
 *   - docsEntries: { permalink, slug, title, component, toc, section, order }
 *   - packageSidebarNavs: precomputed sidebar items per package
 *
 * config/docs.ts imports this slim JSON instead of the raw velite
 * collections, keeping the client bundle small.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VELITE_DIR = path.resolve(__dirname, '../.gentleduck')

const slimDoc = (doc) => ({
  component: doc.component,
  permalink: doc.permalink,
  slug: doc.slug,
  title: doc.title,
  section: doc.section,
  order: doc.order,
  toc: doc.toc,
})

async function readCollection(name) {
  try {
    const raw = await fs.readFile(path.join(VELITE_DIR, `${name}.json`), 'utf8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function main() {
  const [
    docs,
    duckCalendar,
    duckCli,
    duckGen,
    duckHooks,
    duckIam,
    duckLazy,
    duckLibs,
    duckMotion,
    duckPrimitives,
    duckQuery,
    duckRegistryBuild,
    duckShortcut,
    duckState,
    duckTemplate,
    duckTtest,
    duckTtlog,
    duckUi,
    duckUpload,
    duckVariants,
    duckVim,
  ] = await Promise.all([
    readCollection('docs'),
    readCollection('duckCalendar'),
    readCollection('duckCli'),
    readCollection('duckGen'),
    readCollection('duckHooks'),
    readCollection('duckIam'),
    readCollection('duckLazy'),
    readCollection('duckLibs'),
    readCollection('duckMotion'),
    readCollection('duckPrimitives'),
    readCollection('duckQuery'),
    readCollection('duckRegistryBuild'),
    readCollection('duckShortcut'),
    readCollection('duckState'),
    readCollection('duckTemplate'),
    readCollection('duckTtest'),
    readCollection('duckTtlog'),
    readCollection('duckUi'),
    readCollection('duckUpload'),
    readCollection('duckVariants'),
    readCollection('duckVim'),
  ])

  const allDocs = [
    ...docs,
    ...duckCalendar,
    ...duckCli,
    ...duckGen,
    ...duckHooks,
    ...duckIam,
    ...duckLazy,
    ...duckLibs,
    ...duckMotion,
    ...duckPrimitives,
    ...duckQuery,
    ...duckRegistryBuild,
    ...duckShortcut,
    ...duckState,
    ...duckTemplate,
    ...duckTtest,
    ...duckTtlog,
    ...duckUi,
    ...duckUpload,
    ...duckVariants,
    ...duckVim,
  ]

  const docsEntries = allDocs.map((doc) => {
    const slug = doc.slug.startsWith('/') ? doc.slug : `/${doc.slug}`
    return {
      component: doc.component,
      permalink: slug,
      slug,
      title: doc.title,
      toc: doc.toc,
    }
  })

  // Hand-curated sidebars live in apps/duck/config/sidebars/<pkg>.constants.ts.
  // Each file exports a typed IDocsConfig — we reduce them down to the sidebarNav
  // shape the command palette expects.
  const { packageSidebars } = await import(path.resolve(__dirname, '../config/sidebars/index.ts'))
  const packageSidebarNavs = Object.fromEntries(
    Object.entries(packageSidebars).map(([pkg, config]) => [pkg, config.sidebarNav]),
  )

  const out = { docsEntries, packageSidebarNavs }
  const target = path.join(VELITE_DIR, '_search-index.json')
  await fs.writeFile(target, JSON.stringify(out))
  const sz = (await fs.stat(target)).size
  console.log(`[search-index] ${target} -> ${(sz / 1024).toFixed(1)} KB`)
}

main().catch((err) => {
  console.error('[search-index] failed:', err)
  process.exit(1)
})
