import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import { ImageUpload as ImageUploadComponent } from './view/ImageUpload'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: () => ReturnType
    }
  }
}

export const ImageUpload = Node.create({

  addCommands() {
    return {
      setImageUpload:
        () =>
        ({ commands }) =>
          commands.insertContent(`<div data-type="${this.name}"></div>`),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent)
  },

  defining: true,

  draggable: true,

  group: 'block',

  inline: false,

  isolating: true,
  name: 'imageUpload',

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ]
  },

  renderHTML() {
    return ['div', { 'data-type': this.name }]
  },

  selectable: true,
})

export default ImageUpload
