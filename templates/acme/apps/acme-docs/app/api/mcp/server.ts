import { readdir, readFile, stat } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import {
  clearPersistedDocsIndex,
  getPersistedDocsIndexPath,
  loadPersistedDocsIndex,
  type IPersistedDocsIndexEntry,
  writePersistedDocsIndex,
} from './docs-index-persistence'

const CONTENT_DIR_ENV_VAR = 'ACME_DOCS_CONTENT_DIR'
const MAX_RESPONSE_CHARS = 4000
export const MCP_TOOL_NAMES = [
  'list_docs',
  'read_doc',
  'search_docs',
  'get_component_api',
  'get_examples',
  'get_changelog',
  'get_installation',
  'suggest_components',
  'semantic_search',
] as const
export const MCP_TOOL_COUNT = MCP_TOOL_NAMES.length

interface ICachedDoc {
  slug: string
  title: string
  description: string
  category: string
  rawBody: string
  cleanBody: string
  cleanBodyLower: string
  codeBlocks: string[]
  tfidfVector: Map<string, number>
}

type CachedDocSnapshot = Omit<ICachedDoc, 'tfidfVector'>

interface ICachedDocsIndex {
  docs: ICachedDoc[]
  docsBySlug: Map<string, ICachedDoc>
  docsByCategory: Map<string, ICachedDoc[]>
  termToDocIndexes: Map<string, number[]>
  idf: Map<string, number>
}

interface IDocSourceFile {
  slug: string
  relativePath: string
  mtimeMs: number
  size: number
}

interface IIndexedDocEntry {
  source: IDocSourceFile
  doc: CachedDocSnapshot
  tf: Map<string, number>
}

type DocsIndexLoadSource = 'memory' | 'persistent' | 'incremental' | 'rebuild'

// -- In-memory cache ---------------------------------------------------------

const CACHE_TTL = 60_000 // 1 minute

let cachedIndex: ICachedDocsIndex | null = null
let cacheTimestamp = 0
let cachedContentDir: string | null = null
let lastIndexLoadSource: DocsIndexLoadSource = 'rebuild'
let lastIndexCacheFilePath: string | null = null
let lastPersistedEntryCount = 0

function getContentDirResolved(): string {
  const contentDir = process.env[CONTENT_DIR_ENV_VAR]
  return contentDir ? resolve(contentDir) : resolve(join(process.cwd(), 'content', 'docs'))
}

export function isContainedPath(baseDir: string, targetPath: string): boolean {
  const resolvedBaseDir = resolve(baseDir)
  const resolvedTargetPath = resolve(targetPath)

  return resolvedTargetPath === resolvedBaseDir || resolvedTargetPath.startsWith(`${resolvedBaseDir}${sep}`)
}

function resolveContentPath(relativePath: string, baseDir: string = getContentDirResolved()): string | null {
  const resolvedPath = resolve(baseDir, relativePath)
  return isContainedPath(baseDir, resolvedPath) ? resolvedPath : null
}

async function getAllDocPaths(
  dir: string = getContentDirResolved(),
  prefix: string = '',
  baseDir: string = dir,
): Promise<string[]> {
  try {
    const entries = await readdir(dir, { encoding: 'utf8', withFileTypes: true })
    const paths: string[] = []

    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue

      const fullPath = resolve(dir, entry.name)
      if (!isContainedPath(baseDir, fullPath)) continue

      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name

      if (entry.isDirectory()) {
        paths.push(...(await getAllDocPaths(fullPath, relativePath, baseDir)))
      } else if (entry.name.endsWith('.mdx')) {
        paths.push(relativePath.replace(/\.mdx$/, ''))
      }
    }

    return paths
  } catch {
    return []
  }
}

async function readDocFile(slug: string, baseDir: string = getContentDirResolved()): Promise<string | null> {
  const candidates = [`${slug}.mdx`, join(slug, 'index.mdx')]

  for (const candidate of candidates) {
    const filePath = resolveContentPath(candidate, baseDir)
    if (!filePath) continue

    try {
      return await readFile(filePath, 'utf-8')
    } catch {}
  }

  return null
}

async function getDocSourceFile(
  slug: string,
  baseDir: string = getContentDirResolved(),
): Promise<IDocSourceFile | null> {
  const candidates = [`${slug}.mdx`, join(slug, 'index.mdx')]

  for (const candidate of candidates) {
    const filePath = resolveContentPath(candidate, baseDir)
    if (!filePath) continue

    try {
      const fileStat = await stat(filePath)
      if (!fileStat.isFile()) continue

      return {
        slug,
        relativePath: candidate.replaceAll('\\', '/'),
        mtimeMs: Math.trunc(fileStat.mtimeMs),
        size: fileStat.size,
      }
    } catch {}
  }

  return null
}

async function readIndexedDocEntry(source: IDocSourceFile, baseDir: string): Promise<IIndexedDocEntry | null> {
  const content = await readDocFile(source.slug, baseDir)
  if (!content) return null

  const { title, description, body } = parseFrontmatter(content)
  const cleanBody = stripMdxSyntax(body)

  // Tokenize with title/description weighted 3x for TF-IDF
  const titleDesc = `${title} ${title} ${title} ${description} ${description} ${description}`
  const tokens = tokenize(`${titleDesc} ${source.slug.replace(/[/\-_]/g, ' ')} ${cleanBody}`)

  return {
    source,
    doc: {
      slug: source.slug,
      title,
      description,
      category: inferCategory(source.slug),
      rawBody: body,
      cleanBody,
      cleanBodyLower: cleanBody.toLowerCase(),
      codeBlocks: extractCodeBlocks(body),
    },
    tf: computeTf(tokens),
  }
}

export function parseFrontmatter(content: string): { title: string; description: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { title: '', description: '', body: content }

  const frontmatter = match[1] ?? ''
  const body = match[2] ?? ''

  const title = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? ''
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? ''

  return { title, description, body }
}

function inferCategory(slug: string): string {
  const first = slug.split('/')[0] ?? ''
  const categories: Record<string, string> = {
    components: 'components',
    installation: 'installation',
    packages: 'packages',
    changelog: 'changelog',
    'dark-theme': 'dark-theme',
  }
  return categories[first] ?? 'general'
}

