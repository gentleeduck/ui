import path from 'node:path'
import type { LoadedRegistryBuildConfig } from '../../config/loader/loader.types'
import type { RegistryBuildOutputPaths, RegistryBuildPathRegistry } from '../types'

/**
 * Derive all normalized output paths from a resolved build configuration.
 * Each path is fully resolved so downstream code never needs to join segments.
 */
export function createOutputPaths(config: LoadedRegistryBuildConfig['config']): RegistryBuildOutputPaths {
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

/**
 * Create a path registry from pre-computed output paths, providing a
 * name-based lookup for any registered path.
 */
export function createPathRegistry(outputPaths: RegistryBuildOutputPaths): RegistryBuildPathRegistry {
  return {
    baseDir: outputPaths.baseDir,
    named: {
      ...outputPaths,
    },
  }
}
