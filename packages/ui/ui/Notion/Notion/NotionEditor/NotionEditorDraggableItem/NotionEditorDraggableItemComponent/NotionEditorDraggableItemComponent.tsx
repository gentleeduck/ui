import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import { ContentItemMenu } from '../../NotionEditorContentItemMenu/NotionEditorContentItemMenu'
import { useState } from 'react'

export const NotionEditorDraggableItemComponent: React.FC<NodeViewProps> = ({ editor, node, getPos }) => {
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => setHovered(false)

  return (
    <NodeViewWrapper
      className="custom-node-view"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hovered && <ContentItemMenu editor={editor} />}
      <NodeViewContent className="content-node" />
    </NodeViewWrapper>
  )
}
