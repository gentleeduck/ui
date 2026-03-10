import fs from 'node:fs/promises'
import path from 'node:path'
import { registryEntrySchema } from '../../config/schema'
import { getRegistryFileTarget } from '../../lib/file-target'
import { applyContentRewrites } from '../../lib/import-rewriter'
import { stripSourceVariables } from '../../lib/ts-morph'
import type { IndexedRegistryEntry, RegistryBuildContext, RegistryBuildPhaseResult } from '../types'

async function readRegistryFileContent(context: RegistryBuildContext, item: IndexedRegistryEntry, file: NonNullable<IndexedRegistryEntry['files']>[number]) {
  if (typeof file.content === 'string') {
    return file.content
  }

  const source = context.config.sources[item.type]
  if (!source) {
    throw new Error(`Cannot resolve content for "${item.name}" because no source is configured for type "${item.type}".`)
  }

  return fs.readFile(path.join(source.path, file.path), 'utf8')
}

export async function runComponentsPhase(context: RegistryBuildContext): Promise<RegistryBuildPhaseResult> {
  const index = context.getArtifact<IndexedRegistryEntry[]>('index') ?? []
  const outputFiles: string[] = []

  await fs.rm(context.getPath('componentsDir'), { force: true, recursive: true })
  await fs.mkdir(context.getPath('componentsDir'), { recursive: true })

  for (const item of index) {
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
          target: getRegistryFileTarget(file, item, context.config),
          type: item.type,
        }
      }),
    )

    const payload = registryEntrySchema.parse({
      ...componentItem,
      files: transformedFiles,
    })
    const outputFile = path.join(context.getPath('componentsDir'), `${item.name}.json`)

    await fs.writeFile(outputFile, JSON.stringify(payload, null, 2), 'utf8')
    outputFiles.push(outputFile)
  }

  context.registerOutput('components', outputFiles, {
    artifact: 'index',
    kind: 'registry-components',
  })

  return {
    itemCount: outputFiles.length,
    name: 'components',
    outputFiles,
  }
}
