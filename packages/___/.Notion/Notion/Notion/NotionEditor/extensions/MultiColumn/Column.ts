import { mergeAttributes, Node } from '@tiptap/core'

export const Column = Node.create({

  addAttributes() {
    return {
      position: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-position'),
        renderHTML: (attributes) => ({ 'data-position': attributes.position }),
      },
    }
  },

  content: 'block+',

  isolating: true,
  name: 'column',

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column' }), 0]
  },
})

export default Column
