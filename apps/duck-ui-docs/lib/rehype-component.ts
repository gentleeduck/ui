import fs from 'node:fs'
import path from 'node:path'
import { UnistNode, UnistTree } from 'types/unist'
import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'

import { Index } from '../__ui_registry__'

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
        const name = getNodeAttributeByName(node, 'name')?.value as string
        // const fileName = getNodeAttributeByName(node, 'fileName')?.value as string | undefined

        if (!name && !srcPath) {
          return null
        }

        try {
          const component = Index[`${name}`]
          // @ts-ignore
          const files = component.files[0]
          // @ts-ignore
          const items: ItemType[] = get_component_source(files)

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
          const component = Index[`${name}`]
          //@ts-ignore
          const src = component.files[0][0].path

          // Read the source file.
          const filePath = path.join(process.cwd(), 'registry', src)
          let source = fs.readFileSync(filePath, 'utf8')

          // Replace imports.
          // TODO: Use @swc/core and a visitor to replace this.
          // For now a simple regex should do.
          source = source.replaceAll(
            `@/registry/registry-ui-components`,
            `@/components/${src.split('/')[0].split('-')[1]}`,
          )
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

      // if (node.name === "ComponentExample") {
      //   const source = getComponentSourceFileContent(node)
      //   if (!source) {
      //     return
      //   }

      //   // Replace the Example component with a pre element.
      //   node.children?.push(
      //     u("element", {
      //       tagName: "pre",
      //       properties: {
      //         __src__: src,
      //       },
      //       children: [
      //         u("element", {
      //           tagName: "code",
      //           properties: {
      //             className: ["language-tsx"],
      //           },
      //           children: [
      //             {
      //               type: "text",
      //               value: source,
      //             },
      //           ],
      //         }),
      //       ],
      //     })
      //   )

      //   const extractClassname = getNodeAttributeByName(
      //     node,
      //     "extractClassname"
      //   )
      //   if (
      //     extractClassname &&
      //     typeof extractClassname.value !== "undefined" &&
      //     extractClassname.value !== "false"
      //   ) {
      //     // Extract className from string
      //     // TODO: Use @swc/core and a visitor to extract this.
      //     // For now, a simple regex should do.
      //     const values = source.match(/className="(.*)"/)
      //     const className = values ? values[1] : ""

      //     // Add the className as a jsx prop so we can pass it to the copy button.
      //     node.attributes?.push({
      //       name: "extractedClassNames",
      //       type: "mdxJsxAttribute",
      //       value: className,
      //     })

      //     // Add a pre element with the className only.
      //     node.children?.push(
      //       u("element", {
      //         tagName: "pre",
      //         properties: {},
      //         children: [
      //           u("element", {
      //             tagName: "code",
      //             properties: {
      //               className: ["language-tsx"],
      //             },
      //             children: [
      //               {
      //                 type: "text",
      //                 value: className,
      //               },
      //             ],
      //           }),
      //         ],
      //       })
      //     )
      //   }
      // }
    })
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}

type ItemType = { name: string; type: string; src: string }
function get_component_source(files: { type: string; path: string }[]) {
  const item: ItemType[] = []
  for (let i = 0; i < files.length; i++) {
    // ! NOTE: This is a temporary solution
    const filePath = path.join(process.cwd(), 'registry', files[i]?.path || '')
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
        src: source,
        // ! NOTE: This is a temporary solution
        type: files[i]?.type ?? 'unknown',
      })
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
    }
  }
  return item
}
