// @ts-nocheck

import { Editor as CoreEditor, Editor, isTextSelection } from '@tiptap/core'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  LucideIcon,
  Strikethrough,
  Text,
  Underline,
} from 'lucide-react'
import React from 'react'
import { IconType } from '../button'

export interface HighlightButtons extends EmailToolbarEditorType {
  style?: string
  color: string
}

export const highlightButtons: HighlightButtons[] = [
  {
    action: 'onChangeColor',
    color: 'rgb(34 197 94 / 1)',
    icon: null,
    label: 'Green',
    style: 'bg-green-500 border-green-700',
    value: 'currentColor',
  },
  {
    action: 'onChangeColor',
    color: 'rgb(59 130 246 / 1)',
    icon: null,
    label: 'Blue',
    style: 'border-blue-700 bg-blue-500',
    value: 'currentColor',
  },
  {
    action: 'onChangeColor',
    color: 'rgb(239 68 68 / 1)',
    icon: null,
    label: 'Red',
    style: 'border-red-700 bg-red-500',
    value: 'currentColor',
  },
  {
    action: 'onChangeColor',
    color: 'rgb(168 85 247 / 1)',
    icon: null,
    label: 'Purple',
    style: 'border-purple-800 bg-purple-500',
    value: 'currentColor',
  },
]

export type EmailToolbarEditorType = {
  action: keyof ReturnType<typeof useTextmenuCommands>
  value: keyof ReturnType<typeof useTextmenuStates>
  icon: LucideIcon | null
  label: string
}

export const emailToolbarEditor: EmailToolbarEditorType[] = [
  {
    action: 'onText',
    icon: Text,
    label: 'Paragraph',
    value: 'isText',
  },
  {
    action: 'onHeading1',
    icon: Heading1,
    label: 'Heading 1',
    value: 'isHeading1',
  },
  {
    action: 'onHeading2',
    icon: Heading2,
    label: 'Heading 2',
    value: 'isHeading2',
  },
  {
    action: 'onHeading3',
    icon: Heading3,
    label: 'Heading 3',
    value: 'isHeading3',
  },

  {
    action: 'onHeading4',
    icon: Heading4,
    label: 'Heading 4',
    value: 'isHeading4',
  },
  {
    action: 'onHeading5',
    icon: Heading5,
    label: 'Heading 5',
    value: 'isHeading5',
  },
  {
    action: 'onHeading6',
    icon: Heading6,
    label: 'Heading 6',
    value: 'isHeading6',
  },
]

export const emailToolbarEditorAlign: EmailToolbarEditorType[] = [
  {
    action: 'onAlignLeft',
    icon: AlignLeft,
    label: 'Align Left',
    value: 'isAlignLeft',
  },
  {
    action: 'onAlignCenter',
    icon: AlignCenter,
    label: 'Align center',
    value: 'isAlignCenter',
  },
  {
    action: 'onAlignRight',
    icon: AlignRight,
    label: 'Align Right',
    value: 'isAlignRight',
  },
  {
    action: 'onAlignJustify',
    icon: AlignJustify,
    label: 'Align Justify',
    value: 'isAlignJustify',
  },
]

