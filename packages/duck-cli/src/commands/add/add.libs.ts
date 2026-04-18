import path from 'node:path'
import { printBanner } from '~/utils/banner'
import { getDuckuiConfig } from '~/utils/get-project-info'
import { getRegistryIndex } from '~/utils/get-registry'
import { registryComponentInstall } from '~/utils/registry-mutation'
import { resolveComponents } from '~/utils/resolve-components'
import { spinner as Spinner } from '~/utils/spinner'
import { isVerbose } from '~/utils/verbose'
import { resolveProjectCwd, validateWorkspaceTarget } from '~/utils/workspace'
import { type AddOptions, addArgumentsSchema, addOptionsSchema } from './add.dto'

export async function addCommandAction(args: string[], opt: AddOptions) {
  const options = addOptionsSchema.parse(opt)
  const componentNames = addArgumentsSchema.parse(args)

  printBanner()
  const spinner = Spinner('initializing...').start()
  try {
    const cwd = path.resolve(options.cwd)

    let componentsNames = componentNames

    if (options.all && componentsNames.length === 0) {
      spinner.text = 'Fetching all components from registry...'
      const index = await getRegistryIndex()
      if (index) {
        componentsNames = index.filter((c) => c.type === 'registry:ui').map((c) => c.name)
      }
    }

    const components = await resolveComponents(componentsNames, spinner)

    // In monorepo mode, config lives in the workspace directory
    const configCwd = options.workspace ? path.resolve(cwd, options.workspace) : cwd
    const duckuiConfig = await getDuckuiConfig(configCwd, spinner)
    const projectCwd = resolveProjectCwd(configCwd, duckuiConfig)
    const workspaceError = validateWorkspaceTarget(projectCwd, true)
    if (workspaceError) {
      spinner.fail(workspaceError)
      process.exit(1)
    }

    spinner.info(`Using workspace: ${projectCwd}`)

    await registryComponentInstall(
      components,
      duckuiConfig,
      { ...options, cwd: configCwd, workspace: undefined },
      spinner,
    )

    spinner.succeed('Done.')
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (isVerbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
