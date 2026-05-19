#!/usr/bin/env node
/**
 * Emits `apps/duck/.gentleduck/_search-index.json` with only the fields the Command
 * Menu reads (docsEntries + packageSidebarNavs). Importing the raw velite
 * collections in client code would pull the full ~50 MB payload into the shared
 * layout chunk because JSON imports do not tree-shake.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VELITE_DIR = path.resolve(__dirname, '../.gentleduck')

const _slimDoc = (doc) => ({
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