export type TurnIntoComponentDataType = {
  action: keyof ReturnType<typeof useTextmenuCommands>
  value: keyof ReturnType<typeof useTextmenuStates>
  img: string
  label: string
  discription: string
  discriptionImg: string
}
export const turnIntoComponent: TurnIntoComponentDataType[] = [
  {
    action: 'onText',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.text,
    label: 'Text',
    value: 'isText',
    // discriptionImg: turnIntoImg.textDesc,
  },
  {
    action: 'onHeading1',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.header1,
    label: 'Heading 1',
    value: 'isHeading1',
    // discriptionImg: turnIntoImg.header1Desc,
  },
  {
    action: 'onHeading2',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.header2,
    label: 'Heading 2',
    value: 'isHeading2',
    // discriptionImg: turnIntoImg.header2Desc,
  },
  {
    action: 'onHeading3',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.header3,
    label: 'Heading 3',
    value: 'isHeading3',
    // discriptionImg: turnIntoImg.header3Desc,
  },
  // {
  //   value: 'isBold',
  //   action: 'onBold',
  //   img: turnIntoImg.page,
  //   label: 'Page',
  //   discription: 'Just start writing with plain text',
  //   discriptionImg: turnIntoImg.pageDesc,
  // },
  {
    action: 'onTaskList',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.todoList,
    label: 'To-do list',
    value: 'isTaskList',
    // discriptionImg: turnIntoImg.todoDesc,
  },
  {
    action: 'onBulletList',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.bullitLIst,
    label: 'bulleted list',
    value: 'isBulletList',
    // discriptionImg: turnIntoImg.bulletedDesc,
  },
  {
    action: 'onNumberList',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.numbered,
    label: 'Numbered list',
    value: 'isNumberedList',
    // discriptionImg: turnIntoImg.numberedDesc,
  },
  {
    action: 'onBold',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.toggle,
    label: 'Toggle list',
    value: 'isBold',
    // discriptionImg: turnIntoImg.toggleDesc,
  },
  {
    action: 'onBold',
    discription: 'Just start writing with plain text',
    // img: turnIntoImg.code,
    label: 'Code',
    value: 'isBold',
    // discriptionImg: turnIntoImg.codeDesc,
  },
  {
    action: 'onBold',
    discription: 'Capture a code snippet',
    // img: turnIntoImg.quote,
    label: 'Quote',
    value: 'isBold',
    // discriptionImg: turnIntoImg.quoteDesc,
  },
  {
    action: 'onBold',
    discription: 'Make writing stand out',
    // img: turnIntoImg.callout,
    label: 'Callout',
    value: 'isBold',
    // discriptionImg: turnIntoImg.callOutDesc,
  },
  {
    action: 'onBold',
    discription: 'Display a standalone math equation',
    // img: turnIntoImg.blockEquation,
    label: 'Block equation',
    value: 'isBold',
    // discriptionImg: turnIntoImg.mathDesc,
  },
  {
    action: 'onBold',
    discription: 'Hide content inside a large heading',
    // img: turnIntoImg.headdding1Toggle,
    label: 'Toggle heading 1',
    value: 'isBold',
    // discriptionImg: turnIntoImg.toggleHeadingDesc1,
  },
  {
    action: 'onBold',
    discription: 'Hide content inside a meduim heading',
    // img: turnIntoImg.headdding2Toggle,
    label: 'Toggle heading 2',
    value: 'isBold',
    // discriptionImg: turnIntoImg.toggleHeadingDesc2,
  },
  {
    action: 'onBold',
    discription: 'Hide content inside a small heading',
    // img: turnIntoImg.headdding3Toggle,
    label: 'Toggle heading 3',
    value: 'isBold',
    // discriptionImg: turnIntoImg.toggleHeadingDesc3,
  },
  {
    action: 'onBold',
    discription: 'Create 2 columns of blocks',
    // img: turnIntoImg.columnList,
    label: '2 columns',
    value: 'isBold',
    // discriptionImg: turnIntoImg.column2,
  },
  {
    action: 'onBold',
    discription: 'Create 3 columns of blocks',
    // img: turnIntoImg.columnList,
    label: '3 columns',
    value: 'isBold',
    // discriptionImg: turnIntoImg.column2,
  },
  {
    action: 'onBold',
    discription: 'Create 4 columns of blocks',
    // img: turnIntoImg.columnList,
    label: '4 columns',
    value: 'isBold',
    // discriptionImg: turnIntoImg.column2,
  },
  {
    action: 'onBold',
    discription: 'Create 5 columns of blocks',
    // img: turnIntoImg.columnList,
    label: '5 columns',
    value: 'isBold',
    // discriptionImg: turnIntoImg.column2,
  },
]

