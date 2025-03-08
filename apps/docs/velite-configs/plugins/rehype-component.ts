import fs from 'node:fs'
import path from 'node:path'
import { UnistNode, UnistTree } from 'types/unist'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import { Index } from '~/__ui_registry__'

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      // src prop overrides both name and fileName.
      const { value: srcPath } =
        (getNodeAttributeByName(node, 'src') as {
          name: string
          value?: string
          type?: string
        }) || {}

      if (node.name === 'ComponentSource') {
        componentSource({
          node,
          srcPath,
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

function get_component_source(files: { type: string; path: string }[]) {
  let item: ItemType[] = []
  // biome-ignore lint/style/useForOf: <explanation>
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(process.cwd(), 'registry', files[i]?.path)
    let source = `// ${files[i]?.path.split('/').splice(1).join('/')}\n\n`
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
        name: files[i]?.path.split('/')?.pop() ?? 'file',
        type: files[i]?.type,
        src: source,
      })
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
    }
  }
  return item
}

export function componentSource({
  node,
  srcPath,
}: {
  node: UnistNode
  srcPath?: string
}) {
  const name = getNodeAttributeByName(node, 'name')?.value as string
  const fileName = getNodeAttributeByName(node, 'fileName')?.value as
    | string
    | undefined

  if (!name && !srcPath) {
    return null
  }

  try {
    const component = Index[`${name}`]
    const files = component.files[0]
    console.log(component, 'name')
    // let items: ItemType[] = get_component_source(files)

    // node.children?.push(
    //   ...items.map((item) =>
    //     u('element', {
    //       tagName: 'pre',
    //       properties: {
    //         __src__: item.src,
    //         __rawString__: item.src,
    //       },
    //       children: [
    //         u('element', {
    //           tagName: 'code',
    //           properties: {
    //             className: ['language-tsx'],
    //           },
    //           children: [
    //             {
    //               type: 'text',
    //               value: item.src,
    //             },
    //           ],
    //         }),
    //       ],
    //     }),
    //   ),
    // )
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
    const src = component.files[0][0].path

    // // Read the source file.
    // const filePath = path.join(process.cwd(), 'registry', src)
    // let source = fs.readFileSync(filePath, 'utf8')
    //
    // // Replace imports.
    // // TODO: Use @swc/core and a visitor to replace this.
    // // For now a simple regex should do.
    // source = source.replaceAll(
    //   `@/registry/registry-ui-components`,
    //   `@/components/${src.split('/')[0].split('-')[1]}`,
    // )
    // source = source.replaceAll('export default', 'export')
    //
    // // Add code as children so that rehype can take over at build time.
    // node.children?.push(
    //   u('element', {
    //     tagName: 'pre',
    //     properties: {
    //       __src__: source,
    //     },
    //     children: [
    //       u('element', {
    //         tagName: 'code',
    //         properties: {
    //           className: ['language-tsx'],
    //         },
    //         children: [
    //           {
    //             type: 'text',
    //             value: source,
    //           },
    //         ],
    //       }),
    //     ],
    //   }),
    // )
  } catch (error) {
    console.error(error)
  }
}
