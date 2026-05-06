import { logger } from '../text-styling'
import { type Registry, registryEntrySchema, registrySchema } from './get-registry.dto'
import { fetchRegistryUrl, isUrl } from './get-registry.lib'

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistryUrl(['index.json'])
    if (!result) {
      return null
    }

    return registrySchema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

export async function getRegistryItem(name: string) {
  try {
    const lower = name.toLowerCase()
    const [result] = await fetchRegistryUrl([isUrl(lower) ? lower : `/components/${lower}.json`])
    if (!result) {
      return null
    }

    return registryEntrySchema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

export async function getRegistryBaseColor(theme: string): Promise<Registry.ThemeResponse | null> {
  try {
    const [result] = await fetchRegistryUrl([`themes/${theme}.json`])
    if (!result) {
      return null
    }

    return result as Registry.ThemeResponse
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}