export type BubbleMenuIconsDataType = {
  label: string
  action: keyof ReturnType<typeof useTextmenuCommands>
  value: keyof ReturnType<typeof useTextmenuStates>
  icon: LucideIcon
}
export const bubbleMenuIconsData: BubbleMenuIconsDataType[] = [
  {
    action: 'onBold',
    icon: Bold,
    label: 'Bold',
    value: 'isBold',
  },
  {
    action: 'onItalic',
    icon: Italic,
    label: 'Italic',
    value: 'isItalic',
  },
  {
    action: 'onUnderline',
    icon: Underline,
    label: 'Underline',
    value: 'isUnderline',
  },
  {
    action: 'onStrike',
    icon: Strikethrough,
    label: 'Strike through',
    value: 'isStrike',
  },
  {
    action: 'onCode',
    icon: Code,
    label: 'Code',
    value: 'isCode',
  },
  {
    action: 'onCodeBlock',
    icon: Code,
    label: 'CodeBlock',
    value: 'isCodeBlock',
  },
]

export const useTextmenuCommands = (editor: Editor) => {
  const chainOnFocus = () => editor.chain().focus()

  const onBold = React.useCallback(() => chainOnFocus().toggleBold().run(), [editor])
  const onItalic = React.useCallback(() => chainOnFocus().toggleItalic().run(), [editor])
  const onStrike = React.useCallback(() => chainOnFocus().toggleStrike().run(), [editor])
  const onUnderline = React.useCallback(() => chainOnFocus().toggleUnderline().run(), [editor])
  const onCode = React.useCallback(() => chainOnFocus().toggleCode().run(), [editor])
  const onCodeBlock = React.useCallback(() => chainOnFocus().toggleCodeBlock().run(), [editor])

  //FIX:
  const onSubscript = React.useCallback(() => chainOnFocus().toggleSubscript().run(), [editor])
  const onSuperscript = React.useCallback(() => chainOnFocus().toggleSuperscript().run(), [editor])
  const onAlignLeft = React.useCallback(() => chainOnFocus().setTextAlign('left').run(), [editor])
  const onAlignCenter = React.useCallback(() => chainOnFocus().setTextAlign('center').run(), [editor])
  const onAlignRight = React.useCallback(() => chainOnFocus().setTextAlign('right').run(), [editor])
  const onAlignJustify = React.useCallback(() => chainOnFocus().setTextAlign('justify').run(), [editor])

  const onChangeColor = React.useCallback((color: string) => chainOnFocus().setColor(color).run(), [editor])
  const onClearColor = React.useCallback(() => chainOnFocus().unsetColor().run(), [editor])

  const onChangeHighlight = React.useCallback((color: string) => chainOnFocus().setHighlight({ color }).run(), [editor])
  const onClearHighlight = React.useCallback(() => chainOnFocus().unsetHighlight().run(), [editor])

  const onLink = React.useCallback(
    (url: string, inNewTab?: boolean) =>
      chainOnFocus()
        .extendMarkRange('link')
        .setLink({ href: url, target: inNewTab ? '_blank' : '' })
        .run(),
    [editor],
  )
  const unSetLink = React.useCallback(() => {
    chainOnFocus().unsetLink()
  }, [editor])

  const onSetFont = React.useCallback(
    (font: string) => {
      if (!font || font.length === 0) {
        return chainOnFocus().unsetFontFamily().run()
      }
      return chainOnFocus().setFontFamily(font).run()
    },
    [editor],
  )

  const onSetFontSize = React.useCallback(
    (fontSize: string) => {
      if (!fontSize || fontSize.length === 0) {
        return chainOnFocus().unsetFontSize().run()
      }
      return chainOnFocus().setFontSize(fontSize).run()
    },
    [editor],
  )

  const onHeading1 = React.useCallback(() => chainOnFocus().setHeading({ level: 1 }).run(), [editor])
  const onHeading2 = React.useCallback(() => chainOnFocus().setHeading({ level: 2 }).run(), [editor])
  const onHeading3 = React.useCallback(() => chainOnFocus().setHeading({ level: 3 }).run(), [editor])
  const onHeading4 = React.useCallback(() => chainOnFocus().setHeading({ level: 4 }).run(), [editor])
  const onHeading5 = React.useCallback(() => chainOnFocus().setHeading({ level: 5 }).run(), [editor])
  const onHeading6 = React.useCallback(() => chainOnFocus().setHeading({ level: 6 }).run(), [editor])
  const onText = React.useCallback(() => chainOnFocus().setParagraph().run(), [editor])
  const onTaskList = React.useCallback(() => chainOnFocus().toggleTaskList().run(), [editor])
  const onBulletList = React.useCallback(() => chainOnFocus().toggleBulletList().run(), [editor])

  const onNumberList = React.useCallback(() => chainOnFocus().toggleOrderedList().run(), [editor])
  const onDetailList = React.useCallback(() => chainOnFocus().toggleBold().run(), [editor])
  //

  return {
    onAlignCenter,
    onAlignJustify,
    onAlignLeft,
    onAlignRight,
    //
    onBold,
    onBulletList,
    onChangeColor,
    onChangeHighlight,
    onClearColor,
    onClearHighlight,
    onCode,
    onCodeBlock,
    onDetailList,
    onHeading1,
    onHeading2,
    onHeading3,
    onHeading4,
    onHeading5,
    onHeading6,
    onItalic,
    onLink,
    onNumberList,
    onSetFont,
    onSetFontSize,
    onStrike,
    onSubscript,
    onSuperscript,
    onTaskList,
    onText,
    onUnderline,
    unSetLink,
  }
}

