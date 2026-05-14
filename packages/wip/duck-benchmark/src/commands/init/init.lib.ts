import path from 'node:path'
import { getProjectConfig } from '~/src/utils'
import { compileBenchmark, renderBenchmark } from '~/src/utils/compile-benchmark'
import { listFiles } from '~/src/utils/list-files'
import { spinner as Spinner } from '~/src/utils/spinner'
import type { InitOptions } from './init.dto'
import { initOptionsSchema } from './init.dto'

export async function initCommandAction(opt: InitOptions) {
  const spinner = Spinner('Initializing...')
  const options = initOptionsSchema.parse(opt)
  const cwd = path.resolve(options.cwd)

  //NOTE: we added this prefix to the path hence we have this in the test project.
  const config = await getProjectConfig(cwd + '/test/')
  if (!config) return

  const entriesJson = await listFiles({
    cwds: [config.src],
    filter: ['button', 'vite-env.d.ts', 'main.tsx'],
    spinner,
  })
  await compileBenchmark({ cwd, folders: entriesJson, spinner })
  await renderBenchmark({ cwd, folders: entriesJson, spinner })

  //TODO: make sure to compile each file in these folders.
  //TODO: get compile result and statics regarding each file in the folder.
  console.dir(entriesJson, { depth: 11 })
}
