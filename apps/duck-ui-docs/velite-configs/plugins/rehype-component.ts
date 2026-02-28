import fs from 'node:fs'
import path from 'node:path'
import type { UnistNode, UnistTree } from '@gentleduck/docs/types'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { Index } from '~/__ui_registry__'

const EXT_TO_LANG: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.js': 'javascript',
  '.jsx': 'jsx',
  '.css': 'css',
  '.json': 'json',
  '.md': 'markdown',
  '.mdx': 'mdx',
  '.html': 'html',
  '.sh': 'bash',
}

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    // @ts-expect-error
    visit(tree, (node: UnistNode) => {
      if (node.name === 'ComponentSource') {
        componentSource({ node })
      }
      if (node.name === 'ComponentPreview') {
        componentPreview({ node })
      }
    })
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}

function getLangFromExt(filePath: string): string {
  const ext = path.extname(filePath)
  return EXT_TO_LANG[ext] ?? 'plaintext'
}

function resolveFilePath(baseDir: string, filePath: string) {
  const absolute = path.join(baseDir, filePath)
  if (fs.existsSync(absolute)) return absolute

  const ext = path.extname(absolute)
  if (ext === '.ts') {
    const tsxPath = absolute.slice(0, -3) + '.tsx'
    if (fs.existsSync(tsxPath)) return tsxPath
  }
  if (ext === '.tsx') {
    const tsPath = absolute.slice(0, -4) + '.ts'
    if (fs.existsSync(tsPath)) return tsPath
  }

  return absolute
}

function createCodeNode(source: string, lang: string) {
  return u('element', {
    tagName: 'pre',
    properties: {},
    children: [
      u('element', {
        tagName: 'code',
        properties: { className: [`language-${lang}`] },
        children: [{ type: 'text', value: source }],
      }),
    ],
  })
}

// -- ComponentSource ----------------------------------------------------------

export function componentSource({ node }: { node: UnistNode }) {
  const sourcePath = getNodeAttributeByName(node, 'path')?.value as string | undefined

  if (!sourcePath) {
    console.warn('[ComponentSource] no path attribute found')
    return null
  }

  try {
    // process.cwd() is apps/duck-ui-docs/, go up to monorepo root
    const resolved = path.resolve(process.cwd(), '../../', sourcePath)

    if (!fs.existsSync(resolved)) {
      console.warn(`[ComponentSource] path not found: ${resolved}`)
      return null
    }

    const stat = fs.statSync(resolved)

    if (stat.isDirectory()) {
      // Directory -- read all files, create a pre/code block for each (tabs)
      const entries = fs.readdirSync(resolved).filter((entry) => {
        const entryPath = path.join(resolved, entry)
        return fs.statSync(entryPath).isFile()
      })

      node.children = entries.map((entry) => {
        const filePath = path.join(resolved, entry)
        const lang = getLangFromExt(entry)
        const content = fs.readFileSync(filePath, 'utf8')
        const source = `// ${entry}\n${content}`
        return createCodeNode(source, lang)
      })
    } else {
      // Single file -- one pre/code block
      const lang = getLangFromExt(resolved)
      const fileName = path.basename(resolved)
      const content = fs.readFileSync(resolved, 'utf8')
      const source = `// ${fileName}\n${content}`
      node.children = [createCodeNode(source, lang)]
    }
  } catch (error) {
    console.error('[ComponentSource]', error)
  }
}

// -- ComponentPreview ---------------------------------------------------------

export function componentPreview({ node }: { node: UnistNode }) {
  const name = getNodeAttributeByName(node, 'name')?.value as string

  if (!name) {
    return null
  }

  try {
    const component = Index[`${name}`]
    const src = component?.files?.[0]?.path

    if (!src) {
      console.warn('no src found for', name)
      return null
    }

    const filePath = resolveFilePath(path.join(process.cwd(), '../../packages/registry-examples-duckui/src/'), src)
    let source = fs.readFileSync(filePath, 'utf8')

    source = source.replaceAll(`@gentleduck/registry-ui-duckui`, `~/components`)
    source = source.replaceAll('export default', 'export')

    node.children = [createCodeNode(source, 'tsx')]
  } catch (error) {
    console.error(error)
  }
}
