import path from 'node:path'
import prompts from 'prompts'
import { getDuckuiConfig, registryComponentInstall } from '~/utils'
import { printBanner } from '~/utils/banner'
import { getRegistryIndex } from '~/utils/get-registry'
import { preflightConfigs } from '~/utils/preflight-configs'
import { resolveComponents } from '~/utils/resolve-components'
import { spinner as Spinner } from '~/utils/spinner'
import { scaffoldTemplate } from '~/utils/template-scaffold'
import { isVerbose } from '~/utils/verbose'
import { resolveProjectCwd, validateWorkspaceTarget } from '~/utils/workspace'
import { type InitOptions, initArgumentsSchema, initOptionsSchema } from './init.dto'

export async function initCommandAction(args: string[], opt: InitOptions) {
  const options = initOptionsSchema.parse(opt)
  const componentNames = initArgumentsSchema.parse(args)

  printBanner()
  const spinner = Spinner('Initializing...').start()
  try {
    const cwd = path.resolve(options.cwd)

    if (options.template) {
      await scaffoldTemplate({ template: options.template, cwd, yes: options.yes }, spinner)
      spinner.succeed(`Template ${options.template} scaffolded successfully.`)
      process.exit(0)
    }

    const componentsNames = componentNames

    const { workspaceCwd } = await preflightConfigs({ ...options, cwd }, spinner)

    if (componentsNames.length === 0 && !options.all) {
      if (options.yes) {
        // Non-interactive mode with no components specified and no --all: skip component install
        spinner.succeed('Done.')
        process.exit(0)
      }

      spinner.stop()
      const install = await prompts({
        initial: true,
        message: 'Do you want to install components?',
        name: 'install',
        type: 'confirm',
      })

      if (!install.install) {
        spinner.succeed('Done.')
        process.exit(0)
      }
      spinner.start()
    }

    let finalNames = componentsNames

    if (options.all && componentsNames.length === 0) {
      spinner.text = 'Fetching all components from registry...'
      const index = await getRegistryIndex()
      if (index) {
        finalNames = index.filter((c) => c.type === 'registry:ui').map((c) => c.name)
      }
    }

    const components = await resolveComponents(finalNames, spinner)

    const duckuiConfig = await getDuckuiConfig(workspaceCwd, spinner)
    const projectCwd = resolveProjectCwd(workspaceCwd, duckuiConfig)
    const workspaceError = validateWorkspaceTarget(projectCwd, true)
    if (workspaceError) {
      spinner.fail(workspaceError)
      process.exit(1)
    }

    spinner.info(`Installing components into: ${projectCwd}`)

    await registryComponentInstall(
      components,
      duckuiConfig,
      { cwd: workspaceCwd, yes: options.yes, force: false },
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
