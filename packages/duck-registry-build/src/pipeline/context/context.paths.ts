import os from 'node:os'
import path from 'node:path'
import type { ILoadedRegistryBuildConfig } from '../../config/loader/loader.types'
import type { IRegistryBuildOutputPaths, IRegistryBuildPathRegistry } from '../types'

// Refuse output dirs that would let a hostile config write anywhere on the host.
// We reject filesystem root, the user's home dir, and any ancestor of cwd
// because path joining further would still land in a privileged location.
function assertSafeOutputDir(dir: string): void {
  const resolved = path.resolve(dir)
  const root = path.parse(resolved).root

  if (resolved === root) {
    throw new Error(`Refusing output.dir "${dir}": cannot write to filesystem root.`)
  }

  const home = os.homedir()
  if (home && resolved === path.resolve(home)) {
    throw new Error(`Refusing output.dir "${dir}": cannot write directly to home directory.`)
  }

  const cwd = path.resolve(process.cwd())
  if (resolved !== cwd && cwd.startsWith(resolved + path.sep)) {
    throw new Error(`Refusing output.dir "${dir}": is an ancestor of cwd "${cwd}".`)
  }
}

// All paths are pre-joined here so downstream phases can use them directly.
export function createOutputPaths(config: ILoadedRegistryBuildConfig['config']): IRegistryBuildOutputPaths {
  const baseDir = config.output.dir
  assertSafeOutputDir(baseDir)
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