export const useTextmenuContentTypes = (editor: Editor) => {
  const chainOnFocus = () => editor.chain().focus()

  //FIX: <ContentPickerOptions>
  const options = React.useMemo(() => {
    return [
      {
        id: 'hierarchy',
        label: 'Hierarchy',
        type: 'category',
      },
      {
        disabled: () => !editor.can().setParagraph(),
        icon: 'Pilcrow',
        id: 'paragraph',
        isActive: () =>
          editor.isActive('paragraph') &&
          !editor.isActive('orderedList') &&
          !editor.isActive('bulletList') &&
          !editor.isActive('taskList'),
        label: 'Paragraph',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setParagraph().run(),
        type: 'option',
      },
      {
        disabled: () => !editor.can().setHeading({ level: 1 }),
        icon: 'Heading1',
        id: 'heading1',
        isActive: () => editor.isActive('heading', { level: 1 }),
        label: 'Heading 1',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 1 }).run(),
        type: 'option',
      },
      {
        disabled: () => !editor.can().setHeading({ level: 2 }),
        icon: 'Heading2',
        id: 'heading2',
        isActive: () => editor.isActive('heading', { level: 2 }),
        label: 'Heading 2',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 2 }).run(),
        type: 'option',
      },
      {
        disabled: () => !editor.can().setHeading({ level: 3 }),
        icon: 'Heading3',
        id: 'heading3',
        isActive: () => editor.isActive('heading', { level: 3 }),
        label: 'Heading 3',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 3 }).run(),
        type: 'option',
      },
      {
        disabled: () => !editor.can().setHeading({ level: 4 }),
        icon: 'Heading4',
        id: 'heading4',
        isActive: () => editor.isActive('heading', { level: 4 }),
        label: 'Heading 4',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 4 }).run(),
        type: 'option',
      },

      {
        disabled: () => !editor.can().setHeading({ level: 5 }),
        icon: 'Heading5',
        id: 'heading5',
        isActive: () => editor.isActive('heading', { level: 5 }),
        label: 'Heading 5',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 5 }).run(),
        type: 'option',
      },

      {
        disabled: () => !editor.can().setHeading({ level: 6 }),
        icon: 'Heading6',
        id: 'heading6',
        isActive: () => editor.isActive('heading', { level: 6 }),
        label: 'Heading 6',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 3 }).run(),
        type: 'option',
      },

      {
        id: 'lists',
        label: 'Lists',
        type: 'category',
      },
      {
        disabled: () => !editor.can().toggleBulletList(),
        icon: 'List',
        id: 'bulletList',
        isActive: () => editor.isActive('bulletList'),
        label: 'Bullet list',
        onClick: () => chainOnFocus().toggleBulletList().run(),
        type: 'option',
      },
      {
        disabled: () => !editor.can().toggleOrderedList(),
        icon: 'ListOrdered',
        id: 'orderedList',
        isActive: () => editor.isActive('orderedList'),
        label: 'Numbered list',
        onClick: () => chainOnFocus().toggleOrderedList().run(),
        type: 'option',
      },
      {
        disabled: () => !editor.can().toggleTaskList(),
        icon: 'ListTodo',
        id: 'todoList',
        isActive: () => editor.isActive('taskList'),
        label: 'Todo list',
        //FIX:
        onClick: () => chainOnFocus().toggleTaskList().run(),
        type: 'option',
      },
    ]
  }, [editor, editor.state])

  return options
}

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

