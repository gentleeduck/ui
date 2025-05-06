import path from 'node:path'
import { init_options_schema, InitOptions } from './init.dto'
import { get_project_config } from '~/src/utils'
import { list_files } from '~/src/utils/list-files'
import { spinner as Spinner } from '~/src/utils/spinner'

import { compile_benchmark, render_benchmark } from '~/src/utils/compile-benchmark'

export async function init_command_action(opt: InitOptions) {
  const spinner = Spinner('Initializing...')
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  //NOTE: we added this prefix to the path hence we have this in the test project.
  const config = await get_project_config(cwd + '/test/')
  if (!config) return

  const entries_json = await list_files({
    cwds: [config.src],
    filter: ['button', 'vite-env.d.ts', 'main.tsx'],
    spinner,
  })
  await compile_benchmark({ folders: entries_json, spinner, cwd })
  await render_benchmark({ folders: entries_json, spinner, cwd })

  //TODO: make sure to compile each file in these folders.
  //TODO: get compile result and statics regarding each file in the folder.
  // logger.info({ args: ['Done.!'] })

  // spinner.succeed('Done!')
  console.dir(entries_json, { depth: 11 })
}
