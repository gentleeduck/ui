import path from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import { launchMergeGuiAndWait } from '~/gui'
import { diffComponent } from '~/services/component.service'
import { buildComponentMergeState } from '~/services/merge.service'
import { getPackageManager } from '../get-package-manager'
import { getTsConfig } from '../get-project-info'
import { getRegistryItem, type Registry } from '../get-registry'
import type { DuckUI } from '../preflight-configs/preflight-duckui'
import { highlighter } from '../text-styling'
import { resolveProjectCwd, validateWorkspaceTarget } from '../workspace'
import type { DependenciesType, InstallOptions } from './registry-mutation.types'

export async function getInstallationConfig(
  duckConfig: DuckUI,
  spinner: Ora,
  options: InstallOptions,
): Promise<string> {
  try {
    const alias = duckConfig.aliases.ui.split('/').shift()
    const projectCwd = resolveProjectCwd(options.cwd, duckConfig, options.workspace)
    const workspaceError = validateWorkspaceTarget(projectCwd, true)
    if (workspaceError) {
      spinner.fail(workspaceError)
      process.exit(1)
    }
    const tsConfig = await getTsConfig(projectCwd, spinner)

    if (!tsConfig.compilerOptions?.paths || !alias) {
      spinner.fail(
        `No ${highlighter.info(
          'TypeScript',
        )} configs found \r\n(NOTE: check your tsconfig.json, and add the paths because we need them) \r\nAs an example \r\n${highlighter.warn(
          `paths: {\r\n  "~/*": ["./*"]\r\n}`,
        )}\r\n`,
      )
      process.exit(1)
    }

    const writePathKey = Object.keys(tsConfig.compilerOptions.paths).find((path) => path.includes(alias))

    const pathValues = writePathKey ? tsConfig.compilerOptions.paths[writePathKey] : undefined
    const writePath = pathValues?.[0]?.split('/').slice(0, -1).join('/')

    if (!writePath) {
      spinner.fail(`Alias "${alias}" not found in tsconfig paths.
Make sure your ${highlighter.info('duck-ui.config.json')} and ${highlighter.info('tsconfig.json')} aliases match.`)
      process.exit(1)
    }

    // Resolve the writePath to an absolute path using the target cwd
    const resolvedWritePath = path.resolve(projectCwd, writePath)

    if (!options.yes) {
      spinner.stop()
      const { yes } = await prompts({
        initial: options.yes,
        message: `Do you want to install ${highlighter.info('components')}? at ${highlighter.warn(
          writePath,
        )} (workspace: ${highlighter.info(projectCwd)})`,
        name: 'yes',
        type: 'confirm',
      })
      spinner.start()

      if (!yes) {
        spinner.fail('Why you cannot install components?, goodbye!')
        spinner.info(
          `Having issues you can report them here: ${highlighter.info(
            'https://github.com/gentleeduck/duck-ui/issues',
          )}`,
        )
        spinner.info(
          `If you do not know how to write a professional issue,\n     you can find more info here: https://ui.gentleduck.org/docs/cli`,
        )
        process.exit(0)
      }
    }

    return resolvedWritePath
  } catch (error) {
    spinner.fail(`Oops: ${highlighter.error(error instanceof Error ? error.message : String(error))}`)

    process.exit(1)
  }
}

