import path from 'node:path'
import type { Theme } from '@gentleduck/registers'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import { highlighter } from '~/utils/text-styling'
import type { DuckuiPrompts } from './preflight-duckui.dto'

export async function init_duckui_config(cwd: string, spinner: Ora, duck_config: DuckuiPrompts) {
  try {
    spinner.text = `Initializing ${highlighter.info('duck-ui')} config...`

    spinner.text = `Writing ${highlighter.info('duck-ui')} config...`
    await fs.writeFile(path.join(cwd, 'duck-ui.config.json'), default_duckui_config(duck_config), 'utf-8')

    spinner.succeed(`${highlighter.info('duck-ui')} config initialized...`)
  } catch (error) {
    spinner.fail(
      `Failed to initialize ${highlighter.error('duck-ui config...')}\n ${highlighter.error(error as string)}`,
    )
    process.exit(0)
  }
}

export function generateThemeCSS({ name, cssVars }: Theme) {
  const lightVars = Object.entries(cssVars.light)
    .map(([key, val]) => `  --${key}: ${val};`)
    .join('\n')

  const darkVars = Object.entries(cssVars.dark)
    .map(([key, val]) => `  --${key}: ${val};`)
    .join('\n')

  // map only oklch values into --color-* for Tailwind inline theme
  const tailwindVars = Object.entries(cssVars.light)
    .map(([key, val]) => (val.startsWith('oklch') ? `  --color-${key}: var(--${key});` : `  --${key}: var(--${key});`))
    .join('\n')

  return `
/* ${name} theme */
:root {
${lightVars}
}

.dark {
${darkVars}
}

@theme inline {
  --breakpoint-3xl: 1600px;
  --breakpoint-4xl: 2000px;

${tailwindVars}

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
`.trim()
}

export const default_duckui_config = ({
  project_type,
  monorepo,
  css,
  prefix,
  alias,
  base_color,
  css_variables,
}: DuckuiPrompts) => {
  return `{
  "schema": "https://duckui.vercel.app/schema.json",
  "rsc": ${['NEXT_JS'].includes(project_type)},
  "monorepo": ${monorepo},
  "tailwind": {
    "baseColor": "${base_color}",
    "css": "${css}",
    "cssVariables": ${css_variables},
    "prefix": "${prefix}"
  },
  "aliases": {
    "ui": "${alias}/ui",
    "libs": "${alias}/libs",
    "hooks": "${alias}/hooks",
    "pages": "${alias}/pages",
    "layouts": "${alias}/layouts"
  }
}`
}
