import type { ThemeColorScheme, ThemeEntry } from '@gentleduck/registers'
import { THEME_CSS_VAR_KEYS } from '@gentleduck/registers'

export const BASE_STYLES = `@tailwind base;
@tailwind components;
@tailwind utilities;
  `

// ---------------------------------------------------------------------------
// Generate a CSS block for a single color scheme (light or dark)
// ---------------------------------------------------------------------------

function generateVarBlock(scheme: ThemeColorScheme, indent: string): string {
  return THEME_CSS_VAR_KEYS.map((key) => `${indent}--${key}: ${scheme[key]};`).join('\n')
}

// ---------------------------------------------------------------------------
// Generate :root + .dark CSS for a base color (used in per-color JSON files)
// ---------------------------------------------------------------------------

export function generateBaseStylesWithVariables(entry: ThemeEntry): string {
  const lightVars = generateVarBlock(entry.light, '    ')
  const darkVars = generateVarBlock(entry.dark, '    ')

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
${lightVars}
    --radius: ${entry.radius};
  }

  .dark {
${darkVars}
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`
}

// ---------------------------------------------------------------------------
// Generate .theme-<name> CSS block for themes.css
// ---------------------------------------------------------------------------

export function generateThemeCSS(name: string, entry: ThemeEntry): string {
  const lightVars = generateVarBlock(entry.light, '  ')
  const darkVars = generateVarBlock(entry.dark, '  ')

  return `.theme-${name} {
${lightVars}
  --radius: ${entry.radius};
}

.dark .theme-${name} {
${darkVars}
}`
}
