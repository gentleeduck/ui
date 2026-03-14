import path from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import type { Ora } from 'ora'
import prompts from 'prompts'
import type { InitOptions } from '~/commands/init'
import { get_registry_base_color } from '~/utils/get-registry'
import { IGNORED_DIRECTORIES } from '../../get-project-info'
import { highlighter } from '../../text-styling'
import { find_workspace_projects, pick_default_workspace, type WorkspaceTarget } from '../../workspace'
import { duckui_config_prompts, duckui_prompts } from './preflight-duckui.constants'
import { duckui_prompts_schema, preflight_duckui_options_schema } from './preflight-duckui.dto'
import { generateThemeCSS, init_duckui_config } from './preflight-duckui.libs'

export async function preflight_duckui(_options: InitOptions, spinner: Ora) {
  try {
    spinner.text = `Checking for ${highlighter.info('duck-ui')} config...`
    const config_cwd =
      _options.monorepo && _options.workspace ? path.resolve(_options.cwd, _options.workspace) : _options.cwd
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
      // Use flag values or sensible defaults for non-interactive mode
      parse_config_options = duckui_prompts_schema.parse({
        project_type: _options.projectType || 'VITE',
        base_color: _options.baseColor || 'zinc',
        alias: _options.alias || '~',
        monorepo: _options.monorepo ?? false,
        css: _options.css || './src/styles.css',
        css_variables: _options.cssVariables ?? true,
        prefix: _options.prefix || '',
      })
    } else {
      spinner.text = `Initializing ${highlighter.info('duck-ui')} config...`
      spinner.stop()
      const config_options = await prompts(duckui_config_prompts)

      if (!Object.keys(config_options).length) {
        spinner.text = `The required ${highlighter.info('duck-ui')} config not found...`
        process.exit(0)
      }
      parse_config_options = duckui_prompts_schema.parse(config_options)
      spinner.start()
    }

    const theme_response = await get_registry_base_color(parse_config_options.base_color)
    if (!theme_response?.light || !theme_response?.dark) {
      spinner.fail('Failed to fetch theme from registry.')
      process.exit(1)
    }
    const css = generateThemeCSS(parse_config_options.base_color, theme_response)

    const css_cwd =
      parse_config_options.monorepo && _options.workspace
        ? path.resolve(_options.cwd, _options.workspace)
        : _options.cwd
    const css_file_path = path.join(css_cwd, parse_config_options.css)
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

    let workspace_target: WorkspaceTarget = { root: '.', project: '.' }
    if (parse_config_options.monorepo) {
      const workspace_projects = await find_workspace_projects(_options.cwd)
      let selected_project = _options.workspace ?? pick_default_workspace(_options.cwd, workspace_projects)

      if (!_options.yes && workspace_projects.length > 1) {
        spinner.stop()
        const workspace_prompt = await prompts({
          choices: workspace_projects.map((project) => ({ title: project, value: project })),
          initial: selected_project ? workspace_projects.indexOf(selected_project) : 0,
          message: `Select the ${highlighter.info('workspace')} where components should be installed`,
          name: 'workspace_project',
          type: 'select',
        })
        spinner.start()

        selected_project = workspace_prompt.workspace_project ?? selected_project
      }

      if (!selected_project) {
        spinner.warn(
          `Monorepo mode is enabled but no workspaces were detected. Falling back to ${highlighter.info(
            'current directory',
          )}.`,
        )
        selected_project = '.'
      }

      const selected_workspace_cwd = path.resolve(_options.cwd, selected_project)
      if (!fs.existsSync(path.join(selected_workspace_cwd, 'package.json'))) {
        spinner.fail(
          `Invalid workspace: ${highlighter.warn(
            selected_project,
          )}. Expected a package.json at ${highlighter.info(selected_workspace_cwd)}.`,
        )
        process.exit(1)
      }

      workspace_target = { root: '.', project: selected_project }
    }

    // When config lives in the workspace directory, project is '.' relative to config location
    const effective_workspace_target: WorkspaceTarget =
      parse_config_options.monorepo && _options.workspace ? { root: '.', project: '.' } : workspace_target

    await init_duckui_config(config_cwd, spinner, parse_config_options, effective_workspace_target)
  } catch (error) {
    spinner.fail(
      `Failed to preflight required ${highlighter.error('duck-ui')} configs...\n ${highlighter.error(error instanceof Error ? error.message : String(error))}`,
    )
    process.exit(1)
  }
}
