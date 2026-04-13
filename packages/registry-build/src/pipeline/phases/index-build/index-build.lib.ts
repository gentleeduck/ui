import path from 'node:path'
import fg from 'fast-glob'
import type { IRegistryBuildSource } from '../../../config/types'
import type { IIndexedRegistryEntry, IRegistryEntry, IRegistryItemFile } from '../../../extensions/ui/ui.registry.types'
import { createRegistryFileTree } from '../../../lib/file-tree'
import { hashValue } from '../../../lib/hash'
import { joinPosix, normalizeSlashes } from '../../../lib/path'
import type { IRegistryBuildContext } from '../../types'

/**
 * Derive the source reference stored in generated index entries.
 */
export function getSourceReference(source: IRegistryBuildSource, context: IRegistryBuildContext, entry: IRegistryEntry) {
  const baseReference = source.referencePath ?? normalizeSlashes(path.relative(context.configDir, source.path))
  return joinPosix(baseReference, entry.root_folder)
}

/**
 * Discover files for entries that rely on source globbing instead of explicit
 * file lists.
 */
export async function discoverRegistryFiles(
  source: IRegistryBuildSource,
  entry: IRegistryEntry,
): Promise<IRegistryItemFile[]> {
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

/**
 * Expand file-strategy sources into one indexed entry per discovered file.
 */
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

/**
 * Resolve the concrete file list for a registry entry, normalizing slashes on
 * the way out so downstream emitters stay platform-agnostic.
 */
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

/**
 * Hash only the static parts of an index entry so change detection can short
 * circuit before any expensive work.
 */
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

/**
 * Hash the final file list and source strategy for an index entry.
 */
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

/**
 * Build the final index entries, including the derived file tree used by the
 * component and adapter phases.
 */
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
