import path from 'path'
import fs from 'fs/promises'
import { tmpdir } from 'os'
import { Project } from 'ts-morph'
import { registry, registry_schema } from '@/registry'
import { build_registry_index } from '../build-registry-index'
import { build_registry_components } from '../build-registry-components'
import { build_registry_tsx, write_index_tsx } from '../build-registry-tsx'
import { tsx_index } from './main.constants'
import { build_registry_styles_index } from '../build-registry-styles-index'

export async function main() {
  // 1- showing the home of the application
  // build_registry_home()
  // 2- validate the registry with zod.
  const registry_valid = registry_schema.safeParse(registry)

  if (!registry_valid.success) {
    console.error(registry_valid.error)
    process.exit(1)
  }

  // 3- build the registry index.
  const index = await build_registry_index(registry_valid.data)
  if (!index) return

  let tsx_content: string
  tsx_content = tsx_index
  for (const item of index) {
    // 4- build the components in the public folder.
    build_registry_components(item)

    // 5- build the __registry__/
    tsx_content += await build_registry_tsx(item)

    // 6- build the styles index.json
    await build_registry_styles_index(item)
  }
  await write_index_tsx(tsx_content)
}

export async function create_temp_source_file(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'shadcn-'))
  return path.join(dir, filename)
}

export const project = new Project({
  compilerOptions: {},
})
