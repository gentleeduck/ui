import { Node, mergeAttributes } from '@tiptap/core'

export const SpaceNode = Node.create({
  name: 'space',

  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {}
  },

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
