import { mergeAttributes, Node } from '@tiptap/core'

const Details = Node.create({

  addCommands() {
    return {
      setDetails:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            content: [{ type: 'detailsSummary' }, { type: 'detailsContent' }],
            type: this.name,
          })
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-D': () => this.editor.commands.setDetails(),
    }
  },

  content: 'detailsSummary detailsContent',

  group: 'block',
  name: 'details',

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
})

export default Details
