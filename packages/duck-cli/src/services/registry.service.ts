import { get_registry_base_color, get_registry_index, get_registry_item, type Registry } from '~/utils/get-registry'
import type { RegistryEntry } from '~/utils/get-registry/get-registry.dto'
import type { ProgressCallback, ServiceResult } from './service.types'

export async function fetch_registry(): Promise<ServiceResult<Registry>> {
  const index = await get_registry_index()
  if (!index || index.length === 0) {
    return { ok: false, error: 'No components found in registry.' }
  }
  return { ok: true, data: index }
}

export async function fetch_component(name: string): Promise<ServiceResult<RegistryEntry>> {
  const item = await get_registry_item(name)
  if (!item) {
    return { ok: false, error: `Component "${name}" not found in registry.` }
  }
  return { ok: true, data: item }
}

export async function fetch_components(
  names: string[],
  onProgress: ProgressCallback,
): Promise<ServiceResult<RegistryEntry[]>> {
  const results: RegistryEntry[] = []
  for (let i = 0; i < names.length; i++) {
    onProgress(`Fetching component ${i + 1}/${names.length}: ${names[i]}`)
    const item = await get_registry_item(names[i])
    if (item) results.push(item)
  }
  if (results.length === 0) {
    return { ok: false, error: 'No components could be fetched.' }
  }
  return { ok: true, data: results }
}

export async function fetch_theme(name: string): Promise<ServiceResult<unknown>> {
  const result = await get_registry_base_color(name)
  if (!result) {
    return { ok: false, error: `Theme "${name}" not found in registry.` }
  }
  return { ok: true, data: result }
}
