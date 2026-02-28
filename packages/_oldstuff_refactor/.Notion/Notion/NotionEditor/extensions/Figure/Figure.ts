import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

export const Figure = Node.create({

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            // Prevent dragging child nodes from figure
            dragstart: (view, event) => {
              if (!event.target) {
                return false
              }

              const pos = view.posAtDOM(event.target as HTMLElement, 0)
              const $pos = view.state.doc.resolve(pos)

              if ($pos.parent.type.name === this.type.name) {
                event.preventDefault()
              }

              return false
            },
          },
        },
      }),
    ]
  },

  content: 'block figcaption',

  defining: true,

  draggable: true,

  group: 'block',
  name: 'figure',

  parseHTML() {
    return [
      {
        tag: `figure[data-type="${this.name}"]`,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': this.name }), 0]
  },

  selectable: true,
})

export default Figure
