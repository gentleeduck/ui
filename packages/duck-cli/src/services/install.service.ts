import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { get_package_manager } from '~/utils/get-package-manager'
import type { TsConfig } from '~/utils/get-project-info'
import { get_registry_item, type Registry } from '~/utils/get-registry'
import type { RegistryEntry } from '~/utils/get-registry/get-registry.dto'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'
import type { ProgressCallback, ServiceResult } from './service.types'

export function resolve_install_path(duck_config: DuckUI, tsConfig: TsConfig): ServiceResult<string> {
  const alias = duck_config.aliases.ui.split('/').shift()
  if (!tsConfig?.compilerOptions?.paths || !alias) {
    return { ok: false, error: 'No TypeScript path aliases found in tsconfig.json.' }
  }

  const write_path_key = Object.keys(tsConfig.compilerOptions.paths).find((p: string) => p.includes(alias))
  const path_values = write_path_key ? tsConfig.compilerOptions.paths[write_path_key] : undefined
  const write_path = path_values?.[0]?.split('/').slice(0, -1).join('/')

  if (!write_path) {
    return { ok: false, error: `Alias "${alias}" not found in tsconfig paths.` }
  }

  return { ok: true, data: write_path }
}

export type ConflictAction = 'overwrite' | 'skip' | 'merge'

export async function install_components(
  components: Registry,
  duck_config: DuckUI,
  write_path: string,
  force: boolean,
  onProgress?: ProgressCallback,
  onOverwriteCheck?: (name: string) => Promise<boolean>,
  onConflictCheck?: (name: string) => Promise<ConflictAction>,
): Promise<ServiceResult<{ dependencies: string[]; devDependencies: string[] }>> {
  try {
    const allDeps: string[] = []
    const allDevDeps: string[] = []
    const registryDeps: string[] = []

    const duckui_write_path = duck_config.aliases.ui.split('/').slice(1).join('/')
    const write_type_path = path.resolve(`${write_path}/${duckui_write_path}`)

    for (let idx = 0; idx < components.length; idx++) {
      const component = components[idx]
      onProgress?.(`Installing component ${idx + 1}/${components.length}: ${component.name}`)

      allDeps.push(...(component.dependencies ?? []))
      allDevDeps.push(...(component.devDependencies ?? []))
      registryDeps.push(...(component.registryDependencies ?? []))

      await write_component(
        component,
        write_type_path,
        `${write_path}/${duckui_write_path}`,
        force,
        onOverwriteCheck,
        onConflictCheck,
      )
    }

    // Handle registry dependencies recursively
    const visited = new Set(components.map((c) => c.name.toLowerCase()))
    const pendingDeps = new Set(registryDeps.map((d) => d.toLowerCase()))
    pendingDeps.forEach((d) => visited.add(d))

    while (pendingDeps.size > 0) {
      const batch = Array.from(pendingDeps)
      pendingDeps.clear()

      const fetched = (
        await Promise.all(
          batch.map(async (name, idx) => {
            onProgress?.(`Fetching registry dependency ${idx + 1}/${batch.length}: ${name}`)
            return get_registry_item(name)
          }),
        )
      ).filter((item): item is RegistryEntry => item !== null)

      for (const comp of fetched) {
        allDeps.push(...(comp.dependencies ?? []))
        allDevDeps.push(...(comp.devDependencies ?? []))

        await write_component(comp, write_type_path, `${write_path}/${duckui_write_path}`, force)

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

async function write_component(
  component: RegistryEntry,
  write_type_path: string,
  _from_root_path: string,
  force: boolean,
  onOverwriteCheck?: (name: string) => Promise<boolean>,
  onConflictCheck?: (name: string) => Promise<ConflictAction>,
) {
  const write_component_path = `${write_type_path}/${component.root_folder}`

  if (!fs.existsSync(write_type_path)) {
    await fs.mkdir(write_type_path, { recursive: true })
  }
  if (!fs.existsSync(write_component_path)) {
    await fs.mkdir(write_component_path, { recursive: true })
  }

  if (!component.files?.length) return

  if (!force && fs.readdirSync(write_component_path).length > 0) {
    if (onConflictCheck) {
      const action = await onConflictCheck(component.name)
      if (action === 'skip') return
      if (action === 'merge') {
        // Merge is handled externally by the caller
        // The caller should have already resolved the merge before calling install_components
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
    await fs.writeFile(path.resolve(write_type_path, file.path as string), file.content, 'utf8')
  }
}

export async function install_npm_deps(
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
    const packageManager = await get_package_manager(cwd)
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
