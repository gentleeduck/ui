import path from 'node:path'
import prompts from 'prompts'
import {
  get_registry_base_color,
  get_registry_index,
  get_registry_item,
} from '~/utils/get-registry'
import { preflight_configs } from '~/utils/preflight-configs'
import { spinner as Spinner } from '~/utils/spinner'
import { InitOptions, init_options_schema } from './init.dto'

export async function init_command_action(opt: InitOptions) {
  const spinner = Spinner('Initializing...').start()
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  await preflight_configs({ cwd, spinner })

  const registry = await get_registry_index()
  const filtered_registry = registry?.filter(
    (item) => item.type === 'registry:ui',
  )

  spinner.stop()
  const prompt: { component: string[] } = await prompts([
    {
      type: 'multiselect',
      name: 'component',
      message: 'Select component to install',
      choices: filtered_registry!.map((item) => ({
        title: item.name,
        value: item.name,
      })),
    },
  ])

  const components = await Promise.all(
    prompt.component?.map(async (item) => {
      return await get_registry_item(item as Lowercase<string>)
    }),
  )

  spinner.start()

  // console.dir(components, { depth: null })

  const registrydf = await get_registry_base_color('zinc')
  console.log(registrydf)

  spinner.succeed('🧑 Done.!, enjoy mr duck!🦆')
}
