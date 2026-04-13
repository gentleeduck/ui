import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import type { InitOptions } from '~/commands/init'
import { get_registry_base_color } from '~/utils/get-registry'
import { IGNORED_DIRECTORIES } from '../../get-project-info'
import { highlighter } from '../../text-styling'
import {
  detect_monorepo_kind,
  find_workspace_projects,
  format_monorepo_kind,
  pick_default_workspace,
  validate_workspace_target,
  type WorkspaceTarget,
} from '../../workspace'
import { duckui_prompts, duckui_rest_prompts, make_duckui_monorepo_prompt } from './preflight-duckui.constants'
import { duckui_prompts_schema, preflight_duckui_options_schema } from './preflight-duckui.dto'
import { generateThemeCSS, init_duckui_config } from './preflight-duckui.libs'

// When the config lives inside the workspace, both root and project are '.' relative
// to the config location.
const WORKSPACE_LOCAL_TARGET: WorkspaceTarget = { project: '.', root: '.' }

export type DuckuiResolution = {
  workspace_cwd: string
  monorepo: boolean
  // Where the CSS file lives. Equals workspace_cwd unless the user picked a
  // separate package for styles.
  css_workspace_cwd: string
}

const SAME_AS_COMPONENTS = '__same__'

export async function preflight_duckui_resolve_workspace(
  _options: InitOptions,
  spinner: Ora,
): Promise<DuckuiResolution> {
  const cwd = path.resolve(_options.cwd)

  const flag_monorepo = typeof _options.monorepo === 'boolean' ? _options.monorepo : null
  const flag_workspace = _options.workspace ?? null
  const flag_css_workspace = _options.cssWorkspace ?? null
  if (flag_workspace && flag_monorepo === false) {
    spinner.warn(`${highlighter.warn('--workspace')} ignored because ${highlighter.warn('--no-monorepo')} was set.`)
  }
  if (flag_css_workspace && flag_monorepo === false) {
    spinner.warn(
      `${highlighter.warn('--css-workspace')} ignored because ${highlighter.warn('--no-monorepo')} was set.`,
    )
  }

  const detected_kind = detect_monorepo_kind(cwd)

  let monorepo: boolean
  if (flag_monorepo === false) {
    monorepo = false
  } else if (flag_monorepo === true || flag_workspace || flag_css_workspace) {
    monorepo = true
  } else if (_options.yes) {
    // Non-interactive runs default to whatever auto-detection found, so a -y in a
    // turbo/pnpm/etc. repo doesn't silently fall back to single-project mode.
    monorepo = detected_kind !== null
  } else {
    spinner.stop()
    const answer = await prompts(
      make_duckui_monorepo_prompt(detected_kind ? format_monorepo_kind(detected_kind) : null),
    )
    spinner.start()
    if (typeof answer.monorepo !== 'boolean') {
      spinner.text = `${highlighter.info('init')} aborted...`
      process.exit(0)
    }
    monorepo = answer.monorepo
  }

  if (!monorepo) {
    return { css_workspace_cwd: cwd, monorepo: false, workspace_cwd: cwd }
  }

  // Workspace projects are needed both for the component pick and the CSS pick.
  // Cache the lookup so we don't glob twice.
  let workspace_projects_cache: string[] | null = null
  const get_workspace_projects = async () => {
    if (workspace_projects_cache === null) {
      workspace_projects_cache = await find_workspace_projects(cwd)
    }
    return workspace_projects_cache
  }

  let selected: string
  if (flag_workspace) {
    selected = flag_workspace
  } else {
    const workspace_projects = await get_workspace_projects()
    if (workspace_projects.length === 0) {
      spinner.warn(
        `Monorepo mode is on but no workspaces were detected. Falling back to ${highlighter.info('current directory')}.`,
      )
      selected = '.'
    } else if (workspace_projects.length === 1) {
      selected = workspace_projects[0] ?? '.'
      spinner.info(`Using only detected workspace: ${highlighter.info(selected)}`)
    } else if (_options.yes) {
      selected = pick_default_workspace(cwd, workspace_projects) ?? workspace_projects[0] ?? '.'
    } else {
      const default_pick = pick_default_workspace(cwd, workspace_projects) ?? workspace_projects[0] ?? null
      spinner.stop()
      const answer = await prompts({
        choices: workspace_projects.map((project) => ({ title: project, value: project })),
        initial: default_pick ? Math.max(0, workspace_projects.indexOf(default_pick)) : 0,
        message: `Select the ${highlighter.info('workspace')} where components should be installed`,
        name: 'workspace_project',
        type: 'select',
      })
      spinner.start()
      selected = (answer.workspace_project as string | undefined) ?? default_pick ?? '.'
    }
  }

  const workspace_cwd = path.resolve(cwd, selected)
  const workspace_error = validate_workspace_target(workspace_cwd, false)
  if (workspace_error) {
    spinner.fail(`Invalid workspace ${highlighter.warn(selected)}: ${workspace_error}`)
    process.exit(1)
  }

  let css_selected: string = selected
  if (flag_css_workspace) {
    css_selected = flag_css_workspace
  } else if (!_options.yes) {
    const workspace_projects = await get_workspace_projects()
    const other_workspaces = workspace_projects.filter((project) => path.resolve(cwd, project) !== workspace_cwd)
    if (other_workspaces.length > 0) {
      spinner.stop()
      const pick = await prompts({
        choices: [
          { title: `Same as components workspace (${selected})`, value: SAME_AS_COMPONENTS },
          ...other_workspaces.map((project) => ({ title: project, value: project })),
        ],
        initial: 0,
        message: `Where should the ${highlighter.info('CSS file')} live?`,
        name: 'css_workspace',
        type: 'select',
      })
      spinner.start()
      const picked = pick.css_workspace as string | undefined
      if (picked && picked !== SAME_AS_COMPONENTS) {
        css_selected = picked
      }
    }
  }

  const css_workspace_cwd = path.resolve(cwd, css_selected)
  if (css_workspace_cwd !== workspace_cwd) {
    const css_error = validate_workspace_target(css_workspace_cwd, false)
    if (css_error) {
      spinner.fail(`Invalid CSS workspace ${highlighter.warn(css_selected)}: ${css_error}`)
      process.exit(1)
    }
  }

  return { css_workspace_cwd, monorepo: true, workspace_cwd }
}

