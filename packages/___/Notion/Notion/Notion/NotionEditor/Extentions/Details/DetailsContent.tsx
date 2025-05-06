import { Node, mergeAttributes } from '@tiptap/core'

const DetailsContent = Node.create({
  name: 'detailsContent',

  group: 'block',

  content: 'block+',

  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: (node) => node.hasAttribute('data-details-content') && null,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-details-content': '' }), 0]
  },

  addCommands() {
    return {
      setDetailsContent:
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
      'Mod-Shift-C': () => this.editor.commands.setDetailsContent(),
    }
  },
})

export default DetailsContent
