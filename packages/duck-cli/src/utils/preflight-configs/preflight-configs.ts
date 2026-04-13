import type { Ora } from 'ora'
import type { InitOptions } from '~/commands/init'
import { highlighter } from '../text-styling'
import { type DuckuiResolution, preflight_duckui, preflight_duckui_resolve_workspace } from './preflight-duckui'
import { preflight_tailwindcss } from './preflight-tailwindcss'
import { preflight_typescript } from './preflight-typescript'

export async function preflight_configs(_options: InitOptions, spinner: Ora): Promise<DuckuiResolution> {
  try {
    spinner.text = `${highlighter.info('Preflighting required configs...')}`

    // Resolve workspace BEFORE running typescript/tailwind preflights — those write into
    // the cwd we hand them, and that cwd needs to be the picked workspace, not the root.
    const resolution = await preflight_duckui_resolve_workspace(_options, spinner)
    const workspace_options: InitOptions = { ..._options, cwd: resolution.workspace_cwd }

    if (resolution.monorepo) {
      spinner.info(`Using workspace: ${highlighter.info(resolution.workspace_cwd)}`)
      if (resolution.css_workspace_cwd !== resolution.workspace_cwd) {
        spinner.info(`CSS workspace: ${highlighter.info(resolution.css_workspace_cwd)}`)
      }
    }

    // Tailwind belongs to whichever package owns the CSS file; when the user picks a
    // dedicated styles package, that's where tailwindcss + the CSS file get installed.
    const css_options: InitOptions = { ..._options, cwd: resolution.css_workspace_cwd }

    await preflight_typescript(workspace_options, spinner)
    await preflight_tailwindcss(css_options, spinner)
    await preflight_duckui(workspace_options, resolution, spinner)

    spinner.text = `${highlighter.info('Configs preflighted...')}`
    return resolution
  } catch (error) {
    spinner.fail(
      `Failed to preflight required configs...\n ${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    process.exit(1)
  }
}
