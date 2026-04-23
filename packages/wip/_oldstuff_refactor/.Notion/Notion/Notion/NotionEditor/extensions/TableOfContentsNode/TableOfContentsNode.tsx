import { Node, NodeViewRendererProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'

// import { TableOfContents } from '@/components/TableOfContents'

const TableOfNodeContent = (props: NodeViewRendererProps) => {
  const { editor } = props

  return (
    <NodeViewWrapper>
      <div className="p-2 -m-2 rounded-lg" contentEditable={false}>
        {/* <TableOfContents editor={editor} /> */}
      </div>
    </NodeViewWrapper>
  )
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableOfContentsNode: {
      insertTableOfContents: () => ReturnType
    }
  }
}

export const TableOfContentsNode = Node.create({

  addCommands() {
    return {
      insertTableOfContents:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableOfNodeContent)
  },
  atom: true,
  draggable: true,
  group: 'block',
  inline: false,
  name: 'tableOfContentsNode',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="table-of-content"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'table-of-content' }]
  },
  selectable: true,
})
