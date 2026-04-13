import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

const CACHE_DIR_ENV_VAR = 'ACME_DOCS_MCP_CACHE_DIR'
const PERSISTED_INDEX_VERSION = 1

export interface IPersistedDocsIndexEntry {
  slug: string
  relativePath: string
  mtimeMs: number
  size: number
  doc: {
    slug: string
    title: string
    description: string
    category: string
    rawBody: string
    cleanBody: string
    cleanBodyLower: string
    codeBlocks: string[]
  }
  tfEntries: [string, number][]
}

export interface IPersistedDocsIndexSnapshot {
  version: number
  contentDir: string
  updatedAt: string
  entries: IPersistedDocsIndexEntry[]
}

function getResolvedCacheDir(): string {
  const configuredDir = process.env[CACHE_DIR_ENV_VAR]
  return configuredDir ? resolve(configuredDir) : resolve(join(tmpdir(), 'acme-docs-mcp-cache'))
}

export function getPersistedDocsIndexPath(contentDir: string): string {
  const hash = createHash('sha1').update(contentDir).digest('hex').slice(0, 12)
  return join(getResolvedCacheDir(), `docs-index-${hash}.json`)
}

function isPersistedSnapshot(value: unknown): value is IPersistedDocsIndexSnapshot {
  if (!value || typeof value !== 'object') return false

  const snapshot = value as Partial<IPersistedDocsIndexSnapshot>
  return (
    snapshot.version === PERSISTED_INDEX_VERSION &&
    typeof snapshot.contentDir === 'string' &&
    typeof snapshot.updatedAt === 'string' &&
    Array.isArray(snapshot.entries)
  )
}

export async function loadPersistedDocsIndex(contentDir: string): Promise<IPersistedDocsIndexSnapshot | null> {
  const filePath = getPersistedDocsIndexPath(contentDir)

  try {
    const parsed = JSON.parse(await readFile(filePath, 'utf-8')) as unknown
    if (!isPersistedSnapshot(parsed)) return null
    if (parsed.contentDir !== contentDir) return null
    return parsed
  } catch {
    return null
  }
}

export async function writePersistedDocsIndex(
  contentDir: string,
  snapshot: IPersistedDocsIndexSnapshot,
): Promise<string | null> {
  const filePath = getPersistedDocsIndexPath(contentDir)
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`

  try {
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(tempPath, JSON.stringify(snapshot), 'utf-8')
    await rename(tempPath, filePath)
    return filePath
  } catch {
    await rm(tempPath, { force: true }).catch(() => {})
    return null
  }
}

export async function clearPersistedDocsIndex(contentDir: string): Promise<void> {
  await rm(getPersistedDocsIndexPath(contentDir), { force: true })
}
