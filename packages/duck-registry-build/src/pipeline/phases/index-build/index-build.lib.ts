import path from 'node:path'
import fg from 'fast-glob'
import type { IRegistryBuildSource } from '../../../config/types'
import type { IIndexedRegistryEntry, IRegistryEntry, IRegistryItemFile } from '../../../extensions/ui/ui.registry.types'
import { createRegistryFileTree } from '../../../lib/file-tree'
import { hashValue } from '../../../lib/hash'
import { joinPosix, normalizeSlashes } from '../../../lib/path'
import { resolveWithinBase } from '../../../lib/safe-path'
import type { IRegistryBuildContext } from '../../types'

export function getSourceReference(
  source: IRegistryBuildSource,
  context: IRegistryBuildContext,
  entry: IRegistryEntry,
) {
  const baseReference = source.referencePath ?? normalizeSlashes(path.relative(context.configDir, source.path))
  return joinPosix(baseReference, entry.root_folder)
}

export async function discoverRegistryFiles(
  source: IRegistryBuildSource,
  entry: IRegistryEntry,
): Promise<IRegistryItemFile[]> {
  // Schema restricts `root_folder`, but assert containment so a hostile registry
  // can never glob outside `source.path` at build time.
  const discoveryRoot = resolveWithinBase(source.path, entry.root_folder, `root_folder for "${entry.name}"`)
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

// `indexStrategy: 'file'` fans the source out into one entry per discovered file,
// using the file's basename as the entry name; `item` keeps the original entry intact.
export function createIndexedEntries(entry: IIndexedRegistryEntry, source?: IRegistryBuildSource) {
  if (source?.indexStrategy !== 'file' || !entry.files?.length) {
    return [entry]
  }

  return entry.files.map((file) => ({
    ...entry,
    files: [file],
    name: path.posix.basename(file.path, path.posix.extname(file.path)),
  }))
}

export async function resolveRegistryFiles(context: IRegistryBuildContext, entry: IRegistryEntry) {
  const source = context.config.sources[entry.type]
  const files = entry.files?.length ? entry.files : source ? await discoverRegistryFiles(source, entry) : []

  return {
    files: files.map((file) => ({
      ...file,
      path: normalizeSlashes(file.path),
      type: file.type || entry.type,
    })),
    source,
  }
}

// Static parts only — paired with `createIndexEntrySignature` for the two-stage
// short-circuit. Excludes file contents and resolved-source state.
export function createIndexEntryStaticSignature(entry: IRegistryEntry, source?: IRegistryBuildSource) {
  return hashValue({
    entry: {
      ...entry,
      files: entry.files?.map((file) => ({
        path: normalizeSlashes(file.path),
        target: file.target,
        type: file.type,
      })),
    },
    source: source
      ? {
          glob: source.glob,
          ignore: source.ignore,
          indexStrategy: source.indexStrategy,
          referencePath: source.referencePath,
        }
      : null,
  })
}

export function createIndexEntrySignature(
  entry: IRegistryEntry,
  source: IRegistryBuildSource | undefined,
  files: IRegistryItemFile[],
) {
  return hashValue({
    files: files.map((file) => ({
      path: file.path,
      target: file.target,
      type: file.type,
    })),
    sourceReference: source?.referencePath ?? null,
    staticSignature: createIndexEntryStaticSignature(entry, source),
  })
}

export function materializeIndexedEntries(
  context: IRegistryBuildContext,
  entry: IRegistryEntry,
  source: IRegistryBuildSource | undefined,
  files: IRegistryItemFile[],
) {
  const indexedEntry: IIndexedRegistryEntry = {
    ...entry,
    files,
    source: source ? getSourceReference(source, context, entry) : entry.source,
    tree: createRegistryFileTree(
      files.map((file) => file.path),
      { basePath: entry.root_folder },
    ),
  }

  return createIndexedEntries(indexedEntry, source)
}
