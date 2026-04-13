import path from 'node:path'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import type { Registry } from '~/utils/get-registry/get-registry.dto'
import { highlighter } from '~/utils/text-styling'
import type { Workspace } from '~/utils/workspace'
import { BASE_LAYER_STYLES } from '../preflight-tailwindcss/preflight-tailwindcss.constants'
import type { DuckUI } from './preflight-duckui.dto'

export async function initDuckuiConfig(
  cwd: string,
  spinner: Ora,
  duckConfig: DuckUI.Prompts,
  workspace: Workspace.Target = { root: '.', project: '.' },
  cssWorkspace?: string,
) {
  try {
    spinner.text = `Initializing ${highlighter.info('duck-ui')} config...`

    spinner.text = `Writing ${highlighter.info('duck-ui')} config...`
    await fs.writeFile(
      path.join(cwd, 'duck-ui.config.json'),
      defaultDuckuiConfig(duckConfig, workspace, cssWorkspace),
      'utf-8',
    )

    spinner.succeed(`${highlighter.info('duck-ui')} config initialized...`)
  } catch (error) {
    spinner.fail(
      `Failed to initialize ${highlighter.error('duck-ui config...')}\n ${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    process.exit(1)
  }
}

export function generateThemeCSS(name: string, entry: Registry.ThemeResponse) {
  const radius = entry.radius || '0.5rem'

  const lightVars = Object.entries(entry.light)
    .filter(([key]) => key !== 'radius')
    .map(([key, val]) => `  --${key}: ${val};`)
    .join('\n')

  const darkVars = Object.entries(entry.dark)
    .filter(([key]) => key !== 'radius')
    .map(([key, val]) => `  --${key}: ${val};`)
    .join('\n')

  // map only oklch values into --color-* for Tailwind inline theme
  const tailwindVars = Object.entries(entry.light)
    .filter(([key]) => key !== 'radius')
    .map(([key, val]) => (val.startsWith('oklch') ? `  --color-${key}: var(--${key});` : `  --${key}: var(--${key});`))
    .join('\n')

  return `
/* ${name} theme */
:root {
  --radius: ${radius};
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

${BASE_LAYER_STYLES}
`.trim()
}

export const defaultDuckuiConfig = (
  { projectType, monorepo, css, prefix, alias, baseColor, cssVariables }: DuckUI.Prompts,
  workspace: Workspace.Target = { root: '.', project: '.' },
  cssWorkspace?: string,
) => {
  return JSON.stringify(
    {
      schema: 'https://ui.gentleduck.org/schema.json',
      rsc: ['NEXT_JS'].includes(projectType),
      monorepo,
      workspace,
      tailwind: {
        baseColor: baseColor,
        css,
        ...(cssWorkspace && cssWorkspace !== '.' ? { cssWorkspace: cssWorkspace } : {}),
        cssVariables: cssVariables,
        prefix: prefix || '',
      },
      aliases: {
        ui: `${alias}/ui`,
        libs: `${alias}/libs`,
        hooks: `${alias}/hooks`,
        pages: `${alias}/pages`,
        layouts: `${alias}/layouts`,
      },
    },
    null,
    2,
  )
}
