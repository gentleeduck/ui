import fs from 'node:fs/promises'
import { registryEntrySchema } from '../../../config/schema'
import { getRegistryFileTarget } from '../../../extensions/ui/lib/file-target'
import { applyContentRewrites, compileContentRewrites } from '../../../extensions/ui/lib/import-rewriter'
import { stripSourceVariables } from '../../../extensions/ui/lib/ts-morph'
import type { IIndexedRegistryEntry } from '../../../extensions/ui/ui.registry.types'
import { hashValue } from '../../../lib/hash'
import { resolveWithinBase } from '../../../lib/safe-path'
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

  return fs.readFile(resolveWithinBase(source.path, file.path, `file.path for "${item.name}"`), 'utf8')
}

// Excludes source file contents — paired with `createComponentSignature` below
// for the two-stage static/full short-circuit each phase runs against the cache.
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

// Adds per-file content hashes on top of the static signature, so a component
// whose config didn't change but whose source did still rebuilds.
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
        hash: await context.cache.getFileHash(
          resolveWithinBase(source.path, file.path, `file.path for "${item.name}"`),
        ),
        path: file.path,
      }
    }),
  )

  return hashValue({
    fileHashes,
    staticSignature,
  })
}

export async function buildComponentPayload(context: IRegistryBuildContext, item: IIndexedRegistryEntry) {
  const { tree: _tree, ...componentItem } = item
  // Compile rewrites once per component (cached across calls by pattern source)
  // so the inner loop reuses a single RegExp instance per pattern.
  const compiledRewrites = compileContentRewrites(context.config.importMappings.contentRewrites)
  const transformedFiles = await Promise.all(
    (item.files ?? []).map(async (file) => {
      const content = await readRegistryFileContent(context, item, file)
      const stripped = stripSourceVariables({
        content,
        filePath: file.path,
        project: context.project,
        stripVariables: context.config.stripVariables,
      })
      const rewritten = applyContentRewrites(stripped, compiledRewrites)

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
