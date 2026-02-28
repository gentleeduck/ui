import { mergeAttributes, Node } from '@tiptap/core'

const DetailsContent = Node.create({

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

  content: 'block+',

  group: 'block',
  name: 'detailsContent',

  parseHTML() {
    return [
      {
        getAttrs: (node) => node.hasAttribute('data-details-content') && null,
        tag: 'div',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-details-content': '' }), 0]
  },
})

export default DetailsContent
