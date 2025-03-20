import path, { resolve } from 'node:path'
import fs from 'fs-extra'
import { init_options_schema, InitOptions } from './init.dto'
import { get_project_config } from '~/src/utils'
import { list_files } from '~/src/utils/list-files'
import { execa } from 'execa'
import { FileInfo, FolderInfo } from '~/src/utils/list-files/list-files.dto'
import { spinner as Spinner } from '~/src/utils/spinner'
import { compileBenchmark } from '~/src/utils/compile-benchmark'

export async function init_command_action(opt: InitOptions) {
  const spinner = Spinner('Initializing...').start()
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  //NOTE: we added this prefix to the path hence we have this in the test project.
  const config = await get_project_config(cwd + '/test/')
  if (!config) return

  const entries_json = await list_files({
    cwds: [config.src],
    filter: ['', 'vite-env.d.ts', 'main.tsx'],
    spinner,
  })
  const rs = await compileBenchmark({ folders: entries_json })
  // console.dir(entries_json, { depth: 11 })

  //TODO: make sure to compile each file in these folders.
  //TODO: get compile result and statics regarding each file in the folder.
  // logger.info({ args: ['Done.!'] })

  spinner.succeed('Done!')
}
