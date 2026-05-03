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
 * `apps/duck/.velite/_search-index.json`, containing only the fields
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
const VELITE_DIR = path.resolve(__dirname, '../.velite')

const PRIMITIVES_ORDER = [
  'Getting Started',
  'Concepts',
  'Course',
  'Guides',
  'Layout',
  'Disclosure',
  'Forms',
  'Selection',
  'Overlay',
  'Feedback',
  'Data Display',
  'Navigation',
  'Toggle',
  'Typography',
  'Media',
  'API',
  'Benchmarks',
  'Misc',
]

const UI_ORDER = [
  'Getting Started',
  'Installation',
  'Layout',
  'Disclosure',
  'Forms',
  'Selection',
  'Overlay',
  'Feedback',
  'Data Display',
  'Navigation',
  'Toggle',
  'Typography',
  'Media',
  'Integrations',
  'Misc',
]

const titlecase = (segment) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const inferSection = (permalink, pkg) => {
  const tail = permalink.replace(new RegExp(`^${pkg}/?`), '')
  const parts = tail.split('/')
  if (parts.length <= 1) return 'Getting Started'
  return titlecase(parts[0] ?? 'Misc')
}

const slugTitle = (permalink) => {
  const last = permalink.split('/').pop() ?? permalink
  return last === 'index' ? 'Overview' : titlecase(last)
}

const hrefFor = (permalink) => `/${permalink.replace(/\/index$/, '')}`

function buildSidebar(docs, options) {
  const { pkg, sectionOrder = [], introSlug = `${pkg}/introduction` } = options

  const grouped = new Map()
  for (const doc of docs) {
    if (!doc.permalink.startsWith(`${pkg}/`) && doc.permalink !== pkg) continue
    const section = doc.section ?? inferSection(doc.permalink, pkg)
    const list = grouped.get(section) ?? []
    list.push(doc)
    grouped.set(section, list)
  }

  const introSection = grouped.get('Getting Started') ?? []
  const introDoc = introSection.find((d) => d.permalink === introSlug)
  if (introDoc) {
    grouped.set('Getting Started', [introDoc, ...introSection.filter((d) => d.permalink !== introSlug)])
  }

  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    const ai = sectionOrder.indexOf(a)
    const bi = sectionOrder.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.localeCompare(b)
  })

  return sortedKeys.map((key, idx) => {
    const items = (grouped.get(key) ?? [])
      .slice()
      .sort((a, b) => {
        if (a.permalink === introSlug) return -1
        if (b.permalink === introSlug) return 1
        const ao = a.order ?? Number.POSITIVE_INFINITY
        const bo = b.order ?? Number.POSITIVE_INFINITY
        if (ao !== bo) return ao - bo
        if (a.permalink.endsWith('/index')) return -1
        if (b.permalink.endsWith('/index')) return 1
        return a.title.localeCompare(b.title)
      })
      .map((doc) => ({
        href: hrefFor(doc.permalink),
        title: doc.permalink === introSlug ? 'Introduction' : doc.title || slugTitle(doc.permalink),
        items: [],
      }))

    const isFirst = idx === 0
    return {
      title: isFirst ? '' : key,
      ...(isFirst ? { href: hrefFor(introSlug) } : {}),
      items,
    }
  })
}

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

  const packageSidebarNavs = {
    'duck-calendar': buildSidebar(duckCalendar, { pkg: 'duck-calendar' }),
    'duck-cli': buildSidebar(duckCli, { pkg: 'duck-cli' }),
    'duck-gen': buildSidebar(duckGen, { pkg: 'duck-gen' }),
    'duck-hooks': buildSidebar(duckHooks, { pkg: 'duck-hooks' }),
    'duck-iam': buildSidebar(duckIam, { pkg: 'duck-iam' }),
    'duck-lazy': buildSidebar(duckLazy, { pkg: 'duck-lazy' }),
    'duck-libs': buildSidebar(duckLibs, { pkg: 'duck-libs' }),
    'duck-motion': buildSidebar(duckMotion, { pkg: 'duck-motion' }),
    'duck-primitives': buildSidebar(duckPrimitives, { pkg: 'duck-primitives', sectionOrder: PRIMITIVES_ORDER }),
    'duck-query': buildSidebar(duckQuery, { pkg: 'duck-query' }),
    'duck-registry-build': buildSidebar(duckRegistryBuild, { pkg: 'duck-registry-build' }),
    'duck-shortcut': buildSidebar(duckShortcut, { pkg: 'duck-shortcut' }),
    'duck-state': buildSidebar(duckState, { pkg: 'duck-state' }),
    'duck-template': buildSidebar(duckTemplate, { pkg: 'duck-template' }),
    'duck-ttest': buildSidebar(duckTtest, { pkg: 'duck-ttest' }),
    'duck-ttlog': buildSidebar(duckTtlog, { pkg: 'duck-ttlog' }),
    'duck-ui': buildSidebar(duckUi, { pkg: 'duck-ui', sectionOrder: UI_ORDER }),
    'duck-upload': buildSidebar(duckUpload, { pkg: 'duck-upload' }),
    'duck-variants': buildSidebar(duckVariants, { pkg: 'duck-variants' }),
    'duck-vim': buildSidebar(duckVim, { pkg: 'duck-vim' }),
  }

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
