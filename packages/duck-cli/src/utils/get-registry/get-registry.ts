import { logger } from '../text-styling'
import { registryEntrySchema, registrySchema, registryThemeSchema, registryThemesIndexSchema } from './get-registry.dto'
import { fetchRegistryUrl, isUrl } from './get-registry.lib'

/**
 * Theme names are interpolated directly into the registry URL path. Restrict to a safe
 * identifier charset so a hand-typed name cannot escape into a sibling path segment.
 */
const SAFE_THEME_NAME_PATTERN = /^[a-z0-9_-]+$/

function normalizeAndValidateThemeName(name: string): string | null {
  const lower = name.toLowerCase()
  return SAFE_THEME_NAME_PATTERN.test(lower) ? lower : null
}

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

export async function getRegistryBaseColor(theme: string) {
  try {
    const safeName = normalizeAndValidateThemeName(theme)
    if (!safeName) {
      logger.error({ args: [`Invalid theme name "${theme}". Use letters, digits, "-", and "_" only.`] })
      return null
    }

    const [result] = await fetchRegistryUrl([`themes/${safeName}.json`])
    if (!result) {
      return null
    }

    // Same shape as `getRegistryTheme`; parse defensively rather than `as`-casting raw JSON.
    return registryThemeSchema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

export async function getRegistryThemesIndex() {
  try {
    const [result] = await fetchRegistryUrl(['themes/index.json'])
    if (!result) {
      return null
    }

    return registryThemesIndexSchema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch theme index from registry.`, error] })
    return null
  }
}

export async function getRegistryTheme(name: string) {
  try {
    const safeName = normalizeAndValidateThemeName(name)
    if (!safeName) {
      logger.error({ args: [`Invalid theme name "${name}". Use letters, digits, "-", and "_" only.`] })
      return null
    }

    const [result] = await fetchRegistryUrl([`themes/${safeName}.json`])
    if (!result) {
      return null
    }

    return registryThemeSchema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch theme "${name}" from registry.`, error] })
    return null
  }
}