export async function preflight_duckui(
  _options: InitOptions,
  resolution: DuckuiResolution,
  spinner: Ora,
): Promise<void> {
  try {
    spinner.text = `Checking for ${highlighter.info('duck-ui')} config...`
    const config_cwd = resolution.workspace_cwd

    const files = fg.sync(['duck-ui.config.json'], {
      cwd: config_cwd,
      deep: 1,
      ignore: IGNORED_DIRECTORIES,
    })

    if (files.length) {
      spinner.text = `The ${highlighter.info('duck-ui')} config found...`
      return
    }

    if (!_options.yes) {
      spinner.stop()
      const options = await prompts(duckui_prompts)
      const { duckui } = preflight_duckui_options_schema.parse(options)
      spinner.start()

      if (!duckui) {
        spinner.text = `The required ${highlighter.info('duck-ui')} config not found...`
        process.exit(0)
      }
    }

    let parse_config_options: ReturnType<typeof duckui_prompts_schema.parse>

    if (_options.yes) {
      parse_config_options = duckui_prompts_schema.parse({
        alias: _options.alias || '~',
        base_color: _options.baseColor || 'zinc',
        css: _options.css || './src/styles.css',
        css_variables: _options.cssVariables ?? true,
        monorepo: resolution.monorepo,
        prefix: _options.prefix || '',
        project_type: _options.projectType || 'VITE',
      })
    } else {
      spinner.text = `Initializing ${highlighter.info('duck-ui')} config...`
      spinner.stop()
      const config_options = await prompts(duckui_rest_prompts)
      spinner.start()

      if (Object.keys(config_options).length < duckui_rest_prompts.length) {
        spinner.text = `The required ${highlighter.info('duck-ui')} config not found...`
        process.exit(0)
      }
      parse_config_options = duckui_prompts_schema.parse({
        ...config_options,
        monorepo: resolution.monorepo,
      })
    }

    const theme_response = await get_registry_base_color(parse_config_options.base_color)
    if (!theme_response?.light || !theme_response?.dark) {
      spinner.fail('Failed to fetch theme from registry.')
      process.exit(1)
    }
    const css = generateThemeCSS(parse_config_options.base_color, theme_response)

    const css_file_path = path.join(resolution.css_workspace_cwd, parse_config_options.css)
    const exists = fs.existsSync(css_file_path)

    if (exists) {
      const old_content = await fs.readFile(css_file_path, 'utf-8')
      if (old_content.length > 50) {
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
          const lines = old_content.split('\n')
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
          const tailwind_imports = preamble.join('\n')
          fs.writeFileSync(css_file_path, tailwind_imports ? `${tailwind_imports}\n\n${css}` : css)
        }
      } else {
        // Small file, safe to append theme
        const old_content_trimmed = old_content.trim()
        fs.writeFileSync(css_file_path, old_content_trimmed ? `${old_content_trimmed}\n\n${css}` : css)
      }
    } else {
      // Create the CSS file with the theme
      fs.mkdirSync(path.dirname(css_file_path), { recursive: true })
      fs.writeFileSync(css_file_path, css)
    }

    const css_workspace_relative =
      resolution.css_workspace_cwd === config_cwd
        ? undefined
        : path.relative(config_cwd, resolution.css_workspace_cwd)
    await init_duckui_config(config_cwd, spinner, parse_config_options, WORKSPACE_LOCAL_TARGET, css_workspace_relative)
  } catch (error) {
    spinner.fail(
      `Failed to preflight required ${highlighter.error('duck-ui')} configs...\n ${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    process.exit(1)
  }
}