export const useTextmenuStates = (editor: Editor) => {
  const shouldShow = React.useCallback(
    ({ view, from }: ShouldShowProps) => {
      if (!view) {
        return false
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement
      const node = nodeDOM || domAtPos

      if (isCustomNodeSelected(editor, node)) {
        return false
      }

      return isTextSelected({ editor })
    },
    [editor],
  )

  return {
    currentColor: editor.getAttributes('textStyle')?.color || undefined,
    currentFont: editor.getAttributes('textStyle')?.fontFamily || undefined,
    currentHighlight: editor.getAttributes('highlight')?.color || undefined,
    currentSize: editor.getAttributes('textStyle')?.fontSize || undefined,
    isAlignCenter: editor.isActive({ textAlign: 'center' }),
    isAlignJustify: editor.isActive({ textAlign: 'justify' }),
    isAlignLeft: editor.isActive({ textAlign: 'left' }),
    isAlignRight: editor.isActive({ textAlign: 'right' }),
    isBold: editor.isActive('bold'),
    isBulletList: editor.isActive('bulletList'),
    isCode: editor.isActive('code'),
    isCodeBlock: editor.isActive('codeBlock'),
    isDetailList: editor.isActive('detailList'),
    isHeading1: editor.isActive('heading', { level: 1 }),
    isHeading2: editor.isActive('heading', { level: 2 }),
    isHeading3: editor.isActive('heading', { level: 3 }),
    isHeading4: editor.isActive('heading', { level: 4 }),
    isHeading5: editor.isActive('heading', { level: 5 }),
    isHeading6: editor.isActive('heading', { level: 6 }),
    isItalic: editor.isActive('italic'),
    isLink: editor.isActive('link'),
    isNumberedList: editor.isActive('orderedList'),
    isStrike: editor.isActive('strike'),
    //
    isSubscript: editor.isActive('subscript'),
    isSuperscript: editor.isActive('superscript'),

    isTaskList: editor.isActive('taskList'),
    isText: editor.isActive('text'),
    isUnderline: editor.isActive('underline'),
    shouldShow,
  }
}

export const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(selection)

  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false
  }

  return true
}

export const isTableGripSelected = (node: HTMLElement) => {
  let container = node

  while (container && !['TD', 'TH'].includes(container.tagName)) {
    container = container.parentElement!
  }

  const gripColumn = container && container.querySelector && container.querySelector('a.grip-column.selected')
  const gripRow = container && container.querySelector && container.querySelector('a.grip-row.selected')

  if (gripColumn || gripRow) {
    return true
  }

  return false
}

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    ImageBlock.name,
    ImageUpload.name,
    CodeBlock.name,
    ImageBlock.name,
    Link.name,
    Figcaption.name,
    // TableOfContentsNode.name,
  ]

  return customNodes.some((type) => editor.isActive(type)) || isTableGripSelected(node)
}
