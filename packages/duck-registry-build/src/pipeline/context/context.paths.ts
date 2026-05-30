import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { ILoadedRegistryBuildConfig } from '../../config/loader/loader.types'
import type { IRegistryBuildOutputPaths, IRegistryBuildPathRegistry } from '../types'

// Refuse output dirs that would let a hostile config write anywhere on the host.
// We reject filesystem root, the user's home dir, and any ancestor of cwd
// because path joining further would still land in a privileged location.
// Both the configured (raw resolve) and canonical (realpath-followed) forms
// must clear every check; otherwise an `output.dir` symlink could pass the
// raw guard while its target lands in a forbidden tree.
function assertSafeOutputDir(configured: string, canonical: string): void {
  const resolved = path.resolve(configured)
  const home = os.homedir() ? path.resolve(os.homedir()) : ''
  const cwd = path.resolve(process.cwd())

  for (const target of [resolved, canonical]) {
    const root = path.parse(target).root

    if (target === root) {
      throw new Error(`Refusing output.dir "${configured}": cannot write to filesystem root.`)
    }

    if (home && target === home) {
      throw new Error(`Refusing output.dir "${configured}": cannot write directly to home directory.`)
    }

    if (target !== cwd && cwd.startsWith(target + path.sep)) {
      throw new Error(`Refusing output.dir "${configured}": is an ancestor of cwd "${cwd}".`)
    }
  }
}

// All paths are pre-joined here so downstream phases can use them directly.
export function createOutputPaths(config: ILoadedRegistryBuildConfig['config']): IRegistryBuildOutputPaths {
  const configuredDir = config.output.dir
  // Canonicalise first so a hostile symlink cannot bypass the root/home/cwd
  // guard by pointing the configured string at a benign-looking directory
  // whose realpath lands in a privileged location.
  const baseDir = canonicaliseExistingAncestor(path.resolve(configuredDir))
  assertSafeOutputDir(configuredDir, baseDir)
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

// Walk up until an existing ancestor is found, realpath it, then re-attach the
// tail. Keeps `outputPaths` aligned with `resolveWithinBase` even when the
// configured output dir does not exist yet on first invocation.
function canonicaliseExistingAncestor(absolute: string): string {
  let current = absolute
  const trailing: string[] = []
  while (true) {
    try {
      const real = fs.realpathSync(current)
      return trailing.length === 0 ? real : path.join(real, ...trailing.reverse())
    } catch {
      const parent = path.dirname(current)
      if (parent === current) return absolute
      trailing.push(path.basename(current))
      current = parent
    }
  }
}
