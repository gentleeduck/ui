import fs from 'node:fs/promises'
import path from 'node:path'
import { registryEntrySchema } from '../../../config/schema'
import { getRegistryFileTarget } from '../../../extensions/ui/lib/file-target'
import { applyContentRewrites } from '../../../extensions/ui/lib/import-rewriter'
import { stripSourceVariables } from '../../../extensions/ui/lib/ts-morph'
import type { IIndexedRegistryEntry } from '../../../extensions/ui/ui.registry.types'
import { hashValue } from '../../../lib/hash'
import type { IRegistryBuildContext } from '../../types'

async function readRegistryFileContent(
  context: IRegistryBuildContext,
  item: IIndexedRegistryEntry,
  file: NonNullable<IIndexedRegistryEntry['files']>[number],
) {
  if (typeof file.content === 'string') {
    return file.content
  }

  const source = context.config.sources[item.type]
  if (!source) {
    throw new Error(
      `Cannot resolve content for "${item.name}" because no source is configured for type "${item.type}".`,
    )
  }

  return fs.readFile(path.join(source.path, file.path), 'utf8')
}

/** Hash the component's config and output targets, excluding source file contents. */
export function createComponentStaticSignature(context: IRegistryBuildContext, item: IIndexedRegistryEntry) {
  const { tree: _tree, ...componentItem } = item

  return hashValue({
    componentItem,
    contentRewrites: context.config.importMappings.contentRewrites,
    outputTargets: (item.files ?? []).map((file) => ({
      path: file.path,
      target: getRegistryFileTarget(file, item, context.config.targetPaths),
      type: file.type,
    })),
    stripVariables: context.config.stripVariables,
  })
}

/**
 * Combine static config with source file hashes so incremental rebuilds can
 * skip unchanged components safely.
 */
export async function createComponentSignature(
  context: IRegistryBuildContext,
  item: IIndexedRegistryEntry,
  staticSignature: string,
) {
  const source = context.config.sources[item.type]
  const fileHashes = await Promise.all(
    (item.files ?? []).map(async (file) => {
      if (typeof file.content === 'string') {
        return {
          hash: hashValue(file.content),
          path: file.path,
        }
      }

      if (!source) {
        throw new Error(
          `Cannot hash content for "${item.name}" because no source is configured for type "${item.type}".`,
        )
      }

      return {
        hash: await context.cache.getFileHash(path.join(source.path, file.path)),
        path: file.path,
      }
    }),
  )

  return hashValue({
    fileHashes,
    staticSignature,
  })
}

/**
 * Materialize a registry component payload with stripped variables and rewritten
 * imports so the emitted JSON matches the configured output contract.
 */
export async function buildComponentPayload(context: IRegistryBuildContext, item: IIndexedRegistryEntry) {
  const { tree: _tree, ...componentItem } = item
  const transformedFiles = await Promise.all(
    (item.files ?? []).map(async (file) => {
      const content = await readRegistryFileContent(context, item, file)
      const stripped = stripSourceVariables({
        content,
        filePath: file.path,
        project: context.project,
        stripVariables: context.config.stripVariables,
      })
      const rewritten = applyContentRewrites(stripped, context.config.importMappings.contentRewrites)

      return {
        content: rewritten,
        path: file.path,
        target: getRegistryFileTarget(file, item, context.config.targetPaths),
        type: item.type,
      }
    }),
  )

  return registryEntrySchema.parse({
    ...componentItem,
    files: transformedFiles,
  })
}
