import { visit } from 'unist-util-visit'
import { UnistNode, UnistTree } from '../uniset'

export function rehypeMarkText() {
  return (tree: UnistTree) => {
    visit(tree, 'element', (node: UnistNode) => {
      if (node.tagName === 'pre') {
        const codeNode = node.children?.find((n) => n.tagName === 'code')
        if (!codeNode) return

        const marks = codeNode.properties?.__marks__ ?? []
        if (!Array.isArray(marks) || marks.length === 0) return

        // walkAndMutate(codeNode, marks)
      }
    })
  }
}

// Recursively walk children and mutate text
function walkAndMutate(node: UnistNode, marks: string[]) {
  if (!node.children) return

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]

    // Dive deeper if not text
    if (child?.type === 'element') {
      walkAndMutate(child, marks)
    }

    // If it's a text node and contains any mark string
    if (child?.type === 'text' && typeof child.value === 'string') {
      const parts = splitAndWrapMarks(child.value, marks)

      // Replace the original text node with wrapped nodes
      if (parts.length > 1 || typeof parts[0] !== 'string') {
        node.children.splice(i, 1, ...parts)
        i += parts.length - 1
      }
    }
  }
}

// Split a string and wrap marked matches in <mark><span>...</span></mark>
function splitAndWrapMarks(text: string, marks: string[]): UnistNode[] {
  const nodes: UnistNode[] = []
  let remaining = text

  while (remaining.length > 0) {
    let match: string | null = null
    let index = -1

    for (const mark of marks) {
      const idx = remaining.indexOf(mark)
      if (idx !== -1 && (index === -1 || idx < index)) {
        match = mark
        index = idx
      }
    }

    if (match === null) {
      nodes.push({ type: 'text', value: remaining })
      break
    }

    if (index > 0) {
      nodes.push({ type: 'text', value: remaining.slice(0, index) })
    }

    // Push the marked element
    nodes.push({
      children: [
        {
          children: [{ type: 'text', value: match }],
          properties: {
            style: '--shiki-dark: #85E89D; --shiki-light: #116329;',
          },
          tagName: 'span',
          type: 'element',
        },
      ],
      properties: { 'data-highlighted-chars': '' },
      tagName: 'mark',
      type: 'element',
    })

    remaining = remaining.slice(index + match.length)
  }

  return nodes
}
