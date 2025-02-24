import { z } from 'zod'
import fg from 'fast-glob'
import path from 'node:path'
import { registry_schema } from '@/registry'

// ----------------------------------------------------------------------------
export async function get_component_files(
  item: z.infer<typeof registry_schema>[0],
) {
  // 1- get the files inside the root_folder of the item ( component ).
  const files = await fg.glob('*.{ts,tsx}', {
    cwd: path.join(process.cwd(), `registry/${item.root_folder}`),
    deep: 1,
  })

  if (files.length === 0) {
    console.log({
      message:
        'Failed to get files from the root_folder with the {ts,tsx} extension.',
      error: `No files found in ${path.join(process.cwd(), `registry/${item.root_folder}`)}`,
      cwd: process.cwd(),
    })
  }

  // 2- return the item with the files inside it.
  return {
    ...item,
    files: files?.map((_file) => {
      const file = {
        path: `${item.root_folder}/${_file}`,
        type: item.type,
      }

      return file
    }),
  }
}
