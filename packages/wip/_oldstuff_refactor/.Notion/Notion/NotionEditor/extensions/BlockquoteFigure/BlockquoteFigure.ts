import { mergeAttributes } from '@tiptap/core'
import { Figure } from '../Figure'
import { Quote } from './Quote'
import { QuoteCaption } from './QuoteCaption'

declare module '@tiptap/core' {
  // eslint-disable-next-line no-unused-vars
  interface Commands<ReturnType> {
    blockquoteFigure: {
      setBlockquote: () => ReturnType
    }
  }
}

export const BlockquoteFigure = Figure.extend({

  addAttributes() {
    return {
      ...this.parent?.(),
    }
  },

  addCommands() {
    return {
      setBlockquote:
        () =>
        ({ state, chain }) => {
          const position = state.selection.$from.start()
          const selectionContent = state.selection.content()

          return chain()
            .focus()
            .insertContent({
              content: [
                {
                  content: selectionContent.content.toJSON() || [
                    {
                      attrs: {
                        textAlign: 'left',
                      },
                      type: 'paragraph',
                    },
                  ],
                  type: 'quote',
                },
                {
                  type: 'quoteCaption',
                },
              ],
              type: this.name,
            })
            .focus(position + 1)
            .run()
        },
    }
  },

  addExtensions() {
    return [Quote, QuoteCaption]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => false,
    }
  },

  content: 'quote quoteCaption',

  group: 'block',

  isolating: true,
  name: 'blockquoteFigure',

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': this.name }), ['div', {}, 0]]
  },
})

export default BlockquoteFigure
