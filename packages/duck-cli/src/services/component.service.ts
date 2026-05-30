import path from 'node:path'
import fs from 'fs-extra'
import { getRegistryIndex, getRegistryItem, type Registry } from '~/utils/get-registry'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'
import { resolveWithinBase } from '~/utils/safe-path'
import type { ProgressCallback, ServiceResult } from './service.types'

export type InstalledComponent = {
  name: string
  root_folder: string
  localPath: string
  registryEntry: Registry.Entry | null
}

/** `added` = registry-only, `deleted` = local-only, `modified` = content differs. */
export type FileDiff = {
  filePath: string
  localContent: string
  registryContent: string
  status: 'modified' | 'added' | 'deleted'
}

export type ComponentDiff = {
  name: string
  diffs: FileDiff[]
  isIdentical: boolean
}

/** Joins the resolved tsconfig alias path with the duck-ui `aliases.ui` subdir. */
export function resolveWriteTypePath(duckConfig: DuckUI, writePath: string): string {
  const duckuiWritePath = duckConfig.aliases.ui.split('/').slice(1).join('/')
  // `aliases.ui` is shape-validated by `ALIAS_UI_PATTERN`, but route through `resolveWithinBase`
  // for parity with `install.service.ts` / `registry-mutation.lib.ts:174` — defence in depth.
  // When the alias has no subdir (e.g. `~`), `duckuiWritePath` is empty — fall back to the base.
  return duckuiWritePath ? resolveWithinBase(writePath, duckuiWritePath) : path.resolve(writePath)
}

/** Each subdirectory is matched against the registry index by `root_folder`. */
export async function scanInstalledComponents(
  writeTypePath: string,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<InstalledComponent[]>> {
  try {
    if (!fs.existsSync(writeTypePath)) {
      return { ok: true, data: [] }
    }

    const entries = await fs.readdir(writeTypePath, { withFileTypes: true })
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)

    if (dirs.length === 0) {
      return { ok: true, data: [] }
    }

    onProgress?.('Fetching registry index...')
    const index = await getRegistryIndex()

    const results: InstalledComponent[] = []

    for (const dir of dirs) {
      const registryEntry = index?.find((c) => c.root_folder === dir) ?? null
      results.push({
        name: registryEntry?.name ?? dir,
        root_folder: dir,
        localPath: path.join(writeTypePath, dir),
        registryEntry,
      })
    }

    return { ok: true, data: results }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function removeComponent(component: InstalledComponent): Promise<ServiceResult<void>> {
  try {
    await fs.remove(component.localPath)
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function removeComponents(
  components: InstalledComponent[],
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    for (const [index, component] of components.entries()) {
      onProgress?.(`Removing ${index + 1}/${components.length}: ${component.name}`)
      const result = await removeComponent(component)
      if (!result.ok) return result
    }
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function diffComponent(
  component: InstalledComponent,
  registryEntry: Registry.Entry,
): Promise<ServiceResult<ComponentDiff>> {
  try {
    const diffs: FileDiff[] = []
    const registryFiles = registryEntry.files ?? []
    const localFilesSet = new Set<string>()

    const localDir = component.localPath
    if (fs.existsSync(localDir)) {
      const walk = (dir: string, prefix: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
          const rel = prefix ? `${prefix}/${entry.name}` : entry.name
          if (entry.isDirectory()) {
            walk(path.join(dir, entry.name), rel)
          } else {
            localFilesSet.add(rel)
          }
        }
      }
      walk(localDir, '')
    }

    for (const file of registryFiles) {
      if (!file.content) continue

      // Registry paths are root_folder-prefixed (e.g. "button/button.tsx"); strip to component-relative.
      const parts = file.path.split('/')
      const relative = parts.length > 1 && parts[0] === component.root_folder ? parts.slice(1).join('/') : file.path

      const localFilePath = path.join(localDir, relative)
      localFilesSet.delete(relative)

      if (!fs.existsSync(localFilePath)) {
        diffs.push({
          filePath: relative,
          localContent: '',
          registryContent: file.content,
          status: 'added',
        })
        continue
      }

      const localContent = await fs.readFile(localFilePath, 'utf8')
      if (localContent !== file.content) {
        diffs.push({
          filePath: relative,
          localContent,
          registryContent: file.content,
          status: 'modified',
        })
      }
    }

    for (const localFile of localFilesSet) {
      const localFilePath = path.join(localDir, localFile)
      const localContent = await fs.readFile(localFilePath, 'utf8')
      diffs.push({
        filePath: localFile,
        localContent,
        registryContent: '',
        status: 'deleted',
      })
    }

    return {
      ok: true,
      data: {
        name: component.name,
        diffs,
        isIdentical: diffs.length === 0,
      },
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Re-fetches each entry via `getRegistryItem` because the index entries may lack file contents. */
export async function diffComponents(
  components: InstalledComponent[],
  onProgress?: ProgressCallback,
): Promise<ServiceResult<ComponentDiff[]>> {
  try {
    const results: ComponentDiff[] = []

    for (const [index, comp] of components.entries()) {
      onProgress?.(`Diffing ${index + 1}/${components.length}: ${comp.name}`)

      const entry = await getRegistryItem(comp.name)
      if (!entry) {
        results.push({ name: comp.name, diffs: [], isIdentical: true })
        continue
      }

      const result = await diffComponent(comp, entry)
      if (!result.ok) return { ok: false, error: result.error }
      results.push(result.data)
    }

    return { ok: true, data: results }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}
