import { registry, registry_schema } from '@/registry'
import { build_registry_index } from '../build-registry-index'
import { build_registry_components } from '../build-registry-components'
import { build_registry_tsx, write_index_tsx } from '../build-registry-tsx'
import { tsx_index } from './main.constants'
import { build_registry_styles_index } from '../build-registry-styles-index'
import { registry_build_colors } from '../build-registry-build-colors'
import { build_registry_home } from '../build-registry-home'
import { spinner } from './main.lib'

export async function main() {
  // 1- showing the home of the application
  await build_registry_home()

  const script_spinner = spinner('').start('🧭 Building the registry...')

  // 2- validate the registry with zod.
  const registry_valid = registry_schema.safeParse(registry)

  if (!registry_valid.success) {
    console.error(registry_valid.error)
    process.exit(1)
  }

  // 3- build the registry index.
  const index = await build_registry_index(registry_valid.data)
  if (!index) return

  // 4- build compoennts and registry and styles
  let tsx_content: string
  tsx_content = tsx_index

  for (const item of index) {
    // 1- build the components in the public folder.
    await build_registry_components(item)

    // 2- build the __registry__/
    tsx_content += await build_registry_tsx(item)

    // 3- build the styles index.json
    await build_registry_styles_index(item)
  }
  await write_index_tsx(tsx_content)

  // 5- build registry colors
  await registry_build_colors()

  script_spinner.succeed('🎉 Done!, the registry is ready!')
}
