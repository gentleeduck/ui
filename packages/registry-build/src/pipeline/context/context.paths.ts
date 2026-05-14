import path from 'node:path'
import type { ILoadedRegistryBuildConfig } from '../../config/loader/loader.types'
import type { IRegistryBuildOutputPaths, IRegistryBuildPathRegistry } from '../types'

// All paths are pre-joined here so downstream phases can use them directly.
export function createOutputPaths(config: ILoadedRegistryBuildConfig['config']): IRegistryBuildOutputPaths {
  const baseDir = config.output.dir
  const registryDir = path.join(baseDir, config.output.registryDir)
  const componentIndexDir = path.join(baseDir, config.output.componentIndexDir)
  const cacheDir = path.join(baseDir, config.performance.cacheDir)

  return {
    baseDir,
    cacheDir,
    cacheFile: path.join(cacheDir, 'build-cache.json'),
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

export function createPathRegistry(outputPaths: IRegistryBuildOutputPaths): IRegistryBuildPathRegistry {
  return {
    baseDir: outputPaths.baseDir,
    named: {
      ...outputPaths,
    },
  }
}
