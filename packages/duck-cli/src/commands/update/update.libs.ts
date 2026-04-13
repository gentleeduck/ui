import path from 'node:path'
import prompts from 'prompts'
import { launchMergeGuiAndWait } from '~/gui'
import { diffComponent, resolveWriteTypePath, scanInstalledComponents } from '~/services/component.service'
import { installComponents, installNpmDeps, resolveInstallPath } from '~/services/install.service'
import { buildComponentMergeState } from '~/services/merge.service'
import { printBanner } from '~/utils/banner'
import { getDuckuiConfig, getTsConfig } from '~/utils/get-project-info'
import { getRegistryItem } from '~/utils/get-registry'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { isVerbose } from '~/utils/verbose'
import { resolveProjectCwd, validateWorkspaceTarget } from '~/utils/workspace'
import { type UpdateOptions, updateArgumentsSchema, updateOptionsSchema } from './update.dto'

export async function updateCommandAction(args: string[], opt: UpdateOptions) {
  const options = updateOptionsSchema.parse(opt)
  const componentNames = updateArgumentsSchema.parse(args)

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

    if (options.all) {
      // Update everything
    } else if (componentNames.length === 0) {
      spinner.stop()
      const { picked } = await prompts({
        type: 'autocompleteMultiselect',
        name: 'picked',
        message: 'Select components to update',
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
      console.log(`\nComponents to update:`)
      for (const c of selected) {
        console.log(`  ${highlighter.info(c.name)}`)
      }
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `Update ${selected.length} component${selected.length > 1 ? 's' : ''} from registry?`,
        initial: true,
      })
      spinner.start()

      if (!confirm) {
        spinner.info('Aborted.')
        process.exit(0)
      }
    }

    // Fetch latest versions from registry
    spinner.text = 'Fetching latest versions from registry...'
    const registryEntries = []
    for (const comp of selected) {
      const entry = await getRegistryItem(comp.name)
      if (entry) {
        registryEntries.push(entry)
      } else {
        spinner.warn(`Component "${comp.name}" not found in registry, skipping.`)
      }
    }

    if (registryEntries.length === 0) {
      spinner.fail('No components could be fetched from registry.')
      process.exit(1)
    }

    // For each component, check for local modifications and offer merge
    const mergeHandled = new Set<string>()

    if (!options.yes) {
      for (const entry of registryEntries) {
        const installedComp = selected.find((c) => c.name === entry.name)
        if (!installedComp) continue

        spinner.text = `Checking ${entry.name} for local changes...`
        const diffResult = await diffComponent(installedComp, entry)

        if (diffResult.ok && !diffResult.data.isIdentical) {
          spinner.stop()
          const { action } = await prompts({
            message: `${highlighter.info(entry.name)} has local modifications. What do you want to do?`,
            name: 'action',
            type: 'select',
            choices: [
              { title: 'Overwrite (replace with registry version)', value: 'overwrite' },
              { title: 'Skip (keep local version)', value: 'skip' },
              { title: 'Merge (resolve changes interactively)', value: 'merge' },
            ],
          })
          spinner.start()

          if (action === 'skip' || !action) {
            mergeHandled.add(entry.name)
            spinner.warn(`Skipped ${highlighter.info(entry.name)}.`)
            continue
          }

          if (action === 'merge') {
            mergeHandled.add(entry.name)
            const mergeState = buildComponentMergeState(diffResult.data, writeTypePath, entry.root_folder)
            spinner.stop()
            const mergeResults = await launchMergeGuiAndWait(mergeState)
            spinner.start()

            if (mergeResults) {
              spinner.succeed(`Merge complete for ${highlighter.info(entry.name)}.`)
            } else {
              spinner.warn(`Merge aborted for ${highlighter.info(entry.name)}.`)
            }
          }
          // action === 'overwrite' -- will be handled by installComponents below
        }
      }
    }

    // Install remaining components that were not handled by merge (force overwrite)
    const remainingEntries = registryEntries.filter((e) => !mergeHandled.has(e.name))

    let allDeps: string[] = []
    let allDevDeps: string[] = []

    if (remainingEntries.length > 0) {
      const installResult = await installComponents(
        remainingEntries,
        duckuiConfig,
        path.resolve(projectCwd, pathResult.data),
        true,
        (msg) => {
          spinner.text = msg
        },
      )

      if (!installResult.ok) {
        spinner.fail(installResult.error)
        process.exit(1)
      }

      allDeps = installResult.data.dependencies
      allDevDeps = installResult.data.devDependencies
    }

    // Also collect deps from merge-handled components
    for (const entry of registryEntries) {
      if (mergeHandled.has(entry.name)) {
        allDeps.push(...(entry.dependencies ?? []))
        allDevDeps.push(...(entry.devDependencies ?? []))
      }
    }

    // Install any new/updated npm dependencies
    const depsResult = await installNpmDeps([...new Set(allDeps)], [...new Set(allDevDeps)], projectCwd, (msg) => {
      spinner.text = msg
    })

    if (!depsResult.ok) {
      spinner.fail(depsResult.error)
      process.exit(1)
    }

    spinner.succeed(`Updated ${registryEntries.length} component${registryEntries.length > 1 ? 's' : ''}.`)
    process.exit(0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (isVerbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
