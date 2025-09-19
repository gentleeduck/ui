import fs from 'node:fs'
import path from 'node:path'
import { RegistryItemFile } from '@gentleduck/registers'
import { UnistNode, UnistTree } from 'types/unist'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { Index } from '~/__ui_registry__'

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node.name === 'ComponentSource') {
        componentSource({
          node,
        })
      }
      if (node.name === 'ComponentPreview') {
        componentPreview({
          node,
        })
      }
    })
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}

type ItemType = { name: string; type: string; src: string }

export function get_component_source(files: RegistryItemFile[]): ItemType[] {
  const item: ItemType[] = []

  for (let i = 0; i < files.length; i++) {
    if (!files[i]?.path) {
      console.log(`ERROR: no path found for file ${files[i]?.path}`)
    }
    const filePath = path.join(
      `../../packages/registry-${files[i]?.type === 'registry:ui' ? 'ui' : 'examples'}-duckui/src/`,
      files[i]!.path,
    )
    let source = `// ${files[i]?.path.split('/').splice(1).join('/')}\n`

    try {
      source += fs.readFileSync(filePath, 'utf8')
      // Replace imports.
      // TODO: Use @swc/core and a visitor to replace this.
      // For now a simple regex should do.
      source = source.replaceAll(
        `@/registry/registry-ui-components`,
        `@/components/${files[i]?.path.split('/')[0]?.split('-')[1]}`,
      )
      source = source.replaceAll('export default', 'export')
      item.push({
        name: files[i]!.path.split('/')?.pop() ?? 'file',
        src: source,
        type: files[i]!.type,
      })
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
    }
  }
  return item
}

export function componentSource({ node }: { node: UnistNode }) {
  const name = getNodeAttributeByName(node, 'name')?.value as string

  if (!name) {
    console.log('no name found')
    return null
  }

  try {
    const component = Index[`${name}`]
    const items = get_component_source(component?.files ?? [])

    node.children?.push(
      ...items.map((item) => {
        return u('element', {
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
          properties: {},
          tagName: 'pre',
        })
      }),
    )
  } catch (error) {
    console.error(error)
  }
}

export function componentPreview({ node }: { node: UnistNode }) {
  const name = getNodeAttributeByName(node, 'name')?.value as string

  if (!name) {
    return null
  }

  try {
    const component = Index[`${name}`]
    const src = component?.files?.[0]?.path

    if (!src) {
      console.log('no src found for', name)
      return null
    }
    // Read the source file.
    const filePath = path.join(process.cwd(), `../../packages/registry-examples-duckui/src/${src}`)
    let source = fs.readFileSync(filePath, 'utf8')

    // Replace imports.
    // TODO: Use @swc/core and a visitor to replace this.
    // For now a simple regex should do.
    source = source.replaceAll(`@gentleduck/registry-ui-duckui`, `~/components`)
    source = source.replaceAll('export default', 'export')

    // Add code as children so that rehype can take over at build time.
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
        tagName: 'pre',
      }),
    )
  } catch (error) {
    console.error(error)
  }
}
