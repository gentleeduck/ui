import path from 'node:path'
import { Project } from 'ts-morph'
import type { ILoadedRegistryBuildConfig } from '../../config/loader/loader.types'
import { normalizeSlashes } from '../../lib/path'
import { createRegistryBuildCache } from '../cache'
import type { IBuildOptions, IRegistryBuildContext, IRegistryBuildOutputRecord } from '../types'
import { createOutputPaths, createPathRegistry } from './context.paths'

export async function createRegistryBuildContext(
  loaded: ILoadedRegistryBuildConfig,
  options: Pick<IBuildOptions, 'changedOnly' | 'changedPaths' | 'cwd' | 'silent'> = {},
): Promise<IRegistryBuildContext> {
  const config = loaded.config
  const outputPaths = createOutputPaths(config)
  const paths = createPathRegistry(outputPaths)
  const artifacts: IRegistryBuildContext['artifacts'] = {
    collections: config.collections,
  }
  const outputs: IRegistryBuildOutputRecord[] = []
  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd()
  const changedPaths = (options.changedPaths ?? []).map((targetPath) => normalizeSlashes(path.resolve(cwd, targetPath)))
  const cache = await createRegistryBuildCache({
    enabled: config.performance.incremental,
    filePath: outputPaths.cacheFile,
  })

  return {
    ...loaded,
    artifacts,
    cache,
    changedOnly: options.changedOnly ?? false,
    changedPaths,
    config,
    cwd,
    getArtifact: <TValue = unknown>(name: string) => artifacts[name] as TValue | undefined,
    getOutput: (name) => outputs.find((output) => output.name === name),
    getPath: (name) => {
      const targetPath = paths.named[name]
      if (!targetPath) {
        throw new Error(`Unknown registry build path "${name}".`)
      }

      return targetPath
    },
    listOutputs: () => [...outputs],
    outputPaths,
    outputs,
    paths,
    project: new Project({
      compilerOptions: {},
    }),
    registerOutput: (name, outputPaths, metadata) => {
      const record: IRegistryBuildOutputRecord = {
        metadata,
        name,
        paths: Array.isArray(outputPaths) ? [...outputPaths] : [outputPaths],
      }
      const existingIndex = outputs.findIndex((output) => output.name === name)

      if (existingIndex >= 0) {
        outputs[existingIndex] = record
      } else {
        outputs.push(record)
      }

      return record
    },
    setArtifact: (name, value) => {
      artifacts[name] = value
      return value
    },
    silent: options.silent ?? false,
  }
}
