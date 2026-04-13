import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import type { InitOptions } from '~/commands/init'
import { getRegistryBaseColor } from '~/utils/get-registry'
import { IGNORED_DIRECTORIES } from '../../get-project-info'
import { highlighter } from '../../text-styling'
import {
  detectMonorepoKind,
  findWorkspaceProjects,
  formatMonorepoKind,
  pickDefaultWorkspace,
  validateWorkspaceTarget,
  type WorkspaceTarget,
} from '../../workspace'
import { duckuiPrompts, duckuiRestPrompts, makeDuckuiMonorepoPrompt } from './preflight-duckui.constants'
import { duckuiPromptsSchema, preflightDuckuiOptionsSchema } from './preflight-duckui.dto'
import { generateThemeCSS, initDuckuiConfig } from './preflight-duckui.libs'

// When the config lives inside the workspace, both root and project are '.' relative
// to the config location.
const WORKSPACE_LOCAL_TARGET: WorkspaceTarget = { project: '.', root: '.' }

export type DuckuiResolution = {
  workspaceCwd: string
  monorepo: boolean
  // Where the CSS file lives. Equals workspaceCwd unless the user picked a
  // separate package for styles.
  cssWorkspaceCwd: string
}

const SAME_AS_COMPONENTS = '__same__'

export async function preflightDuckuiResolveWorkspace(_options: InitOptions, spinner: Ora): Promise<DuckuiResolution> {
  const cwd = path.resolve(_options.cwd)

  const flagMonorepo = typeof _options.monorepo === 'boolean' ? _options.monorepo : null
  const flagWorkspace = _options.workspace ?? null
  const flagCssWorkspace = _options.cssWorkspace ?? null
  if (flagWorkspace && flagMonorepo === false) {
    spinner.warn(`${highlighter.warn('--workspace')} ignored because ${highlighter.warn('--no-monorepo')} was set.`)
  }
  if (flagCssWorkspace && flagMonorepo === false) {
    spinner.warn(`${highlighter.warn('--css-workspace')} ignored because ${highlighter.warn('--no-monorepo')} was set.`)
  }

  const detectedKind = detectMonorepoKind(cwd)

  let monorepo: boolean
  if (flagMonorepo === false) {
    monorepo = false
  } else if (flagMonorepo === true || flagWorkspace || flagCssWorkspace) {
    monorepo = true
  } else if (_options.yes) {
    // Non-interactive runs default to whatever auto-detection found, so a -y in a
    // turbo/pnpm/etc. repo doesn't silently fall back to single-project mode.
    monorepo = detectedKind !== null
  } else {
    spinner.stop()
    const answer = await prompts(makeDuckuiMonorepoPrompt(detectedKind ? formatMonorepoKind(detectedKind) : null))
    spinner.start()
    if (typeof answer.monorepo !== 'boolean') {
      spinner.text = `${highlighter.info('init')} aborted...`
      process.exit(0)
    }
    monorepo = answer.monorepo
  }

  if (!monorepo) {
    return { cssWorkspaceCwd: cwd, monorepo: false, workspaceCwd: cwd }
  }

  // Workspace projects are needed both for the component pick and the CSS pick.
  // Cache the lookup so we don't glob twice.
  let workspaceProjectsCache: string[] | null = null
  const getWorkspaceProjects = async () => {
    if (workspaceProjectsCache === null) {
      workspaceProjectsCache = await findWorkspaceProjects(cwd)
    }
    return workspaceProjectsCache
  }

  let selected: string
  if (flagWorkspace) {
    selected = flagWorkspace
  } else {
    const workspaceProjects = await getWorkspaceProjects()
    if (workspaceProjects.length === 0) {
      spinner.warn(
        `Monorepo mode is on but no workspaces were detected. Falling back to ${highlighter.info('current directory')}.`,
      )
      selected = '.'
    } else if (workspaceProjects.length === 1) {
      selected = workspaceProjects[0] ?? '.'
      spinner.info(`Using only detected workspace: ${highlighter.info(selected)}`)
    } else if (_options.yes) {
      selected = pickDefaultWorkspace(cwd, workspaceProjects) ?? workspaceProjects[0] ?? '.'
    } else {
      const defaultPick = pickDefaultWorkspace(cwd, workspaceProjects) ?? workspaceProjects[0] ?? null
      spinner.stop()
      const answer = await prompts({
        choices: workspaceProjects.map((project) => ({ title: project, value: project })),
        initial: defaultPick ? Math.max(0, workspaceProjects.indexOf(defaultPick)) : 0,
        message: `Select the ${highlighter.info('workspace')} where components should be installed`,
        name: 'workspaceProject',
        type: 'select',
      })
      spinner.start()
      selected = (answer.workspaceProject as string | undefined) ?? defaultPick ?? '.'
    }
  }

  const workspaceCwd = path.resolve(cwd, selected)
  const workspaceError = validateWorkspaceTarget(workspaceCwd, false)
  if (workspaceError) {
    spinner.fail(`Invalid workspace ${highlighter.warn(selected)}: ${workspaceError}`)
    process.exit(1)
  }

  let cssSelected: string = selected
  if (flagCssWorkspace) {
    cssSelected = flagCssWorkspace
  } else if (!_options.yes) {
    const workspaceProjects = await getWorkspaceProjects()
    const otherWorkspaces = workspaceProjects.filter((project) => path.resolve(cwd, project) !== workspaceCwd)
    if (otherWorkspaces.length > 0) {
      spinner.stop()
      const pick = await prompts({
        choices: [
          { title: `Same as components workspace (${selected})`, value: SAME_AS_COMPONENTS },
          ...otherWorkspaces.map((project) => ({ title: project, value: project })),
        ],
        initial: 0,
        message: `Where should the ${highlighter.info('CSS file')} live?`,
        name: 'cssWorkspace',
        type: 'select',
      })
      spinner.start()
      const picked = pick.cssWorkspace as string | undefined
      if (picked && picked !== SAME_AS_COMPONENTS) {
        cssSelected = picked
      }
    }
  }

  const cssWorkspaceCwd = path.resolve(cwd, cssSelected)
  if (cssWorkspaceCwd !== workspaceCwd) {
    const cssError = validateWorkspaceTarget(cssWorkspaceCwd, false)
    if (cssError) {
      spinner.fail(`Invalid CSS workspace ${highlighter.warn(cssSelected)}: ${cssError}`)
      process.exit(1)
    }
  }

  return { cssWorkspaceCwd, monorepo: true, workspaceCwd }
}

