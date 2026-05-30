import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { getPackageManager } from '~/utils/get-package-manager'
import type { TsConfig } from '~/utils/get-project-info'
import { getRegistryItem, type Registry } from '~/utils/get-registry'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'
import { resolveWithinBase } from '~/utils/safe-path'
import type { ProgressCallback, ServiceResult } from './service.types'

/**
 * Extracts the alias prefix from `aliases.ui` (e.g. `@/components/ui` -> `@`), looks it up in
 * `tsconfig.compilerOptions.paths`, and strips the trailing `/*` segment to get the parent dir.
 *
 * The returned `writePath` must be relative and free of `..` traversal segments — `tsconfig.paths`
 * is user-owned but unconstrained by the schema, so reject malformed values here before any
 * downstream `path.resolve` lets them escape the project cwd.
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

  if (path.isAbsolute(writePath)) {
    return {
      ok: false,
      error: `tsconfig path for alias "${alias}" must be relative; got "${writePath}".`,
    }
  }

  const segments = path.normalize(writePath).split(/[\\/]+/)
  if (segments.some((s) => s === '..')) {
    return {
      ok: false,
      error: `tsconfig path for alias "${alias}" must not contain ".." traversal; got "${writePath}".`,
    }
  }

  return { ok: true, data: writePath }
}

export type ConflictAction = 'overwrite' | 'skip' | 'merge'

/** Walks `registryDependencies` BFS-style until closure; conflict callbacks gate overwrites per component. */
export async function installComponents(
  components: Registry.Collection,
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
    // `aliases.ui` is shape-validated by `ALIAS_UI_PATTERN`, but route through `resolveWithinBase`
    // for parity with `registry-mutation.lib.ts:174` — defence in depth if the regex is ever loosened.
    // When the alias has no subdir (e.g. `~`), `duckuiWritePath` is empty — fall back to the base.
    const writeTypePath = duckuiWritePath ? resolveWithinBase(writePath, duckuiWritePath) : path.resolve(writePath)

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
      ).filter((item): item is Registry.Entry => item !== null)

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

async function writeComponent(
  component: Registry.Entry,
  writeTypePath: string,
  _from_root_path: string,
  force: boolean,
  onOverwriteCheck?: (name: string) => Promise<boolean>,
  onConflictCheck?: (name: string) => Promise<ConflictAction>,
) {
  // `root_folder` is registry-supplied; contain it within the install dir to block path traversal.
  const writeComponentPath = resolveWithinBase(writeTypePath, component.root_folder)

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
        // Caller resolves merges before invoking installComponents; this branch just opts out of writing.
        return
      }
      // overwrite: fall through
    } else if (onOverwriteCheck) {
      const overwrite = await onOverwriteCheck(component.name)
      if (!overwrite) return
    } else {
      return
    }
  }

  for (const file of component.files) {
    if (!file.content) continue
    // `file.path` is registry-supplied; contain it within the install dir to block path traversal.
    const filePath = resolveWithinBase(writeTypePath, file.path)
    await fs.writeFile(filePath, file.content, 'utf8')
  }
}

/** Detects npm/pnpm/yarn/bun via `getPackageManager` and uses `add` (or `install` for npm). */
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
