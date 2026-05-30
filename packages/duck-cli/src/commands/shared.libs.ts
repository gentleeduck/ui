import path from 'node:path'
import type { Ora } from 'ora'
import { getDuckuiConfig, getTsConfig, type TsConfig } from '~/utils/get-project-info'
import { getRegistryIndex } from '~/utils/get-registry'
import type { DuckUI } from '~/utils/preflight-configs/preflight-duckui'
import { highlighter } from '~/utils/text-styling'
import { resolveProjectCwd, validateWorkspaceTarget } from '~/utils/workspace'

export interface PreparedCommand {
  cwd: string
  configCwd: string
  projectCwd: string
  duckuiConfig: DuckUI
  tsConfig: TsConfig
}

export interface PrepareCommandOptions {
  cwd: string
  workspace?: string
  /** When `true` the workspace must have a `tsconfig.json`. */
  requireTsConfig?: boolean
  /** When `true` (default), also load and return the workspace `tsconfig.json`. */
  loadTsConfig?: boolean
}

/**
 * Standard preamble shared by `add`/`update`/`remove`/`diff`:
 *  1. Resolve `cwd`.
 *  2. Compute `configCwd` honoring `--workspace`.
 *  3. Load `duck-ui.config.json` from the config root.
 *  4. Resolve the workspace project cwd via the alias config.
 *  5. Validate the workspace target shape (`package.json`, optionally `tsconfig.json`).
 *  6. Optionally load `tsconfig.json` so the caller can resolve write paths.
 *
 * Bails by calling `process.exit(1)` after `spinner.fail` (matches the historical contract).
 * Once helpers throw `ServiceResult` end-to-end this can return a `ServiceResult` too.
 */
export async function prepareCommand(options: PrepareCommandOptions, spinner: Ora): Promise<PreparedCommand> {
  const { workspace, requireTsConfig = true, loadTsConfig = true } = options
  const cwd = path.resolve(options.cwd)
  // In monorepo mode, config lives in the workspace directory
  const configCwd = workspace ? path.resolve(cwd, workspace) : cwd

  const duckuiConfig = await getDuckuiConfig(configCwd, spinner)
  const projectCwd = resolveProjectCwd(configCwd, duckuiConfig)
  const workspaceError = validateWorkspaceTarget(projectCwd, requireTsConfig)
  if (workspaceError) {
    spinner.fail(workspaceError)
    process.exit(1)
  }
  spinner.info(`Using workspace: ${highlighter.info(projectCwd)}`)

  const tsConfig: TsConfig = loadTsConfig ? await getTsConfig(projectCwd, spinner) : {}

  return { cwd, configCwd, projectCwd, duckuiConfig, tsConfig }
}

/**
 * Resolves the component-name set for `add`/`init`/`update` based on flags:
 * `--all` with no positional names expands to every `registry:ui` entry; otherwise the
 * positional names are returned unchanged.
 */
export async function expandAllComponentNames(componentNames: string[], all: boolean, spinner: Ora): Promise<string[]> {
  if (!all || componentNames.length > 0) return componentNames

  spinner.text = 'Fetching all components from registry...'
  const index = await getRegistryIndex()
  if (!index) return componentNames

  return index.filter((c) => c.type === 'registry:ui').map((c) => c.name)
}
