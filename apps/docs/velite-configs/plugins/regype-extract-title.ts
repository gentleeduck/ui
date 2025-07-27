import { UnistTree } from '../uniset'

export function rehypeExtractTitle() {
  return (tree: UnistTree) => {
    tree.children.forEach((node) => {
      if (node.tagName === 'pre') {
        const titleAttribute = node.properties?.__title__
        if (titleAttribute) {
          // Store title in a custom property on the node, e.g., data-title
          // @ts-ignore
          node.properties.dataTitle = titleAttribute
        }
      }
    })
  }
}
