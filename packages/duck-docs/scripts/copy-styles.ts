import { copyFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const packageRoot = path.resolve(import.meta.dirname, '..')
const srcStylesDir = path.join(packageRoot, 'src', 'styles')
const distStylesDir = path.join(packageRoot, 'dist', 'styles')

await mkdir(distStylesDir, { recursive: true })

const entries = await readdir(srcStylesDir, { withFileTypes: true })
for (const entry of entries) {
  if (!entry.isFile()) continue
  if (!entry.name.endsWith('.css')) continue
  await copyFile(path.join(srcStylesDir, entry.name), path.join(distStylesDir, entry.name))
}
