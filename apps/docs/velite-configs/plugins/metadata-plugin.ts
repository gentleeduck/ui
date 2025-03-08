import { UnistNode, UnistTree } from '../uniset'

export function metadataPlugin() {
  return (tree: UnistTree): UnistTree => {
    return {
      ...tree,
      children: tree.children.map((node: UnistNode) => {
        return {
          ...node,
          children: node.children?.map((child: UnistNode) => {
            let match = [] as unknown as RegExpExecArray

            if (child?.type === 'element' && child?.tagName === 'code') {
              if (child?.tagName !== 'code') {
                return child
              }

              if (child.data?.meta) {
                match = [
                  ...match,
                  ((child.data.meta as string).match(/event="([^"]*)"/) ??
                    [])[1],
                ] as unknown as RegExpExecArray
              }
            }

            return {
              ...child,
              properties: {
                ...child?.properties,
                __event__: match?.[0],
              },
            }
          }),
        }
      }),
    }
  }
}
