import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NotionEditorDraggableItemComponent } from './NotionEditorDraggableItemComponent'

export const NotionEditorDraggableItem = Node.create({
  name: 'customNode',

  group: 'block',

  content: 'block+',

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

  addNodeView() {
    return ReactNodeViewRenderer(NotionEditorDraggableItemComponent)
  },
})

export const CustomNode = Node.create({
  name: 'customNode',

  group: 'block',

  content: 'block+',

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

  addNodeView() {
    return ReactNodeViewRenderer(NotionEditorDraggableItemComponent)
  },
})
