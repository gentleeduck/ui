import { registry, registry_schema } from '@/registry'
import { build_registry_index } from '../build-registry-index'
import { build_registry_components } from '../build-registry-components'
import path from 'path'
import fs from 'fs/promises'
import { REGISTRY_PATH } from './main.constants'
import { existsSync } from 'fs'
import { z } from 'zod'
export async function main() {
  // 1- showing the home of the application
  // build_registry_home()
  // 2- validate the registry with zod.
  const registry_valid = registry_schema.safeParse(registry)

  if (!registry_valid.success) {
    console.error(registry_valid.error)
    process.exit(1)
  }

  build_registry_index(registry_valid.data)
  // middleware((item, resolve_files) => {
  //   // 3- build the registry index.
  //   // 4- build the components in the public folder.
  //   build_registry_components(item)
  // })
}

export async function middleware(cb: (item: z.infer<typeof registry_schema>[0], resolved_files: string[]) => void) {
  for (const item of registry) {
    // 1- getting  the file paths for each item.
    const resolve_files = item.files?.map(file => `registry/${file}/`)
    if (!resolve_files) {
      continue
    }
    console.log(resolve_files)

    // 2- check for the components directory, if not create it.
    const targetPath = path.join(REGISTRY_PATH, 'components')
    if (!existsSync(targetPath)) {
      await fs.mkdir(targetPath, { recursive: true })
    }

    // 3- getting the type of the item it will be like this (registry:ui)=> ui.
    const type = item.type.split(':')[1]

    // 4- run the CBs
    cb(item, resolve_files)
  }
}
