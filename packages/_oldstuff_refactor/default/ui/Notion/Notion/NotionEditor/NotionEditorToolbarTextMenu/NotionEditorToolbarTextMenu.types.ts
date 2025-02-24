import React from 'react'
import { Editor as CoreEditor } from '@tiptap/core'
import { Editor } from '@tiptap/core'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

export type NotionEditorToolBarTextMenuProps = {
  editor: Editor
}

export interface MenuProps {
  editor: Editor
  appendTo?: React.RefObject<any>
  shouldHide?: boolean
}

export interface ShouldShowProps {
  editor?: CoreEditor
  view: EditorView
  state?: EditorState
  oldState?: EditorState
  from?: number
  to?: number
}
