import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'
import { registry_entry_schema, registry_schema } from '@/registry'
import { gen_temp_source_files, get_file_content, get_file_target } from './build-registry-components.lib'
import { PUBLIC_REGISTRY_PATH, REGISTRY_INDEX_WHITELIST } from '../main'

// ----------------------------------------------------------------------------
export async function build_registry_components(item: z.infer<typeof registry_schema>[number]): Promise<void> {
  if (!REGISTRY_INDEX_WHITELIST.includes(item.type) || !item.files) return

  const files = await Promise.all(
    item.files.map(async _file => {
      const content = await get_file_content(_file)
      const source_file = await gen_temp_source_files(_file, content)
      const target = await get_file_target(item, _file)

      return {
        path: _file.path,
        type: item.type,
        content: source_file.getText(),
        target,
      }
    })
  )

  const payload = registry_entry_schema.safeParse({
    ...item,
    files,
  })

  if (payload.success) {
    await fs.writeFile(path.join(PUBLIC_REGISTRY_PATH, `${item.name}.json`), JSON.stringify(payload.data, null, 2), {
      encoding: 'utf8',
      flag: 'w',
      mode: 0o644,
    })
  }
}
