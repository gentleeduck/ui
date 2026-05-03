import { readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import {
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
  www,
} from '../../../.velite'
import registryIndex from '../../../public/r/index.json' with { type: 'json' }

export const dynamic = 'force-static'
export const dynamicParams = false

interface IRegistryFile {
  path: string
  type?: string
}
interface IRegistryEntry {
  name?: string
  source?: string
  files?: IRegistryFile[]
}

// `name -> file paths` lookup built from the registry catalog. The
// catalog's `source` is the workspace-relative path under `packages/`,
// e.g. `/registry-examples/src/button`, and each `file.path` is
// relative to that source dir.
const REGISTRY_BY_NAME = new Map<string, { source: string; files: IRegistryFile[] }>()
for (const entry of Object.values(registryIndex as unknown as Record<string, IRegistryEntry>)) {
  if (entry?.name && entry.source && Array.isArray(entry.files)) {
    REGISTRY_BY_NAME.set(entry.name, { source: entry.source, files: entry.files })
  }
}

const WORKSPACE_PACKAGES = join(process.cwd(), '..', '..', 'packages')

function langForFile(p: string): string {
  const ext = extname(p).toLowerCase()
  switch (ext) {
    case '.tsx':
      return 'tsx'
    case '.ts':
      return 'ts'
    case '.jsx':
      return 'jsx'
    case '.js':
      return 'js'
    case '.css':
      return 'css'
    case '.json':
      return 'json'
    case '.mdx':
      return 'mdx'
    case '.md':
      return 'md'
    default:
      return ''
  }
}

function readRegistrySource(name: string): string | null {
  const entry = REGISTRY_BY_NAME.get(name)
  if (!entry) return null
  const blocks: string[] = []
  for (const file of entry.files) {
    const abs = join(WORKSPACE_PACKAGES, entry.source.replace(/^\//, ''), file.path)
    try {
      const src = readFileSync(abs, 'utf8')
      const lang = langForFile(file.path)
      blocks.push(`\`\`\`${lang} title="${file.path}"\n${src}\n\`\`\``)
    } catch {
      // missing file – skip silently rather than corrupting the doc
    }
  }
  return blocks.length ? blocks.join('\n\n') : null
}

function extractAttr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))
  return m?.[1] ?? null
}

const PREVIEW_TAG = /<(ComponentPreview|ComponentSource)\b([^>]*?)\/>|<(ComponentPreview|ComponentSource)\b([^>]*?)>([\s\S]*?)<\/\3>/g

function inlineComponentSources(body: string): string {
  return body.replace(PREVIEW_TAG, (_match, _selfTag, selfAttrs, _pairTag, pairAttrs) => {
    const attrs = selfAttrs ?? pairAttrs ?? ''
    const name = extractAttr(attrs, 'name')
    if (!name) return ''
    const code = readRegistrySource(name)
    return code ?? ''
  })
}

function stripRemainingJsx(body: string): string {
  const unwrap = ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent', 'Steps', 'Step', 'Callout', 'Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent']
  const remove = ['MermaidDiagram', 'LinkedCard']

  let out = body.replace(/^import\s+.*$/gm, '')
  for (const c of unwrap) {
    out = out.replace(new RegExp(`<${c}[^>]*>([\\s\\S]*?)<\\/${c}>`, 'g'), '$1')
  }
  for (const c of remove) {
    out = out.replace(new RegExp(`<${c}[^>]*>[\\s\\S]*?<\\/${c}>`, 'g'), '')
    out = out.replace(new RegExp(`<${c}\\b[^>]*\\/>`, 'g'), '')
  }
  return out
    .replace(/<\w+[\s\S]*?\/>/g, '')
    .replace(/^\s*<\/?\w+[^>]*>\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function transform(body: string): string {
  return stripRemainingJsx(inlineComponentSources(body))
}

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
  ...www,
]

function findDoc(slug: string[]): string | null {
  const path = slug.join('/')
  const candidates = [path, `${path}/index`]
  const doc = allDocs.find((d) => candidates.includes(d.permalink)) as
    | { raw?: string; content?: string }
    | undefined
  const source = doc?.raw ?? doc?.content
  return source ? transform(source) : null
}

export async function generateStaticParams() {
  return allDocs.map((doc) => ({ slug: doc.permalink.replace(/\/index$/, '').split('/') }))
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await context.params
  const content = findDoc(slug)

  if (!content) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300',
    },
    status: 200,
  })
}
