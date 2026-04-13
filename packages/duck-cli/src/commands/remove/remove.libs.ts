import path from 'node:path'
import prompts from 'prompts'
import { removeComponents, resolveWriteTypePath, scanInstalledComponents } from '~/services/component.service'
import { resolveInstallPath } from '~/services/install.service'
import { printBanner } from '~/utils/banner'
import { getDuckuiConfig, getTsConfig } from '~/utils/get-project-info'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { isVerbose } from '~/utils/verbose'
import { resolveProjectCwd, validateWorkspaceTarget } from '~/utils/workspace'
import { type RemoveOptions, removeArgumentsSchema, removeOptionsSchema } from './remove.dto'

export async function removeCommandAction(args: string[], opt: RemoveOptions) {
  const options = removeOptionsSchema.parse(opt)
  const componentNames = removeArgumentsSchema.parse(args)

  printBanner()
  const spinner = Spinner('initializing...').start()
  try {
    const cwd = path.resolve(options.cwd)

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
    const tsConfig = await getTsConfig(projectCwd, spinner)

    const pathResult = resolveInstallPath(duckuiConfig, tsConfig)
    if (!pathResult.ok) {
      spinner.fail(pathResult.error)
      process.exit(1)
    }

    const writeTypePath = resolveWriteTypePath(duckuiConfig, path.resolve(projectCwd, pathResult.data))

    spinner.text = 'Scanning installed components...'
    const scanResult = await scanInstalledComponents(writeTypePath)
    if (!scanResult.ok) {
      spinner.fail(scanResult.error)
      process.exit(1)
    }

    if (scanResult.data.length === 0) {
      spinner.fail('No installed components found.')
      process.exit(1)
    }

    let selected = scanResult.data

    if (componentNames.length === 0) {
      spinner.stop()
      const { picked } = await prompts({
        type: 'autocompleteMultiselect',
        name: 'picked',
        message: 'Select components to remove',
        choices: scanResult.data.map((c) => ({ title: c.name, value: c.name })),
      })
      spinner.start()

      if (!picked || picked.length === 0) {
        spinner.info('No components selected.')
        process.exit(0)
      }

      selected = scanResult.data.filter((c) => picked.includes(c.name))
    } else {
      selected = scanResult.data.filter((c) => componentNames.some((n) => n.toLowerCase() === c.name.toLowerCase()))

      if (selected.length === 0) {
        spinner.fail(
          `None of the specified components are installed: ${componentNames.map((n) => highlighter.info(n)).join(', ')}`,
        )
        process.exit(1)
      }
    }

    if (!options.yes) {
      spinner.stop()
      console.log(`\nComponents to remove:`)
      for (const c of selected) {
        console.log(`  ${highlighter.warn(c.name)} (${c.localPath})`)
      }
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Remove ${selected.length} component${selected.length > 1 ? 's' : ''}?`,
        initial: false,
      })
      spinner.start()

      if (!confirm) {
        spinner.info('Aborted.')
        process.exit(0)
      }
    }

    const result = await removeComponents(selected, (msg) => {
      spinner.text = msg
    })

    if (!result.ok) {
      spinner.fail(result.error)
      process.exit(1)
    }

    spinner.succeed(`Removed ${selected.length} component${selected.length > 1 ? 's' : ''}.`)
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (isVerbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
