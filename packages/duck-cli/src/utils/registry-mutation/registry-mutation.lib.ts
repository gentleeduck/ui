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
import { resolveWithinBase } from '../safe-path'
import { highlighter } from '../text-styling'
import { resolveProjectCwd, validateWorkspaceTarget } from '../workspace'
import type { DependenciesType, InstallOptions } from './registry-mutation.types'

/** Resolve component write path from duck config + tsconfig aliases. Throws on error; `exit(0)` on user-decline. */
export async function getInstallationConfig(
  duckConfig: DuckUI,
  spinner: Ora,
  options: InstallOptions,
): Promise<string> {
  const alias = duckConfig.aliases.ui.split('/').shift()
  const projectCwd = resolveProjectCwd(options.cwd, duckConfig, options.workspace)
  const workspaceError = validateWorkspaceTarget(projectCwd, true)
  if (workspaceError) {
    throw new Error(workspaceError)
  }
  const tsConfig = await getTsConfig(projectCwd, spinner)

  if (!tsConfig.compilerOptions?.paths || !alias) {
    throw new Error(
      `No TypeScript paths configured. Add a path mapping like:\n  paths: { "~/*": ["./*"] }\nto your tsconfig.json so we know where to write components.`,
    )
  }

  const writePathKey = Object.keys(tsConfig.compilerOptions.paths).find((p) => p.includes(alias))

  const pathValues = writePathKey ? tsConfig.compilerOptions.paths[writePathKey] : undefined
  const writePath = pathValues?.[0]?.split('/').slice(0, -1).join('/')

  if (!writePath) {
    throw new Error(
      `Alias "${alias}" not found in tsconfig paths. Make sure your duck-ui.config.json and tsconfig.json aliases match.`,
    )
  }

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
      spinner.fail('Installation cancelled.')
      spinner.info(`Report issues at: ${highlighter.info('https://github.com/gentleeduck/gentleduck/issues')}`)
      spinner.info(`Docs: ${highlighter.info('https://gentleduck.org/docs/cli')}`)
      process.exit(0)
    }
  }

  return resolvedWritePath
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

    // The conflict prompt is serial by nature (user input), so we keep `installComponent`
    // sequential when prompts may fire. When `skipPrompts` is true there is no user input,
    // so the writes can fan out.
    if (skipPrompts) {
      await Promise.all(
        components.map((component, idx) =>
          installComponent(
            duckConfig,
            dependencies,
            idx,
            component,
            false,
            components,
            writePath,
            spinner,
            skipPrompts,
          ),
        ),
      )
    } else {
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
    }

    const topLevelNames = new Set(components.map((c) => c.name.toLowerCase()))
    await installRegistryDependencies(dependencies, spinner, writePath, skipPrompts, duckConfig, topLevelNames)
    const projectCwd = resolveProjectCwd(options.cwd, duckConfig, options.workspace)
    const workspaceError = validateWorkspaceTarget(projectCwd, false)
    if (workspaceError) {
      throw new Error(workspaceError)
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

  // `component.type` is `registry:<kind>`; `.pop()` may return undefined for a malformed value.
  const componentType = component.type.split(':').pop()
  if (!componentType) {
    throw new Error(`Invalid component type: "${component.type}"`)
  }
  // `duckConfig.aliases.ui` is shape-validated by `duckUiSchema`. The first segment is the alias
  // prefix (e.g. `~`), the rest is the on-disk subdir relative to the resolved `writePath`.
  const duckuiWritePath = duckConfig.aliases.ui.split('/').slice(1).join('/')
  // Contain the alias-derived path within the resolved `writePath` (defence in depth even though
  // `aliases.ui` is already shape-validated and `writePath` derives from the canonical tsconfig).
  const writeTypePath = duckuiWritePath ? resolveWithinBase(writePath, duckuiWritePath) : path.resolve(writePath)
  // `root_folder` is registry-supplied; contain it within the install dir to block path traversal.
  const writeComponentPath = resolveWithinBase(writeTypePath, component.root_folder)

  // Single mkdir with `recursive: true` is idempotent — no existsSync check, no per-step spinner spam.
  await fs.mkdir(writeComponentPath, { recursive: true })

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
  // Tracks already-resolved names so cycles in `registryDependencies` don't fetch/install twice.
  const visited = new Set<string>(exclude)
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

    allComponents.push(...components)

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

    if (newDeps.size > 0) {
      await fetchAndProcess(newDeps)
    }
  }

  const initialDeps = new Set<string>()
  for (const d of dependencies.registryDependencies.map((dep) => dep.toLowerCase())) {
    if (!visited.has(d)) {
      visited.add(d)
      initialDeps.add(d)
    }
  }
  await fetchAndProcess(initialDeps)

  // Registry-dep installs always run with `force=true` (they're new), so no user prompt fires
  // and we can fan out the writes. Sequential when force=false to preserve prompt UX.
  if (force) {
    await Promise.all(
      allComponents.map((component, index) =>
        installComponent(duckConfig, dependencies, index, component, true, allComponents, writePath, spinner, force),
      ),
    )
  } else {
    for (const [index, component] of allComponents.entries()) {
      await installComponent(duckConfig, dependencies, index, component, true, allComponents, writePath, spinner, force)
    }
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

  // `root_folder` is registry-supplied; contain it within the install dir to block path traversal.
  const writeComponentPath = resolveWithinBase(writePath, component.root_folder)

  if (!force) {
    // `readdirSync` here is only used for the conflict probe; the parent mkdir already ran.
    if (fs.existsSync(writeComponentPath) && fs.readdirSync(writeComponentPath).length > 0) {
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

        const installedComp = {
          name: component.name,
          root_folder: component.root_folder,
          localPath: writeComponentPath,
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
      // overwrite: fall through to the write loop below.
    }
  }

  // Parallelise file writes; `file.path` is contained per-write so each is independent.
  await Promise.all(
    component.files.map(async (file) => {
      try {
        if (!file.content) {
          spinner.warn(`Skipping file with no content: ${file.path}`)
          return
        }
        spinner.text = `Writing file: ${file.target}`
        // `file.path` is registry-supplied; contain it within the install dir to block path traversal.
        const targetPath = resolveWithinBase(writePath, file.path)
        await fs.ensureDir(path.dirname(targetPath))
        await fs.writeFile(targetPath, file.content, 'utf8')
        spinner.succeed(`Successfully wrote: ${fromRootWritePath}/${file.path}`)
      } catch (error) {
        spinner.fail(`Failed to write file: ${file.target}`)
        throw error
      }
    }),
  )
}

export async function processComponentDependencies(
  { dependencies, devDependencies }: DependenciesType,
  spinner: Ora,
  cwd: string,
) {
  try {
    spinner.start(`Installing dependencies`)

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