/**
 * Strip MDX-specific syntax (JSX components, imports, mermaid diagrams)
 * to produce clean markdown that uses fewer tokens.
 */
export function stripMdxSyntax(body: string): string {
  const unwrapComponents = ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent', 'Steps', 'Step']
  const removeComponents = ['MermaidDiagram', 'ComponentSource', 'ComponentPreview']

  let stripped = body
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')

  for (const component of unwrapComponents) {
    stripped = stripped.replace(new RegExp(`<${component}[^>]*>([\\s\\S]*?)<\\/${component}>`, 'g'), '$1')
  }

  for (const component of removeComponents) {
    stripped = stripped.replace(new RegExp(`<${component}[^>]*>[\\s\\S]*?<\\/${component}>`, 'g'), '')
  }

  return (
    stripped
      // Remove self-closing JSX tags like <ComponentPreview ... />
      .replace(/<\w+[\s\S]*?\/>/g, '')
      // Remove standalone JSX open/close tags (single line)
      .replace(/^\s*<\/?\w+[^>]*>\s*$/gm, '')
      // Collapse 3+ blank lines into 2
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

/**
 * Extract fenced code blocks from the body.
 */
function extractCodeBlocks(body: string): string[] {
  const blocks: string[] = []
  const regex = /```(\w*)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null = regex.exec(body)
  while (match !== null) {
    const lang = match[1] ?? ''
    const code = (match[2] ?? '').trim()
    blocks.push(`\`\`\`${lang}\n${code}\n\`\`\``)
    match = regex.exec(body)
  }
  return blocks
}

// -- TF-IDF semantic search engine -------------------------------------------

// -- Stemming ----------------------------------------------------------------

/**
 * Simple suffix-stripping stemmer.
 * Handles common English suffixes so "running" matches "run", "buttons" matches "button", etc.
 */
export function stem(word: string): string {
  if (word.length < 4) return word

  const collapseDoubledConsonant = (value: string) => {
    if (value.length < 3) return value

    const lastChar = value.at(-1)
    const prevChar = value.at(-2)
    if (!lastChar || !prevChar) return value
    if (lastChar !== prevChar) return value
    if ('aeiou'.includes(lastChar)) return value
    if (['l', 's', 'z'].includes(lastChar)) return value

    return value.slice(0, -1)
  }

  // Order matters: longest suffixes first
  const suffixes: [string, string][] = [
    ['ational', 'ate'],
    ['tional', 'tion'],
    ['encies', 'ence'],
    ['ancies', 'ance'],
    ['izers', 'ize'],
    ['ising', 'ise'],
    ['izing', 'ize'],
    ['ating', 'ate'],
    ['ation', 'ate'],
    ['eness', 'e'],
    ['ments', 'ment'],
    ['ables', 'able'],
    ['ibles', 'ible'],
    ['ously', 'ous'],
    ['ings', ''],
    ['ally', 'al'],
    ['ment', 'ment'],
    ['ness', ''],
    ['able', 'able'],
    ['ible', 'ible'],
    ['ful', ''],
    ['ous', 'ous'],
    ['ive', 'ive'],
    ['ing', ''],
    ['ers', ''],
    ['ion', ''],
    ['ies', 'y'],
    ['ed', ''],
    ['er', ''],
    ['ly', ''],
    ['es', ''],
    ['s', ''],
  ]

  for (const [suffix, replacement] of suffixes) {
    if (word.endsWith(suffix)) {
      const base = collapseDoubledConsonant(word.slice(0, -suffix.length) + replacement)
      // Don't stem too aggressively - keep at least 2 chars
      if (base.length >= 2) return base
    }
  }

  return word
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'is',
  'it',
  'as',
  'be',
  'was',
  'are',
  'were',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'can',
  'shall',
  'not',
  'no',
  'nor',
  'so',
  'if',
  'then',
  'than',
  'that',
  'this',
  'these',
  'those',
  'each',
  'every',
  'all',
  'any',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'only',
  'own',
  'same',
  'too',
  'very',
  'just',
  'about',
  'above',
  'after',
  'again',
  'also',
  'am',
  'because',
  'before',
  'between',
  'both',
  'during',
  'he',
  'her',
  'here',
  'him',
  'his',
  'how',
  'i',
  'into',
  'its',
  'me',
  'my',
  'now',
  'our',
  'out',
  'she',
  'them',
  'there',
  'they',
  'up',
  'us',
  'we',
  'what',
  'when',
  'where',
  'which',
  'who',
  'why',
  'you',
  'your',
])

/**
 * Tokenize text into lowercase terms, removing stop words and short tokens.
 * Also generates bigrams for phrase matching.
 */
