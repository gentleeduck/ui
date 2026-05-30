import { printBanner } from '~/utils/banner'
import { registryComponentInstall } from '~/utils/registry-mutation'
import { resolveComponents } from '~/utils/resolve-components'
import { spinner as Spinner } from '~/utils/spinner'
import { isVerbose } from '~/utils/verbose'
import { expandAllComponentNames, prepareCommand } from '../shared.libs'
import { type AddOptions, addArgumentsSchema, addOptionsSchema } from './add.dto'

export async function addCommandAction(args: string[], opt: AddOptions) {
  const options = addOptionsSchema.parse(opt)
  const componentNames = addArgumentsSchema.parse(args)

  printBanner()
  const spinner = Spinner('initializing...').start()
  try {
    const { configCwd, duckuiConfig } = await prepareCommand(
      { cwd: options.cwd, workspace: options.workspace, requireTsConfig: true, loadTsConfig: false },
      spinner,
    )

    const expandedNames = await expandAllComponentNames(componentNames, options.all, spinner)
    const components = await resolveComponents(expandedNames, spinner)

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
