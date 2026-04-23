import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NotionEditorDraggableItemComponent } from './NotionEditorDraggableItemComponent'

export const NotionEditorDraggableItem = Node.create({

  addNodeView() {
    return ReactNodeViewRenderer(NotionEditorDraggableItemComponent)
  },

  content: 'block+',

  group: 'block',
  name: 'customNode',

  parseHTML() {
    return [
      {
        tag: 'div[draggable-node]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'draggable-node': '' }), 0]
  },
})

export const CustomNode = Node.create({

  addNodeView() {
    return ReactNodeViewRenderer(NotionEditorDraggableItemComponent)
  },

  content: 'block+',

  group: 'block',
  name: 'customNode',

  parseHTML() {
    return [
      {
        tag: 'div[data-custom-node]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-custom-node': '' }), 0]
  },
})
