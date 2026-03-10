import fs from 'node:fs/promises'
import path from 'node:path'
import { getComponentIndexAdapter } from '../../adapters'
import { DEFAULT_COMPONENT_INDEX_HEADER } from '../../config'
import { normalizeSlashes } from '../../lib/path'
import type {
  RegistryBuildComponentIndex,
  RegistryItemType,
  RegistryItemTypeMap,
} from '../../types'
import type { IndexedRegistryEntry, RegistryBuildContext, RegistryBuildPhaseResult } from '../types'

export interface RegistryBuildComponentIndexPhaseOptions<TType extends RegistryItemType = RegistryItemType>
  extends RegistryBuildComponentIndex<TType> {
  packageMappings?: RegistryItemTypeMap<string, TType>
}

function toIdentifier(name: string) {
  return `_${name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`
}

function getPrimaryFilePath(item: IndexedRegistryEntry) {
  const files = item.files ?? []
  if (files.length === 0) {
    return undefined
  }

  const normalizedRootFolder = normalizeSlashes(item.root_folder)
  const rootFolderBaseName = normalizedRootFolder.split('/').pop() ?? item.name
  const preferredRelativeNames = new Set([
    `${item.name}.ts`,
    `${item.name}.tsx`,
    `${rootFolderBaseName}.ts`,
    `${rootFolderBaseName}.tsx`,
  ])

  const preferredFile = files.find((file) => {
    const normalizedPath = normalizeSlashes(file.path)
    const relativePath = normalizedPath.startsWith(`${normalizedRootFolder}/`)
      ? normalizedPath.slice(normalizedRootFolder.length + 1)
      : normalizedPath

    return preferredRelativeNames.has(relativePath)
  })

  return preferredFile?.path ?? files[0]?.path
}

function createComponentPath(
  context: RegistryBuildContext,
  item: IndexedRegistryEntry,
  packageMappings: RegistryItemTypeMap<string>,
) {
  const source = context.config.sources[item.type]
  const packageBase = packageMappings[item.type] ?? source?.packageName

  if (!packageBase) {
    throw new Error(`No package mapping available for component index entry "${item.name}" of type "${item.type}".`)
  }

  const firstFilePath = getPrimaryFilePath(item)
  const relativeFileImportPath = firstFilePath
    ? normalizeSlashes(firstFilePath).replace(`${normalizeSlashes(item.root_folder)}/`, '').replace(/\.(ts|tsx|js|jsx)$/, '')
    : item.name

  return `${packageBase}/${normalizeSlashes(item.root_folder)}/${relativeFileImportPath}`
}

export async function runComponentIndexPhase(
  context: RegistryBuildContext,
  options: RegistryBuildComponentIndexPhaseOptions = {},
): Promise<RegistryBuildPhaseResult> {
  const index = context.getArtifact<IndexedRegistryEntry[]>('index') ?? []
  const componentIndex = {
    ...context.config.componentIndex,
    ...options,
    excludeTypes: options.excludeTypes ?? context.config.componentIndex.excludeTypes,
    generator: options.generator ?? context.config.componentIndex.generator,
    header: options.header ?? context.config.componentIndex.header,
  }
  const packageMappings = {
    ...context.config.importMappings.packageMappings,
    ...(options.packageMappings ?? {}),
  }
  const filteredItems = index.filter((item) => !componentIndex.excludeTypes.includes(item.type))
  const adapter = getComponentIndexAdapter(componentIndex.framework ?? context.config.componentIndex.framework)
  const header =
    !componentIndex.header ||
    (componentIndex.header === DEFAULT_COMPONENT_INDEX_HEADER && componentIndex.framework !== 'nextjs')
      ? adapter.defaultHeader
      : componentIndex.header

  if (componentIndex.generator) {
    await fs.mkdir(context.getPath('componentIndexDir'), { recursive: true })
    await fs.writeFile(context.getPath('componentIndexFile'), componentIndex.generator(filteredItems), 'utf8')
    context.registerOutput('componentIndex', context.getPath('componentIndexFile'), {
      artifact: 'index',
      kind: 'component-index',
    })

    return {
      itemCount: filteredItems.length,
      name: 'componentIndex',
      outputFiles: [context.getPath('componentIndexFile')],
    }
  }

  let imports = ''
  let entries = ''

  for (const item of filteredItems) {
    const id = toIdentifier(item.name)
    const componentPath = createComponentPath(context, item, packageMappings)

    imports += adapter.renderImport({
      componentPath,
      id,
      ssr: componentIndex.ssr ?? context.config.componentIndex.ssr,
    })
    entries += adapter.renderEntry({
      id,
      item,
    })
  }

  const content = `${header}${imports}
export const Index: Record<string, any> = {${entries}
}
`

  await fs.mkdir(context.getPath('componentIndexDir'), { recursive: true })
  await fs.writeFile(context.getPath('componentIndexFile'), content, 'utf8')
  context.registerOutput('componentIndex', context.getPath('componentIndexFile'), {
    artifact: 'index',
    kind: 'component-index',
  })

  return {
    itemCount: filteredItems.length,
    name: 'componentIndex',
    outputFiles: [context.getPath('componentIndexFile')],
  }
}
