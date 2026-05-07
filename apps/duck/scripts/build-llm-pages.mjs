#!/usr/bin/env node
/**
 * Pre-render every doc as plain markdown with ComponentSource and
 * ComponentPreview tags inlined as fenced code blocks. Output lands in
 * `apps/duck/.velite/_llm/<permalink>.md` and is served verbatim by
 * `/llm/[...slug]/route.ts`.
 *
 * Doing the heavy lifting here lets the route stay tiny (just an fs
 * lookup) instead of importing all velite collections + the registry
 * index, which inflated the Netlify Lambda past the 250 MB cap.
 */
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const APP_ROOT = path.resolve(__dirname, '..')
const VELITE_DIR = path.join(APP_ROOT, '.velite')
const OUT_DIR = path.join(VELITE_DIR, '_llm')
const REGISTRY_INDEX = path.join(APP_ROOT, 'public/r/index.json')
const WORKSPACE_PACKAGES = path.resolve(APP_ROOT, '..', '..', 'packages')

const COLLECTIONS = [
  'docs',
  'duckCalendar',
  'duckCli',
  'duckGen',
  'duckHooks',
  'duckIam',
  'duckLazy',
  'duckLibs',
  'duckMotion',
  'duckPrimitives',
  'duckQuery',
  'duckRegistryBuild',
  'duckShortcut',
  'duckState',
  'duckTemplate',
  'duckTtest',
  'duckTtlog',
  'duckUi',
  'duckUpload',
  'duckVariants',
  'duckVim',
  'www',
]

const LANG_BY_EXT = {
  '.tsx': 'tsx',
  '.ts': 'ts',
  '.jsx': 'jsx',
  '.js': 'js',
  '.css': 'css',
  '.scss': 'scss',
  '.json': 'json',
  '.mdx': 'mdx',
  '.md': 'md',
  '.html': 'html',
  '.sh': 'bash',
}

function langFor(file) {
  return LANG_BY_EXT[path.extname(file).toLowerCase()] ?? ''
}

async function loadRegistry() {
  // Per-component JSONs at /public/r/components/<name>.json embed `content`
  // for every file. Prefer them — index.json only carries paths.
  const componentsDir = path.join(APP_ROOT, 'public/r/components')
  const map = new Map()

  if (existsSync(componentsDir)) {
    const files = await readdir(componentsDir)
    for (const f of files) {
      if (!f.endsWith('.json')) continue
      try {
        const raw = await readFile(path.join(componentsDir, f), 'utf8')
        const entry = JSON.parse(raw)
        if (entry?.name && Array.isArray(entry.files)) {
          map.set(entry.name, {
            source: entry.source ?? '',
            files: entry.files,
          })
        }
      } catch {
        // skip
      }
    }
  }

  // Backfill anything missing from index.json (no content, but at least we know the path).
  try {
    const raw = await readFile(REGISTRY_INDEX, 'utf8')
    const parsed = JSON.parse(raw)
    for (const entry of Object.values(parsed)) {
      if (entry?.name && entry.source && Array.isArray(entry.files) && !map.has(entry.name)) {
        map.set(entry.name, { source: entry.source, files: entry.files })
      }
    }
  } catch {
    // index.json missing — components dir alone is fine
  }

  return map
}

async function readRegistrySource(name, registry) {
  const entry = registry.get(name)
  if (!entry) return null
  const blocks = []
  for (const file of entry.files) {
    let src = typeof file.content === 'string' ? file.content : null
    if (!src) {
      const abs = path.join(WORKSPACE_PACKAGES, entry.source.replace(/^\//, ''), file.path)
      try {
        src = await readFile(abs, 'utf8')
      } catch {
        continue
      }
    }
    const lang = langFor(file.path) || 'tsx'
    const importPath = file.target ? file.target.replace(/\.[^.]+$/, '') : file.path.replace(/\.[^.]+$/, '')
    const importLine = `// import from your project: import Demo from '@/${importPath}'`
    blocks.push(`\`\`\`${lang} title="${file.target ?? file.path}"\n${importLine}\n${src.trimEnd()}\n\`\`\``)
  }
  return blocks.length ? blocks.join('\n\n') : null
}

const PREVIEW_TAG =
  /<(ComponentPreview|ComponentSource)\b([^>]*?)\/>|<(ComponentPreview|ComponentSource)\b([^>]*?)>([\s\S]*?)<\/\3>/g

function extractAttr(attrs, name) {
  const m = attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))
  return m?.[1] ?? null
}

