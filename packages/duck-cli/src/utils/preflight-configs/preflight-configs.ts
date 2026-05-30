import type { Ora } from 'ora'
import type { InitOptions } from '~/commands/init'
import { highlighter } from '../text-styling'
import type { DuckUI } from './preflight-duckui'
import { preflightDuckui, preflightDuckuiResolveWorkspace } from './preflight-duckui'
import { preflightTailwindcss } from './preflight-tailwindcss'
import { preflightTypescript } from './preflight-typescript'

/**
 * Errors bubble up to the `init` command-action wrapper, which renders the final spinner.fail
 * and calls `process.exit`. Inner helpers already emit specific failure messages.
 */
export async function preflightConfigs(options: InitOptions, spinner: Ora): Promise<DuckUI.Resolution> {
  spinner.text = `${highlighter.info('Preflighting required configs...')}`

  // Resolve workspace BEFORE running typescript/tailwind preflights — those write into
  // the cwd we hand them, and that cwd needs to be the picked workspace, not the root.
  const resolution = await preflightDuckuiResolveWorkspace(options, spinner)
  const workspaceOptions: InitOptions = { ...options, cwd: resolution.workspaceCwd }

  if (resolution.monorepo) {
    spinner.info(`Using workspace: ${highlighter.info(resolution.workspaceCwd)}`)
    if (resolution.cssWorkspaceCwd !== resolution.workspaceCwd) {
      spinner.info(`CSS workspace: ${highlighter.info(resolution.cssWorkspaceCwd)}`)
    }
  }

  // Tailwind belongs to whichever package owns the CSS file; when the user picks a
  // dedicated styles package, that's where tailwindcss + the CSS file get installed.
  const cssOptions: InitOptions = { ...options, cwd: resolution.cssWorkspaceCwd }

  await preflightTypescript(workspaceOptions, spinner)
  await preflightTailwindcss(cssOptions, spinner)
  await preflightDuckui(workspaceOptions, resolution, spinner)

  spinner.text = `${highlighter.info('Configs preflighted...')}`
  return resolution
}
