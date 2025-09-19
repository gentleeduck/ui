import { mergeAttributes, Node } from '@tiptap/core'

export const SpaceNode = Node.create({

  addAttributes() {
    return {}
  },
  atom: true,

  group: 'inline',
  inline: true,
  name: 'space',

  parseHTML() {
    return [
      {
        tag: 'span[data-space]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-space': true,
        style: 'display: inline-block; width: 0; height: 1px;',
      }),
    ]
  },
})
