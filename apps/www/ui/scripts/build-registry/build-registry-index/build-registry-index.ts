import { z } from 'zod'
import fg from 'fast-glob'
import fs from 'fs/promises'
import path from 'path'
import rimraf from 'rimraf'

import { registry_schema } from '@/registry'
import { REGISTRY_PATH } from '../main'

// ----------------------------------------------------------------------------
export async function build_registry_index(registry: z.infer<typeof registry_schema>) {
  // 1- getting the component path.
  const items = await Promise.all(
    registry.filter(item => ['registry:ui'].includes(item.type)).map(item => get_component_files(item))
  )
  console.dir(items, { depth: 10 })

  // 2- making it as json and remove the (index.json) file and replace it with the new one.
  const registryJson = JSON.stringify(items, null, 2)
  rimraf.sync(path.join(REGISTRY_PATH, 'index.json'))
  await fs.writeFile(path.join(REGISTRY_PATH, 'index.json'), registryJson, 'utf8')
}

// ----------------------------------------------------------------------------
export async function get_component_files(item: z.infer<typeof registry_schema>[0]) {
  // 1- get the files inside the root_folder of the item ( component ).
  const files = await fg.glob('*.ts', {
    cwd: path.join(process.cwd(), `registry/${item.root_folder}`),
    deep: 1,
  })

  if (files.length === 0) {
    console.log({
      error: `No files found in ${path.join(process.cwd(), `registry/${item.root_folder}`)}`,
    })
  }

  // 2- return the item with the files inside it.
  return {
    ...item,
    files: files?.map(_file => {
      const file = {
        path: _file,
        type: item.type,
      }

      return file
    }),
  }
}
