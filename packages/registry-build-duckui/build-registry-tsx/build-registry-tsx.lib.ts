import fs from 'node:fs/promises'
import path from 'node:path'
import rimraf from 'rimraf'
import { ENV } from '../main'

// ----------------------------------------------------------------------------
export async function write_index_tsx(tsx_content: string) {
  tsx_content += `\n}`

  // Write style index.
  rimraf.sync(
    path.join(
      process.cwd(),
      `../..${ENV.REGISTRY_OUTPUT_PATH}__ui_registry__/index.tsx`,
    ),
  )
  await fs.writeFile(
    path.join(
      process.cwd(),
      `../..${ENV.REGISTRY_OUTPUT_PATH}__ui_registry__/index.tsx`,
    ),
    tsx_content,
    'utf8',
  )
}
