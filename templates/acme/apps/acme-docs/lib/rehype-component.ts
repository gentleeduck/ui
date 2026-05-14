import fs from 'node:fs'
import path from 'node:path'
import type { IUnistNode, IUnistTree } from '@gentleduck/docs/types'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { getRegistryIndex } from './registry-index.server'

export function rehypeComponent() {
  const index = getRegistryIndex()

  return async (tree: IUnistTree) => {
    visit(tree, (node: IUnistNode) => {
      const { value: srcPath } =
        (getNodeAttributeByName(node, 'src') as {
          name: string
          value?: string
          type?: string
        }) || {}

      if (node.name === 'ComponentSource') {
        const name = getNodeAttributeByName(node, 'name')?.value as string

        if (!name && !srcPath) {
          return null
        }

        try {
          const component = index[`${name}`]
          if (!component?.files?.[0]) return null
          const files = component.files
          const items: ItemType[] = getComponentSource(files as { type: string; path: string }[])

          node.children?.push(
            ...items.map((item) =>
              u('element', {
                children: [
                  u('element', {
                    children: [
                      {
                        type: 'text',
                        value: item.src,
                      },
                    ],
                    properties: {
                      className: ['language-tsx'],
                    },
                    tagName: 'code',
                  }),
                ],
                properties: {
                  __rawString__: item.src,
                  __src__: item.src,
                },
                tagName: 'pre',
              }),
            ),
          )
        } catch (error) {
          console.error(error)
        }
      }

      if (node.name === 'ComponentPreview') {
        const name = getNodeAttributeByName(node, 'name')?.value as string

        if (!name) {
          return null
        }

        try {
          const component = index[`${name}`]
          if (!component?.files?.[0]) return null
          const firstFile = component.files[0] as { path: string }
          const src = firstFile.path

          const filePath = path.join(process.cwd(), 'registry', src)
          let source = fs.readFileSync(filePath, 'utf8')

          // TODO: replace via @swc/core visitor instead of regex.
          source = source.replaceAll(
            `@/registry/registry-ui-components`,
            `@/components/${src.split('/')[0]?.split('-')[1] ?? ''}`,
          )
          source = source.replaceAll('export default', 'export')

          node.children?.push(
            u('element', {
              children: [
                u('element', {
                  children: [
                    {
                      type: 'text',
                      value: source,
                    },
                  ],
                  properties: {
                    className: ['language-tsx'],
                  },
                  tagName: 'code',
                }),
              ],
              properties: {
                __src__: source,
              },
              tagName: 'pre',
            }),
          )
        } catch (error) {
          console.error(error)
        }
      }

    })
  }
}

function getNodeAttributeByName(node: IUnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}

type ItemType = { name: string; type: string; src: string }
function getComponentSource(files: { type: string; path: string }[]) {
  const item: ItemType[] = []
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(process.cwd(), 'registry', files[i]?.path || '')
    let source = `// ${files[i]?.path.split('/').slice(1).join('/')}\n\n`
    try {
      source += fs.readFileSync(filePath, 'utf8')

      // TODO: replace via @swc/core visitor instead of regex.
      source = source.replaceAll(
        `@/registry/registry-ui-components`,
        `@/components/${files[i]?.path.split('/')[0]?.split('-')[1]}`,
      )
      source = source.replaceAll('export default', 'export')
      item.push({
        name: files[i]?.path.split('/')?.pop() ?? 'file',
        src: source,
        type: files[i]?.type ?? 'unknown',
      })
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
    }
  }
  return item
}
