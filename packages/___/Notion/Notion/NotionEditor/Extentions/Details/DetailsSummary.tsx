import { Node, mergeAttributes } from '@tiptap/core'

const DetailsSummary = Node.create({
  name: 'detailsSummary',

  group: 'block',

  content: 'inline*',

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
})

export default DetailsSummary
