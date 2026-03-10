import fs from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { createRegistryFileTree } from '../../lib/file-tree'
import { joinPosix, normalizeSlashes } from '../../lib/path'
import type { RegistryBuildSource, RegistryEntry, RegistryItemFile } from '../../types'
import type { IndexedRegistryEntry, RegistryBuildContext, RegistryBuildPhaseResult } from '../types'

function getSourceReference(source: RegistryBuildSource, context: RegistryBuildContext, entry: RegistryEntry) {
  const baseReference = source.referencePath ?? normalizeSlashes(path.relative(context.configDir, source.path))
  return joinPosix(baseReference, entry.root_folder)
}

async function discoverRegistryFiles(source: RegistryBuildSource, entry: RegistryEntry): Promise<RegistryItemFile[]> {
  const discoveryRoot = path.join(source.path, entry.root_folder)
  const files = (
    await fg(source.glob ?? '**/*.{ts,tsx}', {
      cwd: discoveryRoot,
      ignore: source.ignore,
      onlyFiles: true,
    })
  ).sort((left, right) => {
    const leftDepth = left.split('/').length
    const rightDepth = right.split('/').length

    if (leftDepth !== rightDepth) {
      return leftDepth - rightDepth
    }

    return left.localeCompare(right)
  })

  if (files.length === 0) {
    throw new Error(`No files found for entry "${entry.name}" in "${discoveryRoot}".`)
  }

  return files.map((filePath) => ({
    path: joinPosix(entry.root_folder, filePath),
    type: entry.type,
  }))
}

function createIndexedEntries(entry: IndexedRegistryEntry, source?: RegistryBuildSource) {
  if (source?.indexStrategy !== 'file' || !entry.files?.length) {
    return [entry]
  }

  return entry.files.map((file) => ({
    ...entry,
    files: [file],
    name: path.posix.basename(file.path, path.posix.extname(file.path)),
  }))
}

async function materializeRegistryEntry(context: RegistryBuildContext, entry: RegistryEntry): Promise<IndexedRegistryEntry[]> {
  const source = context.config.sources[entry.type]
  const files = entry.files?.length ? entry.files : source ? await discoverRegistryFiles(source, entry) : []
  const normalizedFiles = files.map((file) => ({
    ...file,
    path: normalizeSlashes(file.path),
    type: file.type || entry.type,
  }))

  const indexedEntry: IndexedRegistryEntry = {
    ...entry,
    files: normalizedFiles,
    source: source ? getSourceReference(source, context, entry) : entry.source,
    tree: createRegistryFileTree(
      normalizedFiles.map((file) => file.path),
      { basePath: entry.root_folder },
    ),
  }

  return createIndexedEntries(indexedEntry, source)
}

export async function runIndexBuildPhase(context: RegistryBuildContext): Promise<RegistryBuildPhaseResult> {
  const index: IndexedRegistryEntry[] = []

  for (const entries of Object.values(context.config.registries)) {
    for (const entry of entries) {
      index.push(...(await materializeRegistryEntry(context, entry)))
    }
  }

  await fs.mkdir(context.getPath('registryDir'), { recursive: true })
  await fs.writeFile(context.getPath('indexFile'), JSON.stringify(index, null, 2), 'utf8')

  context.setArtifact('index', index)
  context.registerOutput('index', context.getPath('indexFile'), {
    artifact: 'index',
    kind: 'registry-index',
  })

  return {
    itemCount: index.length,
    name: 'index',
    outputFiles: [context.getPath('indexFile')],
  }
}
