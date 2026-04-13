import path from 'node:path'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import type { ThemeResponse } from '~/utils/get-registry/get-registry.dto'
import { highlighter } from '~/utils/text-styling'
import type { WorkspaceTarget } from '~/utils/workspace'
import { base_layer_styles } from '../preflight-tailwindcss/preflight-tailwindcss.constants'
import type { DuckuiPrompts } from './preflight-duckui.dto'

export async function init_duckui_config(
  cwd: string,
  spinner: Ora,
  duck_config: DuckuiPrompts,
  workspace: WorkspaceTarget = { root: '.', project: '.' },
  css_workspace?: string,
) {
  try {
    spinner.text = `Initializing ${highlighter.info('duck-ui')} config...`

    spinner.text = `Writing ${highlighter.info('duck-ui')} config...`
    await fs.writeFile(
      path.join(cwd, 'duck-ui.config.json'),
      default_duckui_config(duck_config, workspace, css_workspace),
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

export function generateThemeCSS(name: string, entry: ThemeResponse) {
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

${base_layer_styles}
`.trim()
}

export const default_duckui_config = (
  { project_type, monorepo, css, prefix, alias, base_color, css_variables }: DuckuiPrompts,
  workspace: WorkspaceTarget = { root: '.', project: '.' },
  css_workspace?: string,
) => {
  return JSON.stringify(
    {
      schema: 'https://ui.gentleduck.org/schema.json',
      rsc: ['NEXT_JS'].includes(project_type),
      monorepo,
      workspace,
      tailwind: {
        baseColor: base_color,
        css,
        ...(css_workspace && css_workspace !== '.' ? { cssWorkspace: css_workspace } : {}),
        cssVariables: css_variables,
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