export async function processComponents(
  duckConfig: DuckUI,
  components: Registry.Collection,
  writePath: string,
  spinner: Ora,
  options: InstallOptions,
) {
  try {
    const dependencies = {
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
    } as DependenciesType

    const skipPrompts = options.force || options.yes

    for (const [idx, component] of components.entries()) {
      await installComponent(
        duckConfig,
        dependencies,
        idx,
        component,
        false,
        components,
        writePath,
        spinner,
        skipPrompts,
      )
    }

    const topLevelNames = new Set(components.map((c) => c.name.toLowerCase()))
    await installRegistryDependencies(dependencies, spinner, writePath, skipPrompts, duckConfig, topLevelNames)
    const projectCwd = resolveProjectCwd(options.cwd, duckConfig, options.workspace)
    const workspaceError = validateWorkspaceTarget(projectCwd, false)
    if (workspaceError) {
      spinner.fail(workspaceError)
      process.exit(1)
    }
    await processComponentDependencies(dependencies, spinner, projectCwd)
  } catch (error) {
    spinner.fail(
      `Failed to install components, ${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    throw error
  }
}

async function installComponent(
  duckConfig: DuckUI,
  dependencies: DependenciesType,
  idx: number,
  component: Registry.Entry,
  registry: boolean,
  components: Registry.Collection,
  writePath: string,
  spinner: Ora,
  force: boolean,
) {
  dependencies.dependencies.push(...(component.dependencies ?? []))
  dependencies.devDependencies.push(...(component.devDependencies ?? []))
  dependencies.registryDependencies.push(...(component.registryDependencies ?? []))

  spinner.text = `Installing ${registry ? 'necessary ' : ''}component: ${highlighter.info(`${component.name}`)}`

  const componentType = component.type.split(':').pop() as string
  const duckuiWritePath = duckConfig.aliases.ui.split('/').slice(1).join('/')
  const writeTypePath = path.resolve(`${writePath}/${duckuiWritePath}`)

  if (!fs.existsSync(writeTypePath)) {
    spinner.text = `Creating directory: ${componentType}`
    await fs.mkdir(writeTypePath, { recursive: true })
    spinner.succeed(`Created directory: ${componentType}`)
  }

  const writeComponentPath = `${writeTypePath}/${component.root_folder}`

  if (!fs.existsSync(writeComponentPath)) {
    spinner.text = `Creating directory: ${component.root_folder}`
    await fs.mkdir(writeComponentPath, { recursive: true })
    spinner.succeed(`Created directory: ${component.root_folder}`)
  }

  await processComponentFiles(component, writeTypePath, `${writePath}/${duckuiWritePath}`, spinner, force)

  spinner.succeed(
    `Installed ${registry ? 'necessary ' : ''}component${
      components.length > 1 ? 's' : ''
    }: ${highlighter.info(`[${idx + 1}/${components.length}]`)}\x1b[0K`,
  )
}

export async function installRegistryDependencies(
  dependencies: DependenciesType,
  spinner: Ora,
  writePath: string,
  force: boolean,
  duckConfig: DuckUI,
  exclude?: Set<string>,
) {
  const visited = new Set<string>(exclude) // avoid infinite loops and double-installs
  const allComponents: Registry.Collection = []

  async function fetchAndProcess(deps: Set<string>) {
    if (deps.size === 0) return

    const components = (
      await Promise.all(
        Array.from(deps).map(async (item, idx) => {
          spinner.text = `Fetching registry necessary dependency ${highlighter.info(
            `[${idx + 1}/${deps.size}]`,
          )} ${highlighter.warn(item)}`
          return await getRegistryItem(item)
        }),
      )
    ).filter((item): item is Registry.Entry => item !== null)

    spinner.succeed(`Fetched ${components.length} necessary component${components.length > 1 ? 's' : ''} from registry`)

    // Merge fetched components
    allComponents.push(...components)

    // Collect new registry dependencies
    const newDeps = new Set<string>()
    for (const comp of components) {
      for (const dep of comp.registryDependencies ?? []) {
        const lower = dep.toLowerCase()
        if (!visited.has(lower)) {
          visited.add(lower)
          newDeps.add(lower)
        }
      }
    }

    // Recurse if we found new dependencies
    if (newDeps.size > 0) {
      await fetchAndProcess(newDeps)
    }
  }

  // Kick off recursion with initial registry deps, filtering out already-visited names
  const initialDeps = new Set<string>()
  for (const d of dependencies.registryDependencies.map((dep) => dep.toLowerCase())) {
    if (!visited.has(d)) {
      visited.add(d)
      initialDeps.add(d)
    }
  }
  await fetchAndProcess(initialDeps)

  // Install all collected components
  for (const [index, component] of allComponents.entries()) {
    await installComponent(duckConfig, dependencies, index, component, true, allComponents, writePath, spinner, force)
  }
}

export async function processComponentFiles(
  component: Registry.Entry,
  writePath: string,
  fromRootWritePath: string,
  spinner: Ora,
  force: boolean,
) {
  if (!component.files?.length) {
    spinner.warn(`No files found for component: ${fromRootWritePath}`)
    return
  }

  if (!force) {
    if (fs.readdirSync(`${writePath}/${component.root_folder}`).length > 0) {
      spinner.stop()
      const { action } = await prompts({
        message: `${highlighter.info(component.name)} already exists. What do you want to do?`,
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
        spinner.warn(
          `Components already exists: ${highlighter.info(`${fromRootWritePath}${component.root_folder}`)} (skipping)`,
        )
        return
      }

      if (action === 'merge') {
        spinner.text = `Preparing merge for ${highlighter.info(component.name)}...`

        // Build the diff between local and registry
        const localPath = `${writePath}/${component.root_folder}`
        const installedComp = {
          name: component.name,
          root_folder: component.root_folder,
          localPath,
          registryEntry: component,
        }
        const diffResult = await diffComponent(installedComp, component)

        if (!diffResult.ok) {
          spinner.fail(`Failed to compute diff: ${diffResult.error}`)
          return
        }

        if (diffResult.data.isIdentical) {
          spinner.info(`${highlighter.info(component.name)} is identical to registry. Skipping.`)
          return
        }

        // Build merge state and launch interactive merge
        const mergeState = buildComponentMergeState(diffResult.data, writePath, component.root_folder)
        spinner.stop()

        const mergeResults = await launchMergeGuiAndWait(mergeState)
        spinner.start()

        if (!mergeResults) {
          spinner.warn(`Merge aborted for ${highlighter.info(component.name)}.`)
          return
        }

        spinner.succeed(`Merge complete for ${highlighter.info(component.name)}.`)
        return
      }
      // action === 'overwrite' -- fall through to write files below
    }
  }

  for (const file of component.files) {
    try {
      if (!file.content) {
        spinner.warn(`Skipping file with no content: ${file.path}`)
        continue
      }
      spinner.text = `Writing file: ${file.target}`
      const targetPath = path.resolve(`${writePath}`, file.path as string)
      await fs.ensureDir(path.dirname(targetPath))
      await fs.writeFile(targetPath, file.content, 'utf8')
      spinner.succeed(`Successfully wrote: ${fromRootWritePath}/${file.path}`)
    } catch (error) {
      spinner.fail(`Failed to write file: ${file.target}`)
      throw error
    }
  }
}

export async function processComponentDependencies(
  { dependencies, devDependencies }: DependenciesType,
  spinner: Ora,
  cwd: string,
) {
  try {
    spinner.start(`Installing dependencies`)

    // Deduplicate all collected dependencies
    const allDependencies = [...new Set([...dependencies, ...devDependencies])]

    if (allDependencies.length === 0) {
      spinner.warn(`No dependencies found`)
      return
    }

    spinner.text = `Installing ${highlighter.info(String(allDependencies.length))} dependencies...`

    const packageManager = await getPackageManager(cwd)
    const result = await execa(packageManager, [packageManager !== 'npm' ? 'add' : 'install', ...allDependencies], {
      cwd,
      reject: false,
    })
    if (result.failed) {
      const stderr = result.stderr?.trim()
      spinner.fail('Failed to install dependencies')
      throw new Error(
        `${packageManager} ${packageManager !== 'npm' ? 'add' : 'install'} failed${stderr ? `:\n${stderr}` : ''}`,
      )
    }

    spinner.succeed(`Successfully installed dependencies`)
  } catch (error) {
    spinner.fail(`Failed to install dependencies`)
    throw error
  }
}