async function inlineComponentSources(body, registry) {
  const matches = []
  body.replace(PREVIEW_TAG, (match, _self, selfAttrs, _pair, pairAttrs, _inner, offset) => {
    matches.push({ match, attrs: selfAttrs ?? pairAttrs ?? '', offset })
    return match
  })
  if (!matches.length) return body
  let out = ''
  let cursor = 0
  for (const m of matches) {
    out += body.slice(cursor, m.offset)
    const name = extractAttr(m.attrs, 'name')
    if (name) {
      const code = await readRegistrySource(name, registry)
      out += code ?? ''
    }
    cursor = m.offset + m.match.length
  }
  out += body.slice(cursor)
  return out
}

const UNWRAP = [
  'Tabs',
  'TabsList',
  'TabsTrigger',
  'TabsContent',
  'Steps',
  'Step',
  'Callout',
  'Accordion',
  'AccordionItem',
  'AccordionTrigger',
  'AccordionContent',
]
const REMOVE = ['MermaidDiagram', 'LinkedCard']

function stripRemainingJsx(body) {
  // Stash fenced code blocks so the JSX-stripping regexes don't touch their contents.
  const blocks = []
  const stashed = body.replace(/```[\s\S]*?```/g, (m) => {
    const id = blocks.push(m) - 1
    return `__CODE_BLOCK_${id}__`
  })

  let out = stashed.replace(/^import\s+.*$/gm, '')
  for (const c of UNWRAP) {
    out = out.replace(new RegExp(`<${c}[^>]*>([\\s\\S]*?)<\\/${c}>`, 'g'), '$1')
  }
  for (const c of REMOVE) {
    out = out.replace(new RegExp(`<${c}[^>]*>[\\s\\S]*?<\\/${c}>`, 'g'), '')
    out = out.replace(new RegExp(`<${c}\\b[^>]*\\/>`, 'g'), '')
  }
  out = out
    .replace(/<\w+[\s\S]*?\/>/g, '')
    .replace(/^\s*<\/?\w+[^>]*>\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  // Restore stashed code blocks.
  return out.replace(/__CODE_BLOCK_(\d+)__/g, (_, id) => blocks[Number(id)] ?? '')
}

async function loadCollection(name) {
  const file = path.join(VELITE_DIR, `${name}.json`)
  if (!existsSync(file)) return []
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return []
  }
}

async function clearOutDir() {
  if (existsSync(OUT_DIR)) {
    await rm(OUT_DIR, { recursive: true, force: true })
  }
  await mkdir(OUT_DIR, { recursive: true })
}

async function dirSize(dir) {
  let total = 0
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) total += await dirSize(p)
    else total += (await stat(p)).size
  }
  return total
}

async function main() {
  const registry = await loadRegistry()
  await clearOutDir()

  let written = 0
  for (const name of COLLECTIONS) {
    const docs = await loadCollection(name)
    for (const doc of docs) {
      const source = doc.raw ?? doc.content
      if (typeof source !== 'string' || !source.trim()) continue
      const inlined = await inlineComponentSources(source, registry)
      const md = stripRemainingJsx(inlined)
      const outPath = path.join(OUT_DIR, `${doc.permalink}.md`)
      await mkdir(path.dirname(outPath), { recursive: true })
      await writeFile(outPath, md)
      written += 1
    }
  }

  const total = await dirSize(OUT_DIR)
  console.log(`[llm-pages] wrote ${written} docs -> ${OUT_DIR} (${(total / 1024).toFixed(1)} KB)`)
}

main().catch((err) => {
  console.error('[llm-pages] failed:', err)
  process.exit(1)
})
