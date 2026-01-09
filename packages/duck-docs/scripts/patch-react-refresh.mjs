import fs from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve(new URL('..', import.meta.url).pathname, 'dist')

const entries = await fs.readdir(distDir).catch(() => [])
const refreshRuntime = entries.find((name) => name.startsWith('@react-refresh-') && name.endsWith('.js'))

if (!refreshRuntime) {
  process.exit(0)
}

const filePath = path.join(distDir, refreshRuntime)
let source = await fs.readFile(filePath, 'utf8')

const before = source

source = source.replace(
  /const hooks = \[\];\nwindow\.__registerBeforePerformReactRefresh =/,
  'const hooks = []\nconst __isBrowser = typeof window !== "undefined"\nif (__isBrowser) window.__registerBeforePerformReactRefresh =',
)

source = source.replace(
  /const ignoredExports = window\.__getReactRefreshIgnoredExports\?\.\(\{ id \}\) \?\? \[\];/,
  'if (!__isBrowser) return\n\tconst ignoredExports = window.__getReactRefreshIgnoredExports?.({ id }) ?? []',
)

if (source !== before) {
  await fs.writeFile(filePath, source)
}
