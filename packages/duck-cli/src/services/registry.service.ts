import { get_registry_base_color, get_registry_index, get_registry_item, type Registry } from '~/utils/get-registry'
import type { RegistryEntry } from '~/utils/get-registry/get-registry.dto'
import type { ProgressCallback, ServiceResult } from './service.types'

/** Fetch the full component registry index. */
export async function fetch_registry(): Promise<ServiceResult<Registry>> {
  const index = await get_registry_index()
  if (!index || index.length === 0) {
    return { ok: false, error: 'No components found in registry.' }
  }
  return { ok: true, data: index }
}

/** Fetch a single component entry from the registry by name. */
export async function fetch_component(name: string): Promise<ServiceResult<RegistryEntry>> {
  const item = await get_registry_item(name)
  if (!item) {
    return { ok: false, error: `Component "${name}" not found in registry.` }
  }
  return { ok: true, data: item }
}

/** Fetch multiple components by name with progress reporting. */
export async function fetch_components(
  names: string[],
  onProgress: ProgressCallback,
): Promise<ServiceResult<RegistryEntry[]>> {
  const results: RegistryEntry[] = []
  for (const [index, name] of names.entries()) {
    onProgress(`Fetching component ${index + 1}/${names.length}: ${name}`)
    const item = await get_registry_item(name)
    if (item) results.push(item)
  }
  if (results.length === 0) {
    return { ok: false, error: 'No components could be fetched.' }
  }
  return { ok: true, data: results }
}

/** Fetch a base color theme definition from the registry. */
export async function fetch_theme(name: string): Promise<ServiceResult<unknown>> {
  const result = await get_registry_base_color(name)
  if (!result) {
    return { ok: false, error: `Theme "${name}" not found in registry.` }
  }
  return { ok: true, data: result }
}
