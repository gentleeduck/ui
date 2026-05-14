import { getRegistryBaseColor, getRegistryIndex, getRegistryItem, type Registry } from '~/utils/get-registry'
import type { ProgressCallback, ServiceResult } from './service.types'

export async function fetchRegistry(): Promise<ServiceResult<Registry.Collection>> {
  const index = await getRegistryIndex()
  if (!index || index.length === 0) {
    return { ok: false, error: 'No components found in registry.' }
  }
  return { ok: true, data: index }
}

export async function fetchComponent(name: string): Promise<ServiceResult<Registry.Entry>> {
  const item = await getRegistryItem(name)
  if (!item) {
    return { ok: false, error: `Component "${name}" not found in registry.` }
  }
  return { ok: true, data: item }
}

export async function fetchComponents(
  names: string[],
  onProgress: ProgressCallback,
): Promise<ServiceResult<Registry.Entry[]>> {
  const results: Registry.Entry[] = []
  for (const [index, name] of names.entries()) {
    onProgress(`Fetching component ${index + 1}/${names.length}: ${name}`)
    const item = await getRegistryItem(name)
    if (item) results.push(item)
  }
  if (results.length === 0) {
    return { ok: false, error: 'No components could be fetched.' }
  }
  return { ok: true, data: results }
}

export async function fetchTheme(name: string): Promise<ServiceResult<unknown>> {
  const result = await getRegistryBaseColor(name)
  if (!result) {
    return { ok: false, error: `Theme "${name}" not found in registry.` }
  }
  return { ok: true, data: result }
}
