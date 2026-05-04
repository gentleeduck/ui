import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { extractSummary, parseFrontmatter, stripMdxSyntax } from '../mcp/text'
import { computeIdf, computeTf, computeTfidfVector, cosineSimilarity } from '../mcp/tfidf'
import { expandSearchTerms, tokenize } from '../mcp/tokenize'

interface IDocEntry {
  slug: string
  title: string
  description: string
  category: string
  cleanBody: string
  tokens: string[]
  tf: Map<string, number>
}

export interface IChatSource {
  slug: string
  title: string
  href: string
}

interface IChatContext {
  contextText: string
  sources: IChatSource[]
}

const CONTENT_DIR = resolve(join(process.cwd(), 'content', 'docs'))
const BASE_URL = 'https://gentleduck.org'
const MAX_CONTEXT_CHARS = 8000

let cachedDocs: IDocEntry[] | null = null
let cachedIdf: Map<string, number> | null = null
let cacheTime = 0
const CACHE_TTL = 120_000

async function loadDocs(): Promise<IDocEntry[]> {
  if (cachedDocs && Date.now() - cacheTime < CACHE_TTL) return cachedDocs

  const docs: IDocEntry[] = []

  async function walk(dir: string, prefix: string) {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name)
      } else if (entry.name.endsWith('.mdx')) {
        const slug = prefix ? `${prefix}/${entry.name.replace('.mdx', '')}` : entry.name.replace('.mdx', '')
        const raw = await readFile(fullPath, 'utf-8').catch(() => null)
        if (!raw) continue
        const { title, description, body } = parseFrontmatter(raw)
        const cleanBody = stripMdxSyntax(body)
        const tokens = tokenize(`${title} ${description} ${cleanBody}`)
        const tf = computeTf(tokens)
        const category = slug.split('/')[0] ?? 'general'
        docs.push({ slug, title, description, category, cleanBody, tokens, tf })
      }
    }
  }

  await walk(CONTENT_DIR, '')

  cachedIdf = computeIdf(
    docs.map((d) => d.tf),
    docs.length,
  )
  cachedDocs = docs
  cacheTime = Date.now()
  return docs
}

function semanticSearch(query: string, docs: IDocEntry[], idf: Map<string, number>, limit: number): IDocEntry[] {
  const expandedTerms = expandSearchTerms(query)
  const allTerms = [...new Set([...tokenize(query), ...expandedTerms])]
  const queryTf = computeTf(allTerms)
  const queryVector = computeTfidfVector(queryTf, idf)

  const scored = docs
    .map((doc) => {
      const docVector = computeTfidfVector(doc.tf, idf)
      const score = cosineSimilarity(queryVector, docVector)
      return { doc, score }
    })
    .filter((r) => r.score > 0.03)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored.map((r) => r.doc)
}

// Words to ignore when matching component names
const STOP_WORDS = new Set([
  'how',
  'does',
  'the',
  'a',
  'an',
  'is',
  'are',
  'was',
  'were',
  'what',
  'which',
  'who',
  'when',
  'where',
  'why',
  'can',
  'could',
  'would',
  'should',
  'do',
  'did',
  'will',
  'have',
  'has',
  'had',
  'been',
  'be',
  'to',
  'of',
  'in',
  'for',
  'on',
  'with',
  'at',
  'by',
  'from',
  'it',
  'its',
  'this',
  'that',
  'my',
  'your',
  'use',
  'work',
  'works',
  'component',
  'components',
  'i',
  'me',
  'we',
  'they',
  'you',
  'about',
  'get',
  'make',
  'want',
  'need',
  'help',
  'please',
  'show',
  'tell',
])

const ALIASES: Record<string, string> = {
  modal: 'dialog',
  popup: 'popover',
  dropdown: 'dropdown-menu',
  toast: 'sonner',
  notification: 'sonner',
  navbar: 'navigation-menu',
  autocomplete: 'combobox',
  datepicker: 'calendar',
  'date-picker': 'calendar',
}

export function extractComponentNames(query: string, docs: IDocEntry[]): string[] {
  const componentSlugs = docs.filter((d) => d.category === 'components').map((d) => d.slug.split('/').pop() ?? '')
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
  const matched: string[] = []

  for (const word of words) {
    // Check aliases first
    const aliased = ALIASES[word]
    if (aliased && componentSlugs.includes(aliased)) {
      matched.push(aliased)
      continue
    }

    // Exact match only  -  no fuzzy for component detection
    if (componentSlugs.includes(word)) {
      matched.push(word)
    }
  }

  return [...new Set(matched)]
}

export async function buildChatContext(userMessage: string): Promise<IChatContext> {
  const docs = await loadDocs()
  if (!cachedIdf) {
    return { contextText: '', sources: [] }
  }
  const idf = cachedIdf
  const sources: IChatSource[] = []
  const contextParts: string[] = []
  let usedChars = 0

  const componentNames = extractComponentNames(userMessage, docs)
  for (const name of componentNames) {
    const doc = docs.find((d) => d.slug === `duck-ui/components/${name}`)
    if (!doc) continue
    // Give full body for exact component matches (truncated to 3000 chars), not just summary
    const body = doc.cleanBody.length > 3000 ? doc.cleanBody.slice(0, 3000) : doc.cleanBody
    const chunk = `COMPONENT: ${doc.title}\nPage: ${BASE_URL}/${doc.slug}\n\n${body}`
    if (usedChars + chunk.length > MAX_CONTEXT_CHARS) break
    contextParts.push(chunk)
    usedChars += chunk.length
    sources.push({ slug: doc.slug, title: doc.title, href: `${BASE_URL}/${doc.slug}` })
  }

  const searchResults = semanticSearch(userMessage, docs, idf, 3)
  for (const doc of searchResults) {
    if (sources.some((s) => s.slug === doc.slug)) continue
    const summary = extractSummary(doc.cleanBody)
    const chunk = `DOC: ${doc.title}\nPage: ${BASE_URL}/${doc.slug}\n\n${summary}`
    if (usedChars + chunk.length > MAX_CONTEXT_CHARS) break
    contextParts.push(chunk)
    usedChars += chunk.length
    sources.push({ slug: doc.slug, title: doc.title, href: `${BASE_URL}/${doc.slug}` })
  }

  return {
    contextText: contextParts.join('\n\n---\n\n'),
    sources,
  }
}

export async function buildChatContextFromSlug(userMessage: string, slug: string): Promise<IChatContext> {
  const docs = await loadDocs()
  const doc = docs.find((d) => d.slug === slug)
  if (!doc) {
    return buildChatContext(userMessage)
  }

  const body = doc.cleanBody.length > 6000 ? doc.cleanBody.slice(0, 6000) : doc.cleanBody
  const contextText = `COMPONENT: ${doc.title}\nPage: ${BASE_URL}/${doc.slug}\n\n${body}`
  const sources = [{ slug: doc.slug, title: doc.title, href: `${BASE_URL}/${doc.slug}` }]

  return { contextText, sources }
}
