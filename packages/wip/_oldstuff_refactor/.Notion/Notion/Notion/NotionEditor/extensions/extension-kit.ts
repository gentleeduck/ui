'use client'

import { HocuspocusProvider } from '@hocuspocus/provider'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
// import { TableOfContentsNode } from './TableOfContentsNode'
import { all, createLowlight } from 'lowlight'
import { API } from '@/lib/api'
import { NotionEditorDraggableItem } from '../NotionEditorDraggableItem'
import {
  BlockquoteFigure,
  CharacterCount,
  Color,
  Column,
  // emojiSuggestion,
  Columns,
  Document,
  Dropcursor,
  // Emoji,
  Figcaption,
  // FileHandler,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  Link,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  // TableOfContents,
  TableCell,
  TableHeader,
  TableRow,
  TaskItem,
  TaskList,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
} from '.'
import { ImageUpload } from './ImageUpload'

const lowlight = createLowlight(all)

interface ExtensionKitProps {
  provider?: HocuspocusProvider | null
  userId?: string
  userName?: string
  userColor?: string
}

export const ExtensionKit = ({ provider, userId, userName = 'Maxi' }: ExtensionKitProps) => [
  Document,
  Columns,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  StarterKit.configure({
    blockquote: false,
    codeBlock: false,
    document: false,
    dropcursor: false,
    heading: false,
    history: false,
    horizontalRule: false,
  }),
  CodeBlockLowlight.configure({
    defaultLanguage: null,
    lowlight,
  }),
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  CharacterCount.configure({ limit: 50000 }),
  // TableOfContents,
  // TableOfContentsNode,
  ImageUpload.configure({
    clientId: provider?.document?.clientID,
  }),
  ImageBlock,
  // FileHandler.configure({
  //   allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  //   onDrop: (currentEditor: any, files: any, pos: any) => {
  //     files.forEach(async () => {
  //       const url = await API.uploadImage()

  //       currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run()
  //     })
  //   },
  //   onPaste: (currentEditor: any, files: any) => {
  //     files.forEach(async () => {
  //       const url = await API.uploadImage()

  //       return currentEditor
  //         .chain()
  //         .setImageBlockAt({ pos: currentEditor.state.selection.anchor, src: url })
  //         .focus()
  //         .run()
  //     })
  //   },
  // }),
  // Emoji.configure({
  //   enableEmoticons: true,
  //   suggestion: emojiSuggestion,
  // }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {}
    },
  }).configure({
    types: ['heading', 'paragraph'],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    placeholder: () => '',
    showOnlyCurrent: false,
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    class: 'ProseMirror-dropcursor border-black',
    width: 2,
  }),
  NotionEditorDraggableItem,
]

export default ExtensionKit
