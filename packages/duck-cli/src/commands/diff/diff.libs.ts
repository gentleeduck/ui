import path from 'node:path'
import kleur from 'kleur'
import prompts from 'prompts'
import { diff_components, resolve_write_type_path, scan_installed_components } from '~/services/component.service'
import { resolve_install_path } from '~/services/install.service'
import { print_banner } from '~/utils/banner'
import { build_display_lines, format_line_number, get_max_line_number } from '~/utils/diff-format'
import { get_duckui_config, get_ts_config } from '~/utils/get-project-info'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { is_verbose } from '~/utils/verbose'
import { resolve_project_cwd, validate_workspace_target } from '~/utils/workspace'
import { type DiffOptions, diff_arguments_schema, diff_options_schema } from './diff.dto'

export async function diff_command_action(args: string[], opt: DiffOptions) {
  const options = diff_options_schema.parse(opt)
  const component_names = diff_arguments_schema.parse(args)

  if (options.gui) {
    const { launch_gui } = await import('~/gui')
    launch_gui({ initialArgs: component_names })
    return
  }

  print_banner()
  const spinner = Spinner('initializing...').start()
  try {
    const cwd = path.resolve(options.cwd)

    const duckui_config = await get_duckui_config(cwd, spinner)
    const project_cwd = resolve_project_cwd(cwd, duckui_config, options.workspace)
    const workspace_error = validate_workspace_target(project_cwd, true)
    if (workspace_error) {
      spinner.fail(workspace_error)
      process.exit(1)
    }
    spinner.info(`Using workspace: ${project_cwd}`)
    const ts_config = await get_ts_config(project_cwd, spinner)

    const path_result = resolve_install_path(duckui_config, ts_config)
    if (!path_result.ok) {
      spinner.fail(path_result.error)
      process.exit(1)
    }

    const write_type_path = resolve_write_type_path(duckui_config, path.resolve(project_cwd, path_result.data))

    spinner.text = 'Scanning installed components...'
    const scan_result = await scan_installed_components(write_type_path)
    if (!scan_result.ok) {
      spinner.fail(scan_result.error)
      process.exit(1)
    }

    if (scan_result.data.length === 0) {
      spinner.fail('No installed components found.')
      process.exit(1)
    }

    let selected = scan_result.data

    if (component_names.length === 0) {
      spinner.stop()
      const { picked } = await prompts({
        type: 'autocompleteMultiselect',
        name: 'picked',
        message: 'Select components to diff',
        choices: scan_result.data.map((c) => ({ title: c.name, value: c.name })),
      })
      spinner.start()

      if (!picked || picked.length === 0) {
        spinner.info('No components selected.')
        process.exit(0)
      }

      selected = scan_result.data.filter((c) => picked.includes(c.name))
    } else {
      selected = scan_result.data.filter((c) => component_names.some((n) => n.toLowerCase() === c.name.toLowerCase()))

      if (selected.length === 0) {
        spinner.fail(
          `None of the specified components are installed: ${component_names.map((n) => highlighter.info(n)).join(', ')}`,
        )
        process.exit(1)
      }
    }

    spinner.text = 'Comparing with registry...'
    const diff_result = await diff_components(selected, (msg) => {
      spinner.text = msg
    })

    if (!diff_result.ok) {
      spinner.fail(diff_result.error)
      process.exit(1)
    }

    spinner.stop()

    let has_diffs = false
    for (const comp_diff of diff_result.data) {
      if (comp_diff.is_identical) {
        console.log(`\n${highlighter.info(comp_diff.name)}: ${kleur.green('identical')}`)
        continue
      }

      has_diffs = true
      console.log(`\n${highlighter.info(comp_diff.name)}: ${kleur.yellow('modified')}`)

      for (const file_diff of comp_diff.diffs) {
        const lines = build_display_lines(file_diff.file_path, file_diff.local_content, file_diff.registry_content)
        const max_num = get_max_line_number(lines)
        const num_width = Math.max(String(max_num).length, 3)

        for (const line of lines) {
          if (line.type === 'file-header') {
            console.log(kleur.bold(line.raw_text))
            continue
          }

          if (line.type === 'hunk-header') {
            console.log(kleur.cyan(line.raw_text))
            continue
          }

          const old_num = format_line_number(line.old_line_num, num_width)
          const new_num = format_line_number(line.new_line_num, num_width)
          const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '

          // Build line content with word-level highlighting
          let content = ''
          for (const seg of line.segments) {
            if (seg.highlight) {
              if (line.type === 'remove') {
                content += kleur.bgRed().white(seg.text)
              } else if (line.type === 'add') {
                content += kleur.bgGreen().black(seg.text)
              } else {
                content += seg.text
              }
            } else {
              if (line.type === 'remove') {
                content += kleur.red(seg.text)
              } else if (line.type === 'add') {
                content += kleur.green(seg.text)
              } else {
                content += kleur.gray(seg.text)
              }
            }
          }

          const line_nums = kleur.gray(`${old_num} ${new_num}`)
          const prefix_colored =
            line.type === 'add' ? kleur.green(prefix) : line.type === 'remove' ? kleur.red(prefix) : kleur.gray(prefix)

          console.log(`${line_nums} ${prefix_colored} ${content}`)
        }
        console.log()
      }
    }

    process.exit(has_diffs ? 1 : 0)
  } catch (error) {
    spinner.fail(`Something went wrong: ${error instanceof Error ? error.message : String(error)}`)
    if (is_verbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
