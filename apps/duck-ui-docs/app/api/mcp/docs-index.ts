/**
 * Documentation index: file system access, index building, caching.
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import {
  clearPersistedDocsIndex,
  getPersistedDocsIndexPath,
  loadPersistedDocsIndex,
  type IPersistedDocsIndexEntry,
  writePersistedDocsIndex,
} from './docs-index-persistence'
import { extractCodeBlocks, parseFrontmatter, stripMdxSyntax } from './text'
import { computeIdf, computeTf, computeTfidfVector } from './tfidf'
import { expandSearchText, tokenize } from './tokenize'

// -- Types -------------------------------------------------------------------

const CONTENT_DIR_ENV_VAR = 'DUCK_UI_DOCS_CONTENT_DIR'

export interface ICachedDoc {
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

export interface ICachedDocsIndex {
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

// -- Constants ---------------------------------------------------------------

export const MAX_RESPONSE_CHARS = 4000
const CACHE_TTL = 60_000

// -- In-memory cache ---------------------------------------------------------

let cachedIndex: ICachedDocsIndex | null = null
let cacheTimestamp = 0
let cachedContentDir: string | null = null
let lastIndexLoadSource: DocsIndexLoadSource = 'rebuild'
let lastIndexCacheFilePath: string | null = null
let lastPersistedEntryCount = 0

// -- File system helpers -----------------------------------------------------

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

// -- Doc parsing -------------------------------------------------------------

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

async function readIndexedDocEntry(source: IDocSourceFile, baseDir: string): Promise<IIndexedDocEntry | null> {
  const content = await readDocFile(source.slug, baseDir)
  if (!content) return null

  const { title, description, body } = parseFrontmatter(content)
  const cleanBody = stripMdxSyntax(body)

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

// -- Index building ----------------------------------------------------------

export async function getDocsIndex(): Promise<ICachedDocsIndex> {
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

  cachedIndex = { docs, docsBySlug, docsByCategory, termToDocIndexes, idf }
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

// -- Index accessors ---------------------------------------------------------

export function getDoc(index: ICachedDocsIndex, slug: string): ICachedDoc | undefined {
  return index.docsBySlug.get(slug)
}

export function getDocsForCategory(index: ICachedDocsIndex, category: string): ICachedDoc[] {
  return category === 'all' ? index.docs : (index.docsByCategory.get(category) ?? [])
}

export function getCandidateDocs(index: ICachedDocsIndex, query: string, category: string): ICachedDoc[] {
  const queryTokens = [...new Set(tokenize(expandSearchText(query)))]
  const candidateIndexes = new Set<number>()

  for (const token of queryTokens) {
    for (const docIndex of index.termToDocIndexes.get(token) ?? []) {
      candidateIndexes.add(docIndex)
    }
  }

  if (candidateIndexes.size === 0) {
    return getDocsForCategory(index, category)
  }

  const candidateDocs = [...candidateIndexes]
    .map((docIndex) => index.docs[docIndex])
    .filter((doc): doc is ICachedDoc => Boolean(doc))
  return category === 'all' ? candidateDocs : candidateDocs.filter((doc) => doc.category === category)
}

export function truncate(text: string): string {
  if (text.length <= MAX_RESPONSE_CHARS) return text
  return (
    text.slice(0, MAX_RESPONSE_CHARS) +
    '\n\n---\n*[Truncated  -  use `section` parameter or `mode="summary"` to get specific parts]*'
  )
}

// -- Changelog helpers -------------------------------------------------------

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

  if (/^\d{4}$/.test(slug)) return Number(slug) * 100

  const monthMatch = slug.match(
    /^(january|february|march|april|may|june|july|august|september|october|november|december)-(\d{4})$/,
  )
  if (!monthMatch) return Number.NEGATIVE_INFINITY

  const month = CHANGELOG_MONTHS.get(monthMatch[1] ?? '') ?? 0
  const year = Number(monthMatch[2] ?? 0)
  return year * 100 + month
}

export function sortChangelogDocs(docs: ICachedDoc[]): ICachedDoc[] {
  return [...docs].sort((a, b) => getChangelogSortKey(b) - getChangelogSortKey(a))
}

// -- Stats & testing ---------------------------------------------------------

export async function getDocsIndexStats(): Promise<{
  docCount: number
  categories: string[]
  indexedTermCount: number
  cacheAgeMs: number
  cacheTtlMs: number
  cache: { source: DocsIndexLoadSource; cacheFilePath: string | null; persistedEntries: number }
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
