import { assertSafeName } from '../../../lib/safe-path'
import type { IRegistryBuildThemeEntry } from '../ui.config.types'

function generateVarBlock(scheme: Record<string, string>, cssVarKeys: string[], indent: string) {
  return cssVarKeys
    .map((key) => {
      if (!(key in scheme)) {
        throw new Error(`Theme is missing CSS variable "${key}".`)
      }

      return `${indent}--${key}: ${scheme[key]};`
    })
    .join('\n')
}

export function generateBaseStylesWithVariables(options: {
  baseLayerRules: string
  baseStyles: string
  cssVarKeys: string[]
  entry: IRegistryBuildThemeEntry
  radius: string
}) {
  const lightVars = generateVarBlock(options.entry.light, options.cssVarKeys, '    ')
  const darkVars = generateVarBlock(options.entry.dark, options.cssVarKeys, '    ')

  return `${options.baseStyles.trimEnd()}

@layer base {
  :root {
${lightVars}
    --radius: ${options.radius};
  }

  .dark {
${darkVars}
  }
}

${options.baseLayerRules.trim()}`
}

export function generateThemeCss(options: {
  cssVarKeys: string[]
  entry: IRegistryBuildThemeEntry
  name: string
  radius: string
}) {
  // Reject any theme name that would break out of the CSS selector.
  assertSafeName(options.name, `theme name`)
  const lightVars = generateVarBlock(options.entry.light, options.cssVarKeys, '  ')
  const darkVars = generateVarBlock(options.entry.dark, options.cssVarKeys, '  ')

  return `.theme-${options.name} {
${lightVars}
  --radius: ${options.radius};
}

.dark .theme-${options.name} {
${darkVars}
}`
}
