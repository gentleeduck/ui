import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { getPackageManager } from '~/utils/get-package-manager'
import type { TsConfig } from '~/utils/get-project-info'
import { getRegistryItem, type Registry } from '~/utils/get-registry'
import type { RegistryEntry } from '~/utils/get-registry/get-registry.dto'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'
import type { ProgressCallback, ServiceResult } from './service.types'

/**
 * Resolve the base installation path from duck-ui config aliases and tsconfig paths.
 * Extracts the alias prefix from aliases.ui (e.g. '@/components/ui' -> '@'),
 * finds the matching tsconfig path entry, and returns the filesystem directory.
 */
export function resolveInstallPath(duckConfig: DuckUI, tsConfig: TsConfig): ServiceResult<string> {
  const alias = duckConfig.aliases.ui.split('/').shift()
  if (!tsConfig?.compilerOptions?.paths || !alias) {
    return { ok: false, error: 'No TypeScript path aliases found in tsconfig.json.' }
  }

  const writePathKey = Object.keys(tsConfig.compilerOptions.paths).find((p: string) => p.includes(alias))
  const pathValues = writePathKey ? tsConfig.compilerOptions.paths[writePathKey] : undefined
  const writePath = pathValues?.[0]?.split('/').slice(0, -1).join('/')

  if (!writePath) {
    return { ok: false, error: `Alias "${alias}" not found in tsconfig paths.` }
  }

  return { ok: true, data: writePath }
}

export type ConflictAction = 'overwrite' | 'skip' | 'merge'

/**
 * Install one or more registry components to disk.
 * Handles file writing, conflict checking (overwrite/skip/merge),
 * and recursive BFS resolution of registry dependencies.
 */
export async function installComponents(
  components: Registry,
  duckConfig: DuckUI,
  writePath: string,
  force: boolean,
  onProgress?: ProgressCallback,
  onOverwriteCheck?: (name: string) => Promise<boolean>,
  onConflictCheck?: (name: string) => Promise<ConflictAction>,
): Promise<ServiceResult<{ dependencies: string[]; devDependencies: string[] }>> {
  try {
    const allDeps: string[] = []
    const allDevDeps: string[] = []
    const registryDeps: string[] = []

    const duckuiWritePath = duckConfig.aliases.ui.split('/').slice(1).join('/')
    const writeTypePath = path.resolve(`${writePath}/${duckuiWritePath}`)

    for (const [index, component] of components.entries()) {
      onProgress?.(`Installing component ${index + 1}/${components.length}: ${component.name}`)

      allDeps.push(...(component.dependencies ?? []))
      allDevDeps.push(...(component.devDependencies ?? []))
      registryDeps.push(...(component.registryDependencies ?? []))

      await writeComponent(
        component,
        writeTypePath,
        `${writePath}/${duckuiWritePath}`,
        force,
        onOverwriteCheck,
        onConflictCheck,
      )
    }

    // BFS resolution of registry dependencies: fetch transitive deps
    // and install them until no new dependencies are discovered.
    const visited = new Set(components.map((c) => c.name.toLowerCase()))
    const pendingDeps = new Set(registryDeps.map((d) => d.toLowerCase()))
    for (const dependency of pendingDeps) {
      visited.add(dependency)
    }

    while (pendingDeps.size > 0) {
      const batch = Array.from(pendingDeps)
      pendingDeps.clear()

      const fetched = (
        await Promise.all(
          batch.map(async (name, idx) => {
            onProgress?.(`Fetching registry dependency ${idx + 1}/${batch.length}: ${name}`)
            return getRegistryItem(name)
          }),
        )
      ).filter((item): item is RegistryEntry => item !== null)

      for (const comp of fetched) {
        allDeps.push(...(comp.dependencies ?? []))
        allDevDeps.push(...(comp.devDependencies ?? []))

        await writeComponent(comp, writeTypePath, `${writePath}/${duckuiWritePath}`, force)

        for (const dep of comp.registryDependencies ?? []) {
          const lower = dep.toLowerCase()
          if (!visited.has(lower)) {
            visited.add(lower)
            pendingDeps.add(lower)
          }
        }
      }
    }

    return {
      ok: true,
      data: {
        dependencies: Array.from(new Set(allDeps)),
        devDependencies: Array.from(new Set(allDevDeps)),
      },
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Write a single component's files to disk.
 * Creates the target directory if needed, checks for existing files
 * when force=false, and delegates conflict resolution to callbacks.
 */
async function writeComponent(
  component: RegistryEntry,
  writeTypePath: string,
  _from_root_path: string,
  force: boolean,
  onOverwriteCheck?: (name: string) => Promise<boolean>,
  onConflictCheck?: (name: string) => Promise<ConflictAction>,
) {
  const writeComponentPath = `${writeTypePath}/${component.root_folder}`

  if (!fs.existsSync(writeTypePath)) {
    await fs.mkdir(writeTypePath, { recursive: true })
  }
  if (!fs.existsSync(writeComponentPath)) {
    await fs.mkdir(writeComponentPath, { recursive: true })
  }

  if (!component.files?.length) return

  if (!force && fs.readdirSync(writeComponentPath).length > 0) {
    if (onConflictCheck) {
      const action = await onConflictCheck(component.name)
      if (action === 'skip') return
      if (action === 'merge') {
        // Merge is handled externally by the caller
        // The caller should have already resolved the merge before calling installComponents
        return
      }
      // action === 'overwrite' -- fall through to write
    } else if (onOverwriteCheck) {
      const overwrite = await onOverwriteCheck(component.name)
      if (!overwrite) return
    } else {
      return
    }
  }

  for (const file of component.files) {
    if (!file.content) continue
    await fs.writeFile(path.resolve(writeTypePath, file.path as string), file.content, 'utf8')
  }
}

/**
 * Run the detected package manager to install npm dependencies.
 * Combines deps and devDeps into a single install command.
 */
export async function installNpmDeps(
  deps: string[],
  devDeps: string[],
  cwd: string,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    const allDeps = [...deps, ...devDeps]
    if (allDeps.length === 0) {
      return { ok: true, data: undefined }
    }

    onProgress?.(`Installing ${allDeps.length} npm dependencies...`)
    const packageManager = await getPackageManager(cwd)
    const { failed } = await execa(packageManager, [packageManager !== 'npm' ? 'add' : 'install', ...allDeps], {
      cwd,
      stdio: 'ignore',
    })

    if (failed) {
      return { ok: false, error: 'Failed to install npm dependencies' }
    }

    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}
