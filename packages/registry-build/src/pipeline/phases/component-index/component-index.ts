import { getComponentIndexAdapter } from '../../../adapters'
import { DEFAULT_COMPONENT_INDEX_HEADER } from '../../../config'
import type { IIndexedRegistryEntry } from '../../../extensions/ui/ui.registry.types'
import { pathExists, writeFileIfChanged } from '../../../lib/fs'
import type { IRegistryBuildContext, IRegistryBuildPhaseResult } from '../../types'
import { createComponentIndexSignature, renderComponentIndexContent } from './component-index.lib'
import type {
  IRegistryBuildComponentIndexCacheState,
  IRegistryBuildComponentIndexPhaseOptions,
} from './component-index.types'

export async function runComponentIndexPhase(
  context: IRegistryBuildContext,
  options: IRegistryBuildComponentIndexPhaseOptions = {},
): Promise<IRegistryBuildPhaseResult> {
  const previousCacheState = context.cache.getPhaseData<IRegistryBuildComponentIndexCacheState>('componentIndex')
  const index = context.getArtifact<IIndexedRegistryEntry[]>('index') ?? []
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
  const outputFile = context.getPath('componentIndexFile')
  const filteredItems = index.filter((item) => !componentIndex.excludeTypes.includes(item.type))
  const adapter = getComponentIndexAdapter(componentIndex.framework ?? context.config.componentIndex.framework)
  const header =
    !componentIndex.header ||
    (componentIndex.header === DEFAULT_COMPONENT_INDEX_HEADER && componentIndex.framework !== 'nextjs')
      ? adapter.defaultHeader
      : componentIndex.header

  const signature = createComponentIndexSignature({
    filteredItems,
    framework: componentIndex.framework,
    generator: componentIndex.generator,
    header,
    packageMappings,
    ssr: componentIndex.ssr ?? context.config.componentIndex.ssr,
  })

  if (previousCacheState?.signature === signature && (await pathExists(outputFile))) {
    context.registerOutput('componentIndex', outputFile, {
      artifact: 'index',
      kind: 'component-index',
    })

    return {
      details: 'reused cached output',
      itemCount: filteredItems.length,
      name: 'componentIndex',
      outputFiles: [],
    }
  }

  if (componentIndex.generator) {
    const wroteFile = await writeFileIfChanged(outputFile, componentIndex.generator(filteredItems))

    context.cache.setPhaseData<IRegistryBuildComponentIndexCacheState>('componentIndex', {
      outputFiles: [outputFile],
      signature,
    })
    context.registerOutput('componentIndex', outputFile, {
      artifact: 'index',
      kind: 'component-index',
    })

    return {
      itemCount: filteredItems.length,
      name: 'componentIndex',
      outputFiles: wroteFile ? [outputFile] : [],
    }
  }

  const content = renderComponentIndexContent({
    adapter,
    context,
    filteredItems,
    header,
    packageMappings,
    ssr: componentIndex.ssr ?? context.config.componentIndex.ssr,
  })

  const wroteFile = await writeFileIfChanged(outputFile, content)

  context.cache.setPhaseData<IRegistryBuildComponentIndexCacheState>('componentIndex', {
    outputFiles: [outputFile],
    signature,
  })
  context.registerOutput('componentIndex', outputFile, {
    artifact: 'index',
    kind: 'component-index',
  })

  return {
    itemCount: filteredItems.length,
    name: 'componentIndex',
    outputFiles: wroteFile ? [outputFile] : [],
  }
}
