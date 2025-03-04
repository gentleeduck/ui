import { Node, mergeAttributes } from '@tiptap/core'

const Details = Node.create({
  name: 'details',

  group: 'block',

  content: 'detailsSummary detailsContent',

  parseHTML() {
    return [
      {
        tag: 'details',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['details', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setDetails:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [{ type: 'detailsSummary' }, { type: 'detailsContent' }],
          })
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-D': () => this.editor.commands.setDetails(),
    }
  },
})

export default Details
