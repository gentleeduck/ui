import path from 'node:path'
import fs from 'fs-extra'
import { getRegistryIndex, getRegistryItem, type Registry } from '~/utils/get-registry'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'
import type { ProgressCallback, ServiceResult } from './service.types'

// -- Types --

/**
 * A component directory found on disk, optionally matched to a registry entry.
 */
export type InstalledComponent = {
  name: string
  root_folder: string
  localPath: string
  registryEntry: Registry.Entry | null
}

/**
 * Diff result for a single file within a component.
 * Status indicates whether the file was modified, added (new in registry),
 * or deleted (only exists locally).
 */
export type FileDiff = {
  filePath: string
  localContent: string
  registryContent: string
  status: 'modified' | 'added' | 'deleted'
}

/**
 * Aggregated diff result for an entire component.
 * Contains per-file diffs and an isIdentical flag.
 */
export type ComponentDiff = {
  name: string
  diffs: FileDiff[]
  isIdentical: boolean
}

// -- Path resolution --

/**
 * Compute the absolute path where components are installed.
 * Combines the resolved tsconfig alias path with the duck-ui
 * config's aliases.ui subdirectory.
 */
export function resolveWriteTypePath(duckConfig: DuckUI, writePath: string): string {
  const duckuiWritePath = duckConfig.aliases.ui.split('/').slice(1).join('/')
  return path.resolve(`${writePath}/${duckuiWritePath}`)
}

// -- Scan installed components --

/**
 * Scan the component install directory for installed components.
 * Each subdirectory is matched against the registry index to populate metadata.
 */
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

// -- Remove --

/** Delete a single component's directory from disk. */
export async function removeComponent(component: InstalledComponent): Promise<ServiceResult<void>> {
  try {
    await fs.remove(component.localPath)
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Delete multiple components with progress reporting. */
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

// -- Diff --

/**
 * Compare a locally installed component against its registry entry.
 * Walks local files, compares against registry files, and categorizes
 * each as modified, added (exists only in registry), or deleted
 * (exists only locally).
 */
export async function diffComponent(
  component: InstalledComponent,
  registryEntry: Registry.Entry,
): Promise<ServiceResult<ComponentDiff>> {
  try {
    const diffs: FileDiff[] = []
    const registryFiles = registryEntry.files ?? []
    const localFilesSet = new Set<string>()

    // Recursively scan local directory tree to build the set of all local files
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

    // Compare registry files against local
    for (const file of registryFiles) {
      if (!file.content) continue

      // Registry file paths include root_folder prefix (e.g., "button/button.tsx")
      // Strip the root_folder prefix to get relative path within the component dir
      const parts = (file.path as string).split('/')
      const relative =
        parts.length > 1 && parts[0] === component.root_folder ? parts.slice(1).join('/') : (file.path as string)

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

    // Files that exist locally but not in registry
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

/**
 * Diff multiple components against the registry.
 * Fetches full registry entries (index entries may lack file contents).
 */
export async function diffComponents(
  components: InstalledComponent[],
  onProgress?: ProgressCallback,
): Promise<ServiceResult<ComponentDiff[]>> {
  try {
    const results: ComponentDiff[] = []

    for (const [index, comp] of components.entries()) {
      onProgress?.(`Diffing ${index + 1}/${components.length}: ${comp.name}`)

      // Always fetch the full registry entry (the index entry may lack file contents)
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
