import fs from 'node:fs/promises'
import path from 'node:path'
import rimraf from 'rimraf'

// ----------------------------------------------------------------------------
export async function write_index_tsx(tsx_content: string) {
  tsx_content += `\n}`

  // Write style index.
  rimraf.sync(path.join(process.cwd(), '__ui_registry__/index.tsx'))
  await fs.writeFile(
    path.join(process.cwd(), '__ui_registry__/index.tsx'),
    tsx_content,
    'utf8',
  )
}
