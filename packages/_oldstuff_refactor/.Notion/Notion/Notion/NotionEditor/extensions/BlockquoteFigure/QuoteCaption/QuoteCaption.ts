import { Node } from '@tiptap/core'

export const QuoteCaption = Node.create({

  addKeyboardShortcuts() {
    return {
      // On Enter at the end of line, create new paragraph and focus
      Enter: ({ editor }) => {
        const {
          state: {
            selection: { $from, empty },
          },
        } = editor

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

        if (!isAtEnd) {
          return false
        }

        const pos = editor.state.selection.$from.end()

        return editor.chain().focus(pos).insertContentAt(pos, { type: 'paragraph' }).run()
      },
    }
  },

  content: 'text*',

  defining: true,

  group: 'block',

  isolating: true,
  name: 'quoteCaption',

  parseHTML() {
    return [
      {
        tag: 'figcaption',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figcaption', HTMLAttributes, 0]
  },
})

export default QuoteCaption
