import { logger } from '../text-styling'
import { registryEntrySchema, registrySchema, type ThemeResponse } from './get-registry.dto'

import { fetchRegistryUrl, isUrl } from './get-registry.lib'

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistryUrl(['index.json'])

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

    return registryEntrySchema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

export async function getRegistryBaseColor(theme: string): Promise<ThemeResponse | null> {
  try {
    const [result] = await fetchRegistryUrl([`themes/${theme}.json`])

    return result as ThemeResponse
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}
