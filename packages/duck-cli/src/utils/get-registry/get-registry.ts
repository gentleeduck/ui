import { logger } from '../text-styling'
import { registry_entry_schema, registry_schema, type ThemeResponse } from './get-registry.dto'

import { fetch_registry_url, is_url } from './get-registry.lib'

export async function get_registry_index() {
  try {
    const [result] = await fetch_registry_url(['index.json'])

    return registry_schema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

export async function get_registry_item(name: string) {
  try {
    const lower = name.toLowerCase()
    const [result] = await fetch_registry_url([is_url(lower) ? lower : `/components/${lower}.json`])

    return registry_entry_schema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

export async function get_registry_base_color(theme: string): Promise<ThemeResponse | null> {
  try {
    const [result] = await fetch_registry_url([`themes/${theme}.json`])

    return result as ThemeResponse
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}
