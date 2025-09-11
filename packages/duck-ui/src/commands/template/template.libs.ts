import { Registry } from '@gentleduck/registers'
import prompts from 'prompts'
import { highlighter } from '~/utils'
import { get_duckui_config } from '~/utils/get-project-info'
import { get_registry_index, get_registry_item } from '~/utils/get-registry'
import { registry_component_install } from '~/utils/registry-mutation'
import { spinner as Spinner } from '~/utils/spinner'

// export async function template_command_action(args: string[], opt: templateop) {
//   const spinner = Spinner('initializing...').start()
//   try
//
//
//     spinner.succeed('🧑 Done.!, enjoy mr duck!🦆')
//     process.exit(0)
//   } catch (error) {
//     spinner.fail('🦆 Something went wrong')
//   }
// }
