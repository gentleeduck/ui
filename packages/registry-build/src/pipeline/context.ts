import path from 'node:path'
import { Project } from 'ts-morph'
import type { LoadedRegistryBuildConfig } from '../types'
import type {
  BuildOptions,
  RegistryBuildContext,
  RegistryBuildOutputPaths,
  RegistryBuildOutputRecord,
  RegistryBuildPathRegistry,
} from './types'

function createOutputPaths(config: LoadedRegistryBuildConfig['config']): RegistryBuildOutputPaths {
  const baseDir = config.output.dir
  const registryDir = path.join(baseDir, config.output.registryDir)
  const componentIndexDir = path.join(baseDir, config.output.componentIndexDir)

  return {
    baseDir,
    colorsDir: path.join(registryDir, config.output.colorsDir),
    componentIndexDir,
    componentIndexFile: path.join(componentIndexDir, config.output.componentIndexFile),
    componentsDir: path.join(registryDir, config.output.componentsDir),
    indexFile: path.join(registryDir, 'index.json'),
    registryDir,
    themesCssFile: path.join(registryDir, config.output.themesCssFile),
    themesDir: path.join(registryDir, config.output.themesDir),
  }
}

function createPathRegistry(outputPaths: RegistryBuildOutputPaths): RegistryBuildPathRegistry {
  return {
    baseDir: outputPaths.baseDir,
    named: {
      ...outputPaths,
    },
  }
}

export function createRegistryBuildContext(
  loaded: LoadedRegistryBuildConfig,
  options: Pick<BuildOptions, 'cwd' | 'phaseOverrides' | 'silent'> = {},
): RegistryBuildContext {
  const config = {
    ...loaded.config,
    pipeline: {
      ...loaded.config.pipeline,
      ...options.phaseOverrides,
    },
  }
  const outputPaths = createOutputPaths(config)
  const paths = createPathRegistry(outputPaths)
  const artifacts: RegistryBuildContext['artifacts'] = {}
  const outputs: RegistryBuildOutputRecord[] = []

  return {
    ...loaded,
    artifacts,
    config,
    cwd: options.cwd ? path.resolve(options.cwd) : process.cwd(),
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
      const record: RegistryBuildOutputRecord = {
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
