import path from 'node:path'
import fs from 'fs-extra'
import { get_registry_index, get_registry_item } from '~/utils/get-registry'
import type { RegistryEntry } from '~/utils/get-registry/get-registry.dto'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'
import type { ProgressCallback, ServiceResult } from './service.types'

// -- Types --

/**
 * A component directory found on disk, optionally matched to a registry entry.
 */
export type InstalledComponent = {
  name: string
  root_folder: string
  local_path: string
  registry_entry: RegistryEntry | null
}

/**
 * Diff result for a single file within a component.
 * Status indicates whether the file was modified, added (new in registry),
 * or deleted (only exists locally).
 */
export type FileDiff = {
  file_path: string
  local_content: string
  registry_content: string
  status: 'modified' | 'added' | 'deleted'
}

/**
 * Aggregated diff result for an entire component.
 * Contains per-file diffs and an is_identical flag.
 */
export type ComponentDiff = {
  name: string
  diffs: FileDiff[]
  is_identical: boolean
}

// -- Path resolution --

/**
 * Compute the absolute path where components are installed.
 * Combines the resolved tsconfig alias path with the duck-ui
 * config's aliases.ui subdirectory.
 */
export function resolve_write_type_path(duck_config: DuckUI, write_path: string): string {
  const duckui_write_path = duck_config.aliases.ui.split('/').slice(1).join('/')
  return path.resolve(`${write_path}/${duckui_write_path}`)
}

// -- Scan installed components --

/**
 * Scan the component install directory for installed components.
 * Each subdirectory is matched against the registry index to populate metadata.
 */
export async function scan_installed_components(
  write_type_path: string,
  onProgress?: ProgressCallback,
): Promise<ServiceResult<InstalledComponent[]>> {
  try {
    if (!fs.existsSync(write_type_path)) {
      return { ok: true, data: [] }
    }

    const entries = await fs.readdir(write_type_path, { withFileTypes: true })
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)

    if (dirs.length === 0) {
      return { ok: true, data: [] }
    }

    onProgress?.('Fetching registry index...')
    const index = await get_registry_index()

    const results: InstalledComponent[] = []

    for (const dir of dirs) {
      const registry_entry = index?.find((c) => c.root_folder === dir) ?? null
      results.push({
        name: registry_entry?.name ?? dir,
        root_folder: dir,
        local_path: path.join(write_type_path, dir),
        registry_entry,
      })
    }

    return { ok: true, data: results }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// -- Remove --

/** Delete a single component's directory from disk. */
export async function remove_component(component: InstalledComponent): Promise<ServiceResult<void>> {
  try {
    await fs.remove(component.local_path)
    return { ok: true, data: undefined }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Delete multiple components with progress reporting. */
export async function remove_components(
  components: InstalledComponent[],
  onProgress?: ProgressCallback,
): Promise<ServiceResult<void>> {
  try {
    for (let i = 0; i < components.length; i++) {
      onProgress?.(`Removing ${i + 1}/${components.length}: ${components[i].name}`)
      const result = await remove_component(components[i])
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
export async function diff_component(
  component: InstalledComponent,
  registry_entry: RegistryEntry,
): Promise<ServiceResult<ComponentDiff>> {
  try {
    const diffs: FileDiff[] = []
    const registry_files = registry_entry.files ?? []
    const local_files_set = new Set<string>()

    // Recursively scan local directory tree to build the set of all local files
    const local_dir = component.local_path
    if (fs.existsSync(local_dir)) {
      const walk = (dir: string, prefix: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
          const rel = prefix ? `${prefix}/${entry.name}` : entry.name
          if (entry.isDirectory()) {
            walk(path.join(dir, entry.name), rel)
          } else {
            local_files_set.add(rel)
          }
        }
      }
      walk(local_dir, '')
    }

    // Compare registry files against local
    for (const file of registry_files) {
      if (!file.content) continue

      // Registry file paths include root_folder prefix (e.g., "button/button.tsx")
      // Strip the root_folder prefix to get relative path within the component dir
      const parts = (file.path as string).split('/')
      const relative =
        parts.length > 1 && parts[0] === component.root_folder ? parts.slice(1).join('/') : (file.path as string)

      const local_file_path = path.join(local_dir, relative)
      local_files_set.delete(relative)

      if (!fs.existsSync(local_file_path)) {
        diffs.push({
          file_path: relative,
          local_content: '',
          registry_content: file.content,
          status: 'added',
        })
        continue
      }

      const local_content = await fs.readFile(local_file_path, 'utf8')
      if (local_content !== file.content) {
        diffs.push({
          file_path: relative,
          local_content,
          registry_content: file.content,
          status: 'modified',
        })
      }
    }

    // Files that exist locally but not in registry
    for (const local_file of local_files_set) {
      const local_file_path = path.join(local_dir, local_file)
      const local_content = await fs.readFile(local_file_path, 'utf8')
      diffs.push({
        file_path: local_file,
        local_content,
        registry_content: '',
        status: 'deleted',
      })
    }

    return {
      ok: true,
      data: {
        name: component.name,
        diffs,
        is_identical: diffs.length === 0,
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
export async function diff_components(
  components: InstalledComponent[],
  onProgress?: ProgressCallback,
): Promise<ServiceResult<ComponentDiff[]>> {
  try {
    const results: ComponentDiff[] = []

    for (let i = 0; i < components.length; i++) {
      const comp = components[i]
      onProgress?.(`Diffing ${i + 1}/${components.length}: ${comp.name}`)

      // Always fetch the full registry entry (the index entry may lack file contents)
      const entry = await get_registry_item(comp.name)
      if (!entry) {
        results.push({ name: comp.name, diffs: [], is_identical: true })
        continue
      }

      const result = await diff_component(comp, entry)
      if (!result.ok) return { ok: false, error: result.error }
      results.push(result.data)
    }

    return { ok: true, data: results }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}