export async function preflightDuckui(
  _options: InitOptions,
  resolution: DuckuiResolution,
  spinner: Ora,
): Promise<void> {
  try {
    spinner.text = `Checking for ${highlighter.info('duck-ui')} config...`
    const configCwd = resolution.workspaceCwd

    const files = fg.sync(['duck-ui.config.json'], {
      cwd: configCwd,
      deep: 1,
      ignore: IGNORED_DIRECTORIES,
    })

    if (files.length) {
      spinner.text = `The ${highlighter.info('duck-ui')} config found...`
      return
    }

    if (!_options.yes) {
      spinner.stop()
      const options = await prompts(duckuiPrompts)
      const { duckui } = preflightDuckuiOptionsSchema.parse(options)
      spinner.start()

      if (!duckui) {
        spinner.text = `The required ${highlighter.info('duck-ui')} config not found...`
        process.exit(0)
      }
    }

    let parseConfigOptions: ReturnType<typeof duckuiPromptsSchema.parse>

    if (_options.yes) {
      parseConfigOptions = duckuiPromptsSchema.parse({
        alias: _options.alias || '~',
        baseColor: _options.baseColor || 'zinc',
        css: _options.css || './src/styles.css',
        cssVariables: _options.cssVariables ?? true,
        monorepo: resolution.monorepo,
        prefix: _options.prefix || '',
        projectType: _options.projectType || 'VITE',
      })
    } else {
      spinner.text = `Initializing ${highlighter.info('duck-ui')} config...`
      spinner.stop()
      const configOptions = await prompts(duckuiRestPrompts)
      spinner.start()

      if (Object.keys(configOptions).length < duckuiRestPrompts.length) {
        spinner.text = `The required ${highlighter.info('duck-ui')} config not found...`
        process.exit(0)
      }
      parseConfigOptions = duckuiPromptsSchema.parse({
        ...configOptions,
        monorepo: resolution.monorepo,
      })
    }

    const themeResponse = await getRegistryBaseColor(parseConfigOptions.baseColor)
    if (!themeResponse?.light || !themeResponse?.dark) {
      spinner.fail('Failed to fetch theme from registry.')
      process.exit(1)
    }
    const css = generateThemeCSS(parseConfigOptions.baseColor, themeResponse)

    const cssFilePath = path.join(resolution.cssWorkspaceCwd, parseConfigOptions.css)
    const exists = fs.existsSync(cssFilePath)

    if (exists) {
      const oldContent = await fs.readFile(cssFilePath, 'utf-8')
      if (oldContent.length > 50) {
        let overwrite = _options.yes
        if (!_options.yes) {
          spinner.stop()
          ;({ overwrite } = await prompts({
            message: `The ${highlighter.info('tailwindCss')} settings already exists, do you want to overwrite it?`,
            name: 'overwrite',
            type: 'confirm',
          }))
          spinner.start()
        }

        if (overwrite) {
          // Extract only @import and @custom-variant preamble lines from the top of the file
          const lines = oldContent.split('\n')
          const preamble: string[] = []
          for (const line of lines) {
            const trimmed = line.trim()
            if (trimmed === '') {
              continue
            }
            if (trimmed.startsWith('@import ') || trimmed.startsWith('@custom-variant ')) {
              preamble.push(trimmed)
            } else {
              break
            }
          }
          const tailwindImports = preamble.join('\n')
          fs.writeFileSync(cssFilePath, tailwindImports ? `${tailwindImports}\n\n${css}` : css)
        }
      } else {
        // Small file, safe to append theme
        const oldContentTrimmed = oldContent.trim()
        fs.writeFileSync(cssFilePath, oldContentTrimmed ? `${oldContentTrimmed}\n\n${css}` : css)
      }
    } else {
      // Create the CSS file with the theme
      fs.mkdirSync(path.dirname(cssFilePath), { recursive: true })
      fs.writeFileSync(cssFilePath, css)
    }

    const cssWorkspaceRelative =
      resolution.cssWorkspaceCwd === configCwd ? undefined : path.relative(configCwd, resolution.cssWorkspaceCwd)
    await initDuckuiConfig(configCwd, spinner, parseConfigOptions, WORKSPACE_LOCAL_TARGET, cssWorkspaceRelative)
  } catch (error) {
    spinner.fail(
      `Failed to preflight required ${highlighter.error('duck-ui')} configs...\n ${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    process.exit(1)
  }
}