export function tokenize(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w))
    .map((w) => stem(w))

  // Add bigrams for phrase-level matching
  const bigrams: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]}_${words[i + 1]}`)
  }

  return [...words, ...bigrams]
}

const TERM_SYNONYMS: Record<string, string[]> = {
  calendar: ['date', 'datepicker'],
  dropdown: ['select', 'combobox', 'menu'],
  modal: ['dialog', 'popup'],
  notification: ['toast'],
  picker: ['calendar', 'datepicker'],
  popup: ['dialog', 'modal'],
  select: ['dropdown', 'combobox'],
  toast: ['notification', 'sonner'],
}

const PHRASE_SYNONYMS: Record<string, string[]> = {
  'date picker': ['calendar', 'datepicker'],
  'data table': ['table', 'grid'],
}

export function expandSearchTerms(query: string): string[] {
  const normalized = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
  const expanded = new Set(normalized.split(/\s+/).filter(Boolean))

  for (const [phrase, synonyms] of Object.entries(PHRASE_SYNONYMS)) {
    if (!normalized.includes(phrase)) continue
    for (const synonym of synonyms) expanded.add(synonym)
  }

  for (const term of expanded) {
    const synonyms = TERM_SYNONYMS[term]
    if (!synonyms) continue
    for (const synonym of synonyms) expanded.add(synonym)
  }

  return [...expanded]
}

function expandSearchText(query: string): string {
  return expandSearchTerms(query).join(' ')
}

/**
 * Compute term frequency for a list of tokens.
 * Uses sublinear TF: 1 + log(count) to prevent long documents from dominating.
 */
export function computeTf(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  const tf = new Map<string, number>()
  for (const [term, count] of counts) {
    tf.set(term, 1 + Math.log(count))
  }
  return tf
}

/**
 * Compute IDF (Inverse Document Frequency) from a corpus of TF maps.
 * IDF = log(N / df) where df = number of documents containing the term.
 */
export function computeIdf(tfMaps: Map<string, number>[], totalDocs: number): Map<string, number> {
  if (totalDocs === 0) return new Map()
  const df = new Map<string, number>()
  for (const tfMap of tfMaps) {
    for (const term of tfMap.keys()) {
      df.set(term, (df.get(term) ?? 0) + 1)
    }
  }
  const idf = new Map<string, number>()
  for (const [term, freq] of df) {
    idf.set(term, Math.log(totalDocs / freq))
  }
  return idf
}

/**
 * Compute TF-IDF vector from a TF map and global IDF.
 * Returns a normalized vector (unit length) for cosine similarity.
 */
export function computeTfidfVector(tf: Map<string, number>, idf: Map<string, number>): Map<string, number> {
  const vector = new Map<string, number>()
  let magnitude = 0

  for (const [term, tfVal] of tf) {
    const idfVal = idf.get(term) ?? 0
    const tfidf = tfVal * idfVal
    if (tfidf > 0) {
      vector.set(term, tfidf)
      magnitude += tfidf * tfidf
    }
  }

  // Normalize to unit vector
  magnitude = Math.sqrt(magnitude)
  if (magnitude > 0) {
    for (const [term, val] of vector) {
      vector.set(term, val / magnitude)
    }
  }

  return vector
}

/**
 * Compute cosine similarity between two TF-IDF vectors.
 * Since vectors are pre-normalized, this is just the dot product.
 */
export function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0
  // Iterate over the smaller map for efficiency
  const [smaller, larger] = a.size <= b.size ? [a, b] : [b, a]
  for (const [term, val] of smaller) {
    const otherVal = larger.get(term)
    if (otherVal !== undefined) {
      dot += val * otherVal
    }
  }
  return dot
}

function getDocsForCategory(index: ICachedDocsIndex, category: string): ICachedDoc[] {
  return category === 'all' ? index.docs : (index.docsByCategory.get(category) ?? [])
}

function getCandidateDocs(index: ICachedDocsIndex, query: string, category: string): ICachedDoc[] {
  const queryTokens = [...new Set(tokenize(expandSearchText(query)))]
  const candidateIndexes = new Set<number>()

  for (const token of queryTokens) {
    for (const docIndex of index.termToDocIndexes.get(token) ?? []) {
      candidateIndexes.add(docIndex)
    }
  }

  // Preserve typo-only search behavior by falling back to the full category scan
  // when the exact token index has no hits.
  if (candidateIndexes.size === 0) {
    return getDocsForCategory(index, category)
  }

  const candidateDocs = [...candidateIndexes]
    .map((docIndex) => index.docs[docIndex])
    .filter((doc): doc is ICachedDoc => Boolean(doc))
  return category === 'all' ? candidateDocs : candidateDocs.filter((doc) => doc.category === category)
}

/**
 * Build (or return cached) in-memory index of all docs.
 * Uses a persistent on-disk snapshot plus incremental rebuilds for changed docs.
 */
async function getDocsIndex(): Promise<ICachedDocsIndex> {
  const now = Date.now()
  const contentDir = getContentDirResolved()
  if (cachedIndex && cachedContentDir === contentDir && now - cacheTimestamp < CACHE_TTL) {
    lastIndexLoadSource = 'memory'
    return cachedIndex
  }

  const slugs = (await getAllDocPaths(contentDir, '', contentDir)).sort()
  const sourceFiles = (await Promise.all(slugs.map((slug) => getDocSourceFile(slug, contentDir)))).filter(
    (source): source is IDocSourceFile => source !== null,
  )
  const persistedSnapshot = await loadPersistedDocsIndex(contentDir)
  const persistedEntries = new Map(persistedSnapshot?.entries.map((entry) => [entry.slug, entry]) ?? [])
  const indexedEntries = (
    await Promise.all(
      sourceFiles.map(async (source): Promise<IIndexedDocEntry | null> => {
        const persistedEntry = persistedEntries.get(source.slug)

        if (
          persistedEntry &&
          persistedEntry.relativePath === source.relativePath &&
          persistedEntry.mtimeMs === source.mtimeMs &&
          persistedEntry.size === source.size
        ) {
          return {
            source,
            doc: persistedEntry.doc,
            tf: new Map(persistedEntry.tfEntries),
          }
        }

        return readIndexedDocEntry(source, contentDir)
      }),
    )
  ).filter((entry): entry is IIndexedDocEntry => entry !== null)

  const rawDocs = indexedEntries.map((entry) => entry.doc)
  const tfMaps = indexedEntries.map((entry) => entry.tf)

  // Second pass: compute IDF and TF-IDF vectors
  const idf = computeIdf(tfMaps, rawDocs.length)

  const docs: ICachedDoc[] = rawDocs.map((doc, i) => ({
    ...doc,
    tfidfVector: computeTfidfVector(tfMaps[i] ?? new Map<string, number>(), idf),
  }))

  const docsBySlug = new Map(docs.map((doc) => [doc.slug, doc]))
  const docsByCategory = new Map<string, ICachedDoc[]>()
  const termToDocIndexes = new Map<string, number[]>()

  docs.forEach((doc, docIndex) => {
    const categoryDocs = docsByCategory.get(doc.category)
    if (categoryDocs) {
      categoryDocs.push(doc)
    } else {
      docsByCategory.set(doc.category, [doc])
    }

    const docTokens = new Set((tfMaps[docIndex] ?? new Map<string, number>()).keys())
    for (const token of docTokens) {
      const docIndexes = termToDocIndexes.get(token)
      if (docIndexes) {
        docIndexes.push(docIndex)
      } else {
        termToDocIndexes.set(token, [docIndex])
      }
    }
  })

  cachedIndex = {
    docs,
    docsBySlug,
    docsByCategory,
    termToDocIndexes,
    idf,
  }
  cacheTimestamp = now
  cachedContentDir = contentDir
  lastIndexCacheFilePath = getPersistedDocsIndexPath(contentDir)
  lastPersistedEntryCount = indexedEntries.length

  const reusedEntries = indexedEntries.reduce((count, entry) => {
    const persistedEntry = persistedEntries.get(entry.source.slug)
    return persistedEntry &&
      persistedEntry.relativePath === entry.source.relativePath &&
      persistedEntry.mtimeMs === entry.source.mtimeMs &&
      persistedEntry.size === entry.source.size
      ? count + 1
      : count
  }, 0)

  if (
    persistedSnapshot &&
    reusedEntries === indexedEntries.length &&
    persistedSnapshot.entries.length === sourceFiles.length
  ) {
    lastIndexLoadSource = 'persistent'
  } else if (persistedSnapshot && reusedEntries > 0) {
    lastIndexLoadSource = 'incremental'
  } else {
    lastIndexLoadSource = 'rebuild'
  }

  const shouldWriteSnapshot =
    !persistedSnapshot ||
    reusedEntries !== indexedEntries.length ||
    persistedSnapshot.entries.length !== sourceFiles.length

  if (shouldWriteSnapshot) {
    const snapshotEntries: IPersistedDocsIndexEntry[] = indexedEntries.map((entry) => ({
      slug: entry.source.slug,
      relativePath: entry.source.relativePath,
      mtimeMs: entry.source.mtimeMs,
      size: entry.source.size,
      doc: entry.doc,
      tfEntries: [...entry.tf.entries()],
    }))

    await writePersistedDocsIndex(contentDir, {
      version: 1,
      contentDir,
      updatedAt: new Date(now).toISOString(),
      entries: snapshotEntries,
    })
  }

  return cachedIndex
}

export async function getDocsIndexStats(): Promise<{
  docCount: number
  categories: string[]
  indexedTermCount: number
  cacheAgeMs: number
  cacheTtlMs: number
  cache: {
    source: DocsIndexLoadSource
    cacheFilePath: string | null
    persistedEntries: number
  }
}> {
  const index = await getDocsIndex()
  const cacheAgeMs = Math.max(0, Date.now() - cacheTimestamp)

  return {
    docCount: index.docs.length,
    categories: [...new Set(index.docs.map((doc) => doc.category))].sort(),
    indexedTermCount: index.termToDocIndexes.size,
    cacheAgeMs,
    cacheTtlMs: CACHE_TTL,
    cache: {
      source: lastIndexLoadSource,
      cacheFilePath: lastIndexCacheFilePath,
      persistedEntries: lastPersistedEntryCount,
    },
  }
}

export async function resetDocsIndexStateForTests(options?: { clearPersistent?: boolean }): Promise<void> {
  cachedIndex = null
  cacheTimestamp = 0
  cachedContentDir = null
  lastIndexLoadSource = 'rebuild'
  lastIndexCacheFilePath = null
  lastPersistedEntryCount = 0

  if (options?.clearPersistent) {
    await clearPersistedDocsIndex(getContentDirResolved())
  }
}

function getDoc(index: ICachedDocsIndex, slug: string): ICachedDoc | undefined {
  return index.docsBySlug.get(slug)
}

/**
 * Truncate text to MAX_RESPONSE_CHARS with a notice.
 */
function truncate(text: string): string {
  if (text.length <= MAX_RESPONSE_CHARS) return text
  return (
    text.slice(0, MAX_RESPONSE_CHARS) +
    '\n\n---\n*[Truncated  -  use `section` parameter or `mode="summary"` to get specific parts]*'
  )
}

/**
 * Extract only headings and the first paragraph under each
 * for a compact summary that saves tokens.
 */
export function extractSummary(cleanBody: string): string {
  const lines = cleanBody.split('\n')
  const summary: string[] = []
  let collecting = false

  for (const line of lines) {
    if (line.startsWith('#')) {
      summary.push(line)
      collecting = true
    } else if (collecting && line.trim()) {
      summary.push(line)
      collecting = false
    }
  }

  return summary.join('\n')
}

/**
 * Extract a section from clean body by heading name.
 */
export function extractSection(
  cleanBody: string,
  sectionName: string,
): { found: boolean; content: string; headings: string[] } {
  const sectionLower = sectionName.toLowerCase()
  const lines = cleanBody.split('\n')
  const sectionLines: string[] = []
  const headings: string[] = []
  let capturing = false
  let sectionLevel = 0

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      headings.push(line)
      const level = headingMatch[1]?.length ?? 0
      const text = headingMatch[2]?.toLowerCase() ?? ''
      if (text.includes(sectionLower)) {
        capturing = true
        sectionLevel = level
        sectionLines.push(line)
        continue
      }
      if (capturing && level <= sectionLevel) break
    }
    if (capturing) sectionLines.push(line)
  }

  return {
    found: sectionLines.length > 0,
    content: sectionLines.join('\n').trim(),
    headings,
  }
}

const CHANGELOG_MONTHS = new Map([
  ['january', 1],
  ['february', 2],
  ['march', 3],
  ['april', 4],
  ['may', 5],
  ['june', 6],
  ['july', 7],
  ['august', 8],
  ['september', 9],
  ['october', 10],
  ['november', 11],
  ['december', 12],
])

function getChangelogSortKey(doc: ICachedDoc): number {
  const slug = doc.slug.replace(/^changelog\//, '')
  if (slug === 'index') return Number.NEGATIVE_INFINITY

  if (/^\d{4}$/.test(slug)) {
    return Number(slug) * 100
  }

  const monthMatch = slug.match(
    /^(january|february|march|april|may|june|july|august|september|october|november|december)-(\d{4})$/,
  )
  if (!monthMatch) return Number.NEGATIVE_INFINITY

  const month = CHANGELOG_MONTHS.get(monthMatch[1] ?? '') ?? 0
  const year = Number(monthMatch[2] ?? 0)

  return year * 100 + month
}

function sortChangelogDocs(docs: ICachedDoc[]): ICachedDoc[] {
  return [...docs].sort((a, b) => getChangelogSortKey(b) - getChangelogSortKey(a))
}

// -- Fuzzy search ------------------------------------------------------------

/**
 * Compute edit distance between two strings (Levenshtein).
 * Used for typo-tolerant matching.
 */
export function editDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  const firstRow = matrix[0]
  if (!firstRow) return 0
  for (let j = 0; j <= a.length; j++) {
    firstRow[j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    const row = matrix[i]
    const previousRow = matrix[i - 1]
    if (!row || !previousRow) continue

    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        row[j] = previousRow[j - 1] ?? 0
      } else {
        row[j] = Math.min(
          (previousRow[j - 1] ?? 0) + 1, // substitution
          (row[j - 1] ?? 0) + 1, // insertion
          (previousRow[j] ?? 0) + 1, // deletion
        )
      }
    }
  }

  return matrix[b.length]?.[a.length] ?? 0
}

/**
 * Check if a term fuzzy-matches a target string.
 * Returns true if the term appears as a substring or if any word
 * in the target is within edit distance 2 of the term.
 */
export function fuzzyMatch(term: string, target: string): boolean {
  if (target.includes(term)) return true
  if (term.length < 3) return false // too short for fuzzy
  const words = target.split(/[\s\-_/]+/)
  const maxDist = term.length <= 4 ? 1 : 2
  return words.some((word) => editDistance(term, word) <= maxDist)
}

/**
 * Score a fuzzy match. Higher = better match.
 * Exact substring > close edit distance > distant match.
 */
export function fuzzyScore(term: string, target: string): number {
  if (target.includes(term)) return 3
  if (term.length < 3) return 0
  const words = target.split(/[\s\-_/]+/)
  const maxDist = term.length <= 4 ? 1 : 2
  let bestDist = Infinity
  for (const word of words) {
    const dist = editDistance(term, word)
    if (dist < bestDist) bestDist = dist
  }
  if (bestDist <= maxDist) return maxDist - bestDist + 1
  return 0
}

interface IWeightedSearchField {
  text: string
  exactWeight: number
  fuzzyWeight: number
  stemmedExactWeight?: number
}

interface IWeightedBodyField {
  text: string
  exactCap: number
  stemmedExactCap?: number
}

interface IScoreKeywordQueryOptions {
  terms: string[]
  stemmedTerms?: string[]
  fields: IWeightedSearchField[]
  body?: IWeightedBodyField
}

export function scoreKeywordQuery({ terms, stemmedTerms = terms, fields, body }: IScoreKeywordQueryOptions): number {
  let score = 0

  for (let index = 0; index < terms.length; index++) {
    const term = terms[index]
    if (!term) continue
    const stemmedTerm = stemmedTerms[index] ?? term

    for (const field of fields) {
      if (field.text.includes(term)) score += field.exactWeight
      score += fuzzyScore(term, field.text) * field.fuzzyWeight
    }

    if (body) {
      const bodyMatches = body.text.split(term).length - 1
      score += Math.min(bodyMatches, body.exactCap)
    }

    if (stemmedTerm === term) continue

    for (const field of fields) {
      const stemmedWeight = field.stemmedExactWeight
      if (stemmedWeight !== undefined && field.text.includes(stemmedTerm)) {
        score += stemmedWeight
      }
    }

    if (body?.stemmedExactCap !== undefined) {
      const stemmedBodyMatches = body.text.split(stemmedTerm).length - 1
      score += Math.min(stemmedBodyMatches, body.stemmedExactCap)
    }
  }

  return score
}

// -- Rate limiting -----------------------------------------------------------

const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 60 // 60 requests per minute per IP

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 5 * 60_000).unref?.()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

export function getRateLimitResponse(ip: string): Response | null {
  if (checkRateLimit(ip)) return null
  return new Response(JSON.stringify({ error: 'Rate limit exceeded. Max 60 requests per minute.' }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
  })
}

// -- Slug validation ---------------------------------------------------------

/**
 * Validate and sanitize a slug to prevent path traversal attacks.
 * Rejects slugs containing "..", absolute paths, or non-alphanumeric path characters.
 */
export function validateSlug(slug: string): { valid: boolean; sanitized: string; error?: string } {
  if (slug.includes('..')) return { valid: false, sanitized: '', error: 'Path traversal ("..") is not allowed.' }
  if (slug.startsWith('/') || slug.startsWith('\\'))
    return { valid: false, sanitized: '', error: 'Absolute paths are not allowed.' }
  if (/[<>:"|?*\\]/.test(slug)) return { valid: false, sanitized: '', error: 'Slug contains invalid characters.' }

  // Normalize: trim whitespace, remove leading/trailing slashes, collapse double slashes
  const sanitized = slug
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
  if (sanitized.length === 0) return { valid: false, sanitized: '', error: 'Slug cannot be empty.' }

  return { valid: true, sanitized }
}

// -- Request logging ---------------------------------------------------------

function logRequest(tool: string, params: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const paramStr = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(' ')
  console.log(`[MCP ${timestamp}] ${tool} ${paramStr}`)
}

// -- Server ------------------------------------------------------------------

const CATEGORY_ENUM = z.enum(['components', 'installation', 'packages', 'changelog', 'dark-theme', 'general', 'all'])

export function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: 'acme-docs',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
      instructions: [
        'MCP server for acme/ui documentation (ui.acme.com).',
        'Tools: list_docs -> browse catalog, search_docs -> keyword search (fuzzy), semantic_search -> natural language search (TF-IDF), read_doc -> full page, get_component_api -> props only, get_examples -> code only, get_changelog -> version history, get_installation -> setup guide, suggest_components -> find the right component.',
        'Tip: use semantic_search for conceptual queries ("how to handle forms"), search_docs for specific keywords. Use list_docs to browse, then read_doc for details.',
        'Categories: components, installation, packages, changelog, dark-theme, general.',
      ].join(' '),
    },
  )

  // -- list_docs --------------------------------------------------------------

  server.tool(
    'list_docs',
    'List documentation pages with pagination. Optionally filter by category. Returns slug, title, description  -  compact by default.',
    {
      category: CATEGORY_ENUM.default('all').describe('Filter by category. Use "all" for everything.'),
      page: z.number().min(1).default(1).describe('Page number (1-based). Each page returns up to 20 items.'),
    },
    async ({ category, page }) => {
      logRequest('list_docs', { category, page })
      const index = await getDocsIndex()
      const filtered = getDocsForCategory(index, category)

      const pageSize = 20
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
      const safePage = Math.min(page, totalPages)
      const start = (safePage - 1) * pageSize
      const slice = filtered.slice(start, start + pageSize)

      const lines = slice.map((d) => `- **${d.title}** \`${d.slug}\`  -  ${d.description || '(no description)'}`)

      const pagination =
        totalPages > 1
          ? `\n\n*Page ${safePage}/${totalPages} (${filtered.length} total). Use page=${safePage + 1} for more.*`
          : ''

      return {
        content: [
          {
            type: 'text' as const,
            text: `${filtered.length} docs${category !== 'all' ? ` in "${category}"` : ''}:\n\n${lines.join('\n')}${pagination}`,
          },
        ],
      }
    },
  )

  // -- read_doc ---------------------------------------------------------------

  server.tool(
    'read_doc',
    'Read a documentation page. Returns clean markdown (MDX syntax stripped). Use mode="summary" for a headings-only overview that saves tokens, or mode="full" for complete content. Responses over 4000 chars are truncated  -  use section parameter to read specific parts.',
    {
      slug: z.string().describe('Doc page slug, e.g. "components/button", "installation/next", "packages/acme-cli"'),
      mode: z
        .enum(['full', 'summary'])
        .default('full')
        .describe(
          '"full" returns the complete page. "summary" returns only headings + first paragraph each (saves tokens).',
        ),
      section: z
        .string()
        .optional()
        .describe('Optional heading to extract a single section, e.g. "API Reference", "Installation", "Usage".'),
    },
    async ({ slug, mode, section }) => {
      logRequest('read_doc', { slug, mode, section })
      const check = validateSlug(slug)
      if (!check.valid) {
        return { content: [{ type: 'text' as const, text: check.error ?? 'Invalid slug.' }], isError: true }
      }

      const index = await getDocsIndex()
      const doc = getDoc(index, check.sanitized)
      if (!doc) {
        return {
          content: [{ type: 'text' as const, text: `Not found: "${slug}". Use list_docs to browse available pages.` }],
          isError: true,
        }
      }

      let output: string

      if (section) {
        const result = extractSection(doc.cleanBody, section)
        if (!result.found) {
          output = `No section "${section}" found in "${slug}". Available headings:\n${result.headings.join('\n')}`
        } else {
          output = result.content
        }
      } else if (mode === 'summary') {
        output = extractSummary(doc.cleanBody)
      } else {
        output = doc.cleanBody
      }

      const header = `# ${doc.title}${doc.description ? `\n> ${doc.description}` : ''}\n\n`
      return {
        content: [{ type: 'text' as const, text: truncate(header + output) }],
      }
    },
  )

  // -- search_docs ------------------------------------------------------------

  server.tool(
    'search_docs',
    'Search documentation by keyword with typo tolerance. Returns matching pages with context snippets, ranked by relevance. Handles misspellings like "buton" -> "button".',
    {
      query: z.string().describe('Search keyword or phrase'),
      category: CATEGORY_ENUM.default('all').describe('Narrow search to a category'),
      limit: z.number().min(1).max(20).default(10).describe('Max results to return'),
    },
    async ({ query, category, limit }) => {
      logRequest('search_docs', { query, category, limit })
      const index = await getDocsIndex()
      const queryLower = query.toLowerCase()
      const queryTerms = expandSearchTerms(query)
      const stemmedTerms = queryTerms.map((t) => stem(t))
      const scoreDocs = (docs: ICachedDoc[]) => {
        const results: { slug: string; title: string; score: number; snippet: string }[] = []

        for (const doc of docs) {
          const titleLower = doc.title.toLowerCase()
          const descLower = doc.description.toLowerCase()
          const slugLower = doc.slug.toLowerCase()
          const score = scoreKeywordQuery({
            terms: queryTerms,
            stemmedTerms,
            fields: [
              { text: titleLower, exactWeight: 10, fuzzyWeight: 3, stemmedExactWeight: 8 },
              { text: slugLower, exactWeight: 8, fuzzyWeight: 2, stemmedExactWeight: 6 },
              { text: descLower, exactWeight: 5, fuzzyWeight: 1, stemmedExactWeight: 4 },
            ],
            body: { text: doc.cleanBodyLower, exactCap: 5, stemmedExactCap: 3 },
          })

          if (score === 0) continue

          const lines = doc.cleanBody.split('\n')
          let snippet = ''
          for (let i = 0; i < lines.length; i++) {
            if (lines[i]?.toLowerCase().includes(queryLower)) {
              const start = Math.max(0, i - 1)
              const end = Math.min(lines.length, i + 2)
              snippet = lines
                .slice(start, end)
                .map((line) => line.trim())
                .filter(Boolean)
                .join(' ')
                .slice(0, 200)
              break
            }
          }

          results.push({ slug: doc.slug, title: doc.title, score, snippet })
        }

        return results
      }

      const fallbackDocs = getDocsForCategory(index, category)
      const candidateDocs = getCandidateDocs(index, query, category)
      const results =
        candidateDocs.length === fallbackDocs.length ? scoreDocs(candidateDocs) : scoreDocs(candidateDocs).concat()

      const rescoredResults =
        results.length > 0 || candidateDocs.length === fallbackDocs.length ? results : scoreDocs(fallbackDocs)

      rescoredResults.sort((a, b) => b.score - a.score)
      const top = rescoredResults.slice(0, limit)

      if (top.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No results for "${query}"${category !== 'all' ? ` in "${category}"` : ''}. Try a broader query, a different category, or use \`semantic_search\` for conceptual matching.`,
            },
          ],
        }
      }

      const output = top
        .map((r) => {
          const snippetLine = r.snippet ? `\n  > ${r.snippet}` : ''
          return `- **${r.title}** \`${r.slug}\`${snippetLine}`
        })
        .join('\n')

      return {
        content: [
          {
            type: 'text' as const,
            text: `${top.length} result(s) for "${query}":\n\n${output}`,
          },
        ],
      }
    },
  )

  // -- get_component_api ------------------------------------------------------

  server.tool(
    'get_component_api',
    'Get just the API reference / props table for a component. Much more token-efficient than reading the full page when you only need the props.',
    {
      component: z.string().describe('Component name, e.g. "button", "dialog", "select"'),
    },
    async ({ component }) => {
      logRequest('get_component_api', { component })
      const index = await getDocsIndex()
      const slug = `components/${component.toLowerCase().replace(/[^a-z0-9-]/g, '')}`
      const doc = getDoc(index, slug)
      if (!doc) {
        // Fuzzy fallback: suggest similar component names
        const components = getDocsForCategory(index, 'components')
        const suggestions = components
          .map((d) => ({
            name: d.slug.replace('components/', ''),
            dist: editDistance(component.toLowerCase(), d.slug.replace('components/', '')),
          }))
          .filter((s) => s.dist <= 3)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3)
          .map((s) => `\`${s.name}\``)

        const hint =
          suggestions.length > 0
            ? ` Did you mean: ${suggestions.join(', ')}?`
            : ' Use list_docs with category="components" to browse.'

        return {
          content: [{ type: 'text' as const, text: `Component "${component}" not found.${hint}` }],
          isError: true,
        }
      }

      const lines = doc.cleanBody.split('\n')
      const apiLines: string[] = []
      let capturing = false

      for (const line of lines) {
        const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
        if (headingMatch) {
          const text = headingMatch[2]?.toLowerCase() ?? ''
          if (text.includes('api') || text.includes('props') || text.includes('parameters')) {
            capturing = true
          } else if (capturing && (headingMatch[1]?.length ?? 0) <= 2) {
            if (!text.includes('api') && !text.includes('props')) break
          }
        }
        if (capturing) apiLines.push(line)
      }

      if (apiLines.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No API reference section found for "${doc.title}". Try read_doc with slug="${slug}" for the full page.`,
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: truncate(`# ${doc.title}  -  API Reference\n\n${apiLines.join('\n').trim()}`),
          },
        ],
      }
    },
  )

  // -- get_examples -----------------------------------------------------------

  server.tool(
    'get_examples',
    'Get only the code examples from a documentation page. Returns all fenced code blocks without the surrounding prose  -  saves tokens when you just need to see usage patterns.',
    {
      slug: z.string().describe('Doc page slug, e.g. "components/button", "installation/next"'),
    },
    async ({ slug }) => {
      logRequest('get_examples', { slug })
      const check = validateSlug(slug)
      if (!check.valid) {
        return { content: [{ type: 'text' as const, text: check.error ?? 'Invalid slug.' }], isError: true }
      }

      const index = await getDocsIndex()
      const doc = getDoc(index, check.sanitized)
      if (!doc) {
        return {
          content: [{ type: 'text' as const, text: `Not found: "${slug}". Use list_docs to browse available pages.` }],
          isError: true,
        }
      }

      if (doc.codeBlocks.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `No code examples found in "${doc.title}".` }],
        }
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: truncate(
              `# ${doc.title}  -  Code Examples (${doc.codeBlocks.length})\n\n${doc.codeBlocks.join('\n\n')}`,
            ),
          },
        ],
      }
    },
  )

  // -- get_changelog ----------------------------------------------------------

  server.tool(
    'get_changelog',
    'Get changelog entries. Filter by version or component name to see what changed. E.g. version="2.3" or component="button".',
    {
      version: z
        .string()
        .optional()
        .describe(
          'Optional version to filter by, e.g. "2.3", "1.0.0". Returns entries containing this version string.',
        ),
      component: z
        .string()
        .optional()
        .describe(
          'Optional component name to filter by, e.g. "button", "dialog". Returns entries that mention this component.',
        ),
      limit: z.number().min(1).max(20).default(5).describe('Max changelog entries to return'),
    },
    async ({ version, component, limit }) => {
      logRequest('get_changelog', { version, component, limit })
      const index = await getDocsIndex()
      let changelogDocs = sortChangelogDocs(
        getDocsForCategory(index, 'changelog').filter((d) => d.slug !== 'changelog/index'),
      )

      if (changelogDocs.length === 0) {
        return {
          content: [{ type: 'text' as const, text: 'No changelog documentation found.' }],
        }
      }

      if (version) {
        const vLower = version.toLowerCase()
        changelogDocs = changelogDocs.filter(
          (d) => d.title.toLowerCase().includes(vLower) || d.cleanBodyLower.includes(vLower) || d.slug.includes(vLower),
        )

        if (changelogDocs.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No changelog entries found for version "${version}". Use get_changelog without a version to see all entries.`,
              },
            ],
          }
        }
      }

      if (component) {
        const compLower = component.toLowerCase()
        const stemmedComp = stem(compLower)
        changelogDocs = changelogDocs.filter(
          (d) =>
            d.cleanBodyLower.includes(compLower) ||
            d.cleanBodyLower.includes(stemmedComp) ||
            d.title.toLowerCase().includes(compLower) ||
            fuzzyMatch(compLower, d.cleanBodyLower),
        )

        if (changelogDocs.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No changelog entries found mentioning "${component}". Try a different name or use get_changelog without filters.`,
              },
            ],
          }
        }
      }

      const entries = changelogDocs.slice(0, limit)

      const output = entries
        .map((d) => {
          const summary = extractSummary(d.cleanBody)
          return `## ${d.title}\n\`${d.slug}\`\n\n${summary}`
        })
        .join('\n\n---\n\n')

      return {
        content: [
          {
            type: 'text' as const,
            text: truncate(`# Changelog (${entries.length}/${changelogDocs.length} entries)\n\n${output}`),
          },
        ],
      }
    },
  )

  // -- get_installation -------------------------------------------------------

  server.tool(
    'get_installation',
    'Get the installation/setup guide for a specific framework. Shortcut that finds the right installation page and returns its content.',
    {
      framework: z.string().describe('Framework name, e.g. "next", "vite", "remix", "astro", "manual"'),
    },
    async ({ framework }) => {
      logRequest('get_installation', { framework })
      const index = await getDocsIndex()
      const fwLower = framework.toLowerCase()

      // Try exact slug match first
      let doc = getDoc(index, `installation/${fwLower}`)

      // Fuzzy fallback: search installation docs
      if (!doc) {
        const installDocs = getDocsForCategory(index, 'installation')
        const match = installDocs.find(
          (d) =>
            d.title.toLowerCase().includes(fwLower) ||
            d.slug.toLowerCase().includes(fwLower) ||
            fuzzyMatch(fwLower, d.title.toLowerCase()),
        )
        if (match) doc = match
      }

      if (!doc) {
        const installDocs = getDocsForCategory(index, 'installation')
        const available = installDocs.map((d) => `\`${d.slug.replace('installation/', '')}\``).join(', ')
        return {
          content: [
            {
              type: 'text' as const,
              text: `No installation guide found for "${framework}". Available: ${available || 'none'}.`,
            },
          ],
          isError: true,
        }
      }

      const header = `# ${doc.title}${doc.description ? `\n> ${doc.description}` : ''}\n\n`
      return {
        content: [{ type: 'text' as const, text: truncate(header + doc.cleanBody) }],
      }
    },
  )

  // -- suggest_components -----------------------------------------------------

  server.tool(
    'suggest_components',
    'Describe what you need and get ranked component suggestions. E.g. "I need a date picker" or "modal with form" or "dropdown menu". Uses fuzzy matching across titles, descriptions, and content.',
    {
      need: z
        .string()
        .describe('Describe what you need, e.g. "date picker", "modal dialog", "data table", "file upload"'),
      limit: z.number().min(1).max(10).default(5).describe('Max suggestions to return'),
    },
    async ({ need, limit }) => {
      logRequest('suggest_components', { need, limit })
      const index = await getDocsIndex()
      const terms = expandSearchTerms(need)
      const scoreComponents = (components: ICachedDoc[]) =>
        components
          .map((doc) => {
            const titleLower = doc.title.toLowerCase()
            const descLower = doc.description.toLowerCase()
            const slugName = doc.slug.replace('components/', '')
            const score = scoreKeywordQuery({
              terms,
              fields: [
                { text: titleLower, exactWeight: 10, fuzzyWeight: 2 },
                { text: slugName, exactWeight: 8, fuzzyWeight: 2 },
                { text: descLower, exactWeight: 5, fuzzyWeight: 1 },
              ],
              body: { text: doc.cleanBodyLower, exactCap: 3 },
            })

            return { slug: doc.slug, title: doc.title, description: doc.description, score }
          })
          .filter((result) => result.score > 0)

      const allComponents = getDocsForCategory(index, 'components')
      const candidateComponents = getCandidateDocs(index, need, 'components')
      const scored =
        candidateComponents.length === allComponents.length
          ? scoreComponents(candidateComponents)
          : (() => {
              const candidateResults = scoreComponents(candidateComponents)
              return candidateResults.length > 0 ? candidateResults : scoreComponents(allComponents)
            })()
      scored.sort((a, b) => b.score - a.score)
      const top = scored.slice(0, limit)

      if (top.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No components found matching "${need}". Use list_docs with category="components" to browse all components.`,
            },
          ],
        }
      }

      const output = top
        .map((r, i) => `${i + 1}. **${r.title}** \`${r.slug}\`  -  ${r.description || '(no description)'}`)
        .join('\n')

      return {
        content: [
          {
            type: 'text' as const,
            text: `Top ${top.length} component(s) for "${need}":\n\n${output}\n\nUse \`read_doc\` or \`get_component_api\` with the slug for details.`,
          },
        ],
      }
    },
  )

  // -- semantic_search --------------------------------------------------------

  server.tool(
    'semantic_search',
    'Natural language search using TF-IDF vectors and cosine similarity. Better than keyword search for conceptual queries like "how to handle form validation" or "popup overlay component". Understands meaning, not just keywords.',
    {
      query: z
        .string()
        .describe(
          'Natural language query, e.g. "how to create a popup dialog", "form input validation", "customizing component themes"',
        ),
      category: CATEGORY_ENUM.default('all').describe('Narrow search to a category'),
      limit: z.number().min(1).max(20).default(5).describe('Max results to return'),
      threshold: z
        .number()
        .min(0)
        .max(1)
        .default(0.05)
        .describe('Minimum similarity score (0-1). Lower = more results, higher = more relevant.'),
    },
    async ({ query, category, limit, threshold }) => {
      logRequest('semantic_search', { query, category, limit, threshold })
      const index = await getDocsIndex()

      // Build query vector using the same TF-IDF pipeline
      const queryTokens = tokenize(expandSearchText(query))
      const queryTf = computeTf(queryTokens)
      const queryVector = computeTfidfVector(queryTf, index.idf)

      if (queryVector.size === 0) {
        return {
          content: [{ type: 'text' as const, text: `Could not process query "${query}". Try different wording.` }],
        }
      }

      // Cosine similarity can only be non-zero when a doc shares indexed terms
      // with the query, so reuse the inverted index as a safe prefilter.
      const candidateDocs = getCandidateDocs(index, query, category)

      // Score each doc by cosine similarity
      const results: { slug: string; title: string; description: string; similarity: number; snippet: string }[] = []

      for (const doc of candidateDocs) {
        const similarity = cosineSimilarity(queryVector, doc.tfidfVector)
        if (similarity < threshold) continue

        // Extract snippet around the most relevant term
        const queryLower = query.toLowerCase()
        const queryTerms = queryLower.split(/\s+/).filter((t) => t.length >= 2)
        const lines = doc.cleanBody.split('\n')
        let snippet = ''

        for (let i = 0; i < lines.length; i++) {
          const lineLower = lines[i]?.toLowerCase() ?? ''
          if (queryTerms.some((t) => lineLower.includes(t))) {
            const start = Math.max(0, i - 1)
            const end = Math.min(lines.length, i + 2)
            snippet = lines
              .slice(start, end)
              .map((l) => l.trim())
              .filter(Boolean)
              .join(' ')
              .slice(0, 200)
            break
          }
        }

        results.push({
          slug: doc.slug,
          title: doc.title,
          description: doc.description,
          similarity,
          snippet,
        })
      }

      results.sort((a, b) => b.similarity - a.similarity)
      const top = results.slice(0, limit)

      if (top.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No semantically similar docs found for "${query}"${category !== 'all' ? ` in "${category}"` : ''}. Try search_docs for keyword matching or lower the threshold.`,
            },
          ],
        }
      }

      const output = top
        .map((r) => {
          const score = `(${(r.similarity * 100).toFixed(1)}% match)`
          const snippetLine = r.snippet ? `\n  > ${r.snippet}` : ''
          const desc = r.description ? `  -  ${r.description}` : ''
          return `- **${r.title}** \`${r.slug}\` ${score}${desc}${snippetLine}`
        })
        .join('\n')

      return {
        content: [
          {
            type: 'text' as const,
            text: `${top.length} semantic result(s) for "${query}":\n\n${output}\n\nUse \`read_doc\` with the slug to read any of these pages.`,
          },
        ],
      }
    },
  )

  return server
}
