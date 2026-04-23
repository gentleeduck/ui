import { mergeAttributes, Node } from '@tiptap/core'

const DetailsSummary = Node.create({

  addCommands() {
    return {
      setDetailsSummary:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-S': () => this.editor.commands.setDetailsSummary(),
    }
  },

  content: 'inline*',

  group: 'block',
  name: 'detailsSummary',

  parseHTML() {
    return [
      {
        tag: 'summary',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['summary', mergeAttributes(HTMLAttributes), 0]
  },
})

export default DetailsSummary
