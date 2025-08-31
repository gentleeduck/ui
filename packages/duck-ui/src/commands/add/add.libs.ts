import prompts from 'prompts'
import { get_registry_index, get_registry_item } from '~/utils/get-registry'
import { spinner as Spinner } from '~/utils/spinner'
import { addOptions, add_options_schema } from './add.dto'
import { registry_component_install } from '~/utils/registry-mutation'
import { get_duckui_config } from '~/utils/get-project-info'
import { Registry } from '@gentleduck/registers'
import { highlighter } from '~/utils'

export async function add_command_action(opt: addOptions) {
  const spinner = Spinner('initializing...').start()
  const options = add_options_schema.parse(opt)

  const registry = await get_registry_index()
  const filtered_registry = registry?.filter((item) => item.type === 'registry:ui')

  spinner.stop()
  const prompt: { component: string[] } = await prompts([
    {
      type: 'multiselect',
      name: 'component',
      message: '💡 Select component to install',
      choices: filtered_registry!.map((item) => ({
        title: item.name,
        value: item.name,
      })),
    },
  ])
  spinner.start()

  const components = await Promise.all(
    prompt.component?.map(async (item, idx) => {
      spinner.text = `🦆 Fetching components... ${highlighter.info(`[${idx}/${prompt.component.length}]`)}`
      return await get_registry_item(item as Lowercase<string>)
    }),
  )

  if (!components.length) {
    spinner.fail('🦆 No components found')
    process.exit(0)
  }

  spinner.succeed(
    `🦆 Fetched component${components.length > 1 ? 's' : ''} ${highlighter.info(`[${components.length}/${prompt.component.length}]`)}`,
  )

  const duckui_config = await get_duckui_config(process.cwd(), spinner)

  await registry_component_install(components as Registry, duckui_config, options, spinner)

  spinner.succeed('🧑 Done.!, enjoy mr duck!🦆')
  process.exit(0)
}
