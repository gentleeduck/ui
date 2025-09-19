import { Node } from '@tiptap/core'

export const Quote = Node.create({

  addKeyboardShortcuts() {
    return {
      Backspace: () => false,
    }
  },

  content: 'paragraph+',

  defining: true,

  marks: '',
  name: 'quote',

  parseHTML() {
    return [
      {
        tag: 'blockquote',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockquote', HTMLAttributes, 0]
  },
})

export default Quote
