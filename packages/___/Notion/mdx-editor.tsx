// @ts-nocheck
import React from 'react'
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
import { IconType } from '../button'
import { isTextSelection } from '@tiptap/core'
import { Editor } from '@tiptap/core'
import { Editor as CoreEditor } from '@tiptap/core'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

export interface HighlightButtons extends EmailToolbarEditorType {
  style?: string
  color: string
}

export const highlightButtons: HighlightButtons[] = [
  {
    value: 'currentColor',
    action: 'onChangeColor',
    icon: null,
    label: 'Green',
    style: 'bg-green-500 border-green-700',
    color: 'rgb(34 197 94 / 1)',
  },
  {
    value: 'currentColor',
    action: 'onChangeColor',
    icon: null,
    label: 'Blue',
    style: 'border-blue-700 bg-blue-500',
    color: 'rgb(59 130 246 / 1)',
  },
  {
    value: 'currentColor',
    action: 'onChangeColor',
    icon: null,
    label: 'Red',
    style: 'border-red-700 bg-red-500',
    color: 'rgb(239 68 68 / 1)',
  },
  {
    value: 'currentColor',
    action: 'onChangeColor',
    icon: null,
    label: 'Purple',
    style: 'border-purple-800 bg-purple-500',
    color: 'rgb(168 85 247 / 1)',
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
    value: 'isText',
    action: 'onText',
    icon: Text,
    label: 'Paragraph',
  },
  {
    value: 'isHeading1',
    action: 'onHeading1',
    icon: Heading1,
    label: 'Heading 1',
  },
  {
    value: 'isHeading2',
    action: 'onHeading2',
    icon: Heading2,
    label: 'Heading 2',
  },
  {
    value: 'isHeading3',
    action: 'onHeading3',
    icon: Heading3,
    label: 'Heading 3',
  },

  {
    value: 'isHeading4',
    action: 'onHeading4',
    icon: Heading4,
    label: 'Heading 4',
  },
  {
    value: 'isHeading5',
    action: 'onHeading5',
    icon: Heading5,
    label: 'Heading 5',
  },
  {
    value: 'isHeading6',
    action: 'onHeading6',
    icon: Heading6,
    label: 'Heading 6',
  },
]

export const emailToolbarEditorAlign: EmailToolbarEditorType[] = [
  {
    value: 'isAlignLeft',
    action: 'onAlignLeft',
    icon: AlignLeft,
    label: 'Align Left',
  },
  {
    value: 'isAlignCenter',
    action: 'onAlignCenter',
    icon: AlignCenter,
    label: 'Align center',
  },
  {
    value: 'isAlignRight',
    action: 'onAlignRight',
    icon: AlignRight,
    label: 'Align Right',
  },
  {
    value: 'isAlignJustify',
    action: 'onAlignJustify',
    icon: AlignJustify,
    label: 'Align Justify',
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
    value: 'isText',
    action: 'onText',
    // img: turnIntoImg.text,
    label: 'Text',
    discription: 'Just start writing with plain text',
    // discriptionImg: turnIntoImg.textDesc,
  },
  {
    value: 'isHeading1',
    action: 'onHeading1',
    // img: turnIntoImg.header1,
    label: 'Heading 1',
    discription: 'Just start writing with plain text',
    // discriptionImg: turnIntoImg.header1Desc,
  },
  {
    value: 'isHeading2',
    action: 'onHeading2',
    // img: turnIntoImg.header2,
    label: 'Heading 2',
    discription: 'Just start writing with plain text',
    // discriptionImg: turnIntoImg.header2Desc,
  },
  {
    value: 'isHeading3',
    action: 'onHeading3',
    // img: turnIntoImg.header3,
    label: 'Heading 3',
    discription: 'Just start writing with plain text',
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
    value: 'isTaskList',
    action: 'onTaskList',
    // img: turnIntoImg.todoList,
    label: 'To-do list',
    discription: 'Just start writing with plain text',
    // discriptionImg: turnIntoImg.todoDesc,
  },
  {
    value: 'isBulletList',
    action: 'onBulletList',
    // img: turnIntoImg.bullitLIst,
    label: 'bulleted list',
    discription: 'Just start writing with plain text',
    // discriptionImg: turnIntoImg.bulletedDesc,
  },
  {
    value: 'isNumberedList',
    action: 'onNumberList',
    // img: turnIntoImg.numbered,
    label: 'Numbered list',
    discription: 'Just start writing with plain text',
    // discriptionImg: turnIntoImg.numberedDesc,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.toggle,
    label: 'Toggle list',
    discription: 'Just start writing with plain text',
    // discriptionImg: turnIntoImg.toggleDesc,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.code,
    label: 'Code',
    discription: 'Just start writing with plain text',
    // discriptionImg: turnIntoImg.codeDesc,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.quote,
    label: 'Quote',
    discription: 'Capture a code snippet',
    // discriptionImg: turnIntoImg.quoteDesc,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.callout,
    label: 'Callout',
    discription: 'Make writing stand out',
    // discriptionImg: turnIntoImg.callOutDesc,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.blockEquation,
    label: 'Block equation',
    discription: 'Display a standalone math equation',
    // discriptionImg: turnIntoImg.mathDesc,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.headdding1Toggle,
    label: 'Toggle heading 1',
    discription: 'Hide content inside a large heading',
    // discriptionImg: turnIntoImg.toggleHeadingDesc1,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.headdding2Toggle,
    label: 'Toggle heading 2',
    discription: 'Hide content inside a meduim heading',
    // discriptionImg: turnIntoImg.toggleHeadingDesc2,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.headdding3Toggle,
    label: 'Toggle heading 3',
    discription: 'Hide content inside a small heading',
    // discriptionImg: turnIntoImg.toggleHeadingDesc3,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.columnList,
    label: '2 columns',
    discription: 'Create 2 columns of blocks',
    // discriptionImg: turnIntoImg.column2,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.columnList,
    label: '3 columns',
    discription: 'Create 3 columns of blocks',
    // discriptionImg: turnIntoImg.column2,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.columnList,
    label: '4 columns',
    discription: 'Create 4 columns of blocks',
    // discriptionImg: turnIntoImg.column2,
  },
  {
    value: 'isBold',
    action: 'onBold',
    // img: turnIntoImg.columnList,
    label: '5 columns',
    discription: 'Create 5 columns of blocks',
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
    value: 'isBold',
    action: 'onBold',
    label: 'Bold',
    icon: Bold,
  },
  {
    value: 'isItalic',
    action: 'onItalic',
    label: 'Italic',
    icon: Italic,
  },
  {
    value: 'isUnderline',
    action: 'onUnderline',
    label: 'Underline',
    icon: Underline,
  },
  {
    value: 'isStrike',
    action: 'onStrike',
    label: 'Strike through',
    icon: Strikethrough,
  },
  {
    value: 'isCode',
    action: 'onCode',
    label: 'Code',
    icon: Code,
  },
  {
    value: 'isCodeBlock',
    action: 'onCodeBlock',
    label: 'CodeBlock',
    icon: Code,
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
    onText,
    onHeading1,
    onHeading2,
    onHeading3,
    onHeading4,
    onHeading5,
    onHeading6,
    onTaskList,
    onBulletList,
    onDetailList,
    onNumberList,
    unSetLink,
    //
    onBold,
    onItalic,
    onStrike,
    onUnderline,
    onCode,
    onCodeBlock,
    onSubscript,
    onSuperscript,
    onAlignLeft,
    onAlignCenter,
    onAlignRight,
    onAlignJustify,
    onChangeColor,
    onClearColor,
    onChangeHighlight,
    onClearHighlight,
    onSetFont,
    onSetFontSize,
    onLink,
  }
}

export const useTextmenuContentTypes = (editor: Editor) => {
  const chainOnFocus = () => editor.chain().focus()

  //FIX: <ContentPickerOptions>
  const options = React.useMemo(() => {
    return [
      {
        type: 'category',
        label: 'Hierarchy',
        id: 'hierarchy',
      },
      {
        icon: 'Pilcrow',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setParagraph().run(),
        id: 'paragraph',
        disabled: () => !editor.can().setParagraph(),
        isActive: () =>
          editor.isActive('paragraph') &&
          !editor.isActive('orderedList') &&
          !editor.isActive('bulletList') &&
          !editor.isActive('taskList'),
        label: 'Paragraph',
        type: 'option',
      },
      {
        icon: 'Heading1',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 1 }).run(),
        id: 'heading1',
        disabled: () => !editor.can().setHeading({ level: 1 }),
        isActive: () => editor.isActive('heading', { level: 1 }),
        label: 'Heading 1',
        type: 'option',
      },
      {
        icon: 'Heading2',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 2 }).run(),
        id: 'heading2',
        disabled: () => !editor.can().setHeading({ level: 2 }),
        isActive: () => editor.isActive('heading', { level: 2 }),
        label: 'Heading 2',
        type: 'option',
      },
      {
        icon: 'Heading3',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 3 }).run(),
        id: 'heading3',
        disabled: () => !editor.can().setHeading({ level: 3 }),
        isActive: () => editor.isActive('heading', { level: 3 }),
        label: 'Heading 3',
        type: 'option',
      },
      {
        icon: 'Heading4',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 4 }).run(),
        id: 'heading4',
        disabled: () => !editor.can().setHeading({ level: 4 }),
        isActive: () => editor.isActive('heading', { level: 4 }),
        label: 'Heading 4',
        type: 'option',
      },

      {
        icon: 'Heading5',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 5 }).run(),
        id: 'heading5',
        disabled: () => !editor.can().setHeading({ level: 5 }),
        isActive: () => editor.isActive('heading', { level: 5 }),
        label: 'Heading 5',
        type: 'option',
      },

      {
        icon: 'Heading6',
        onClick: () => chainOnFocus().lift('taskItem').liftListItem('listItem').setHeading({ level: 3 }).run(),
        id: 'heading6',
        disabled: () => !editor.can().setHeading({ level: 6 }),
        isActive: () => editor.isActive('heading', { level: 6 }),
        label: 'Heading 6',
        type: 'option',
      },

      {
        type: 'category',
        label: 'Lists',
        id: 'lists',
      },
      {
        icon: 'List',
        onClick: () => chainOnFocus().toggleBulletList().run(),
        id: 'bulletList',
        disabled: () => !editor.can().toggleBulletList(),
        isActive: () => editor.isActive('bulletList'),
        label: 'Bullet list',
        type: 'option',
      },
      {
        icon: 'ListOrdered',
        onClick: () => chainOnFocus().toggleOrderedList().run(),
        id: 'orderedList',
        disabled: () => !editor.can().toggleOrderedList(),
        isActive: () => editor.isActive('orderedList'),
        label: 'Numbered list',
        type: 'option',
      },
      {
        icon: 'ListTodo',
        //FIX:
        onClick: () => chainOnFocus().toggleTaskList().run(),
        id: 'todoList',
        disabled: () => !editor.can().toggleTaskList(),
        isActive: () => editor.isActive('taskList'),
        label: 'Todo list',
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
    isText: editor.isActive('text'),
    isHeading1: editor.isActive('heading', { level: 1 }),
    isHeading2: editor.isActive('heading', { level: 2 }),
    isHeading3: editor.isActive('heading', { level: 3 }),
    isHeading4: editor.isActive('heading', { level: 4 }),
    isHeading5: editor.isActive('heading', { level: 5 }),
    isHeading6: editor.isActive('heading', { level: 6 }),
    isCodeBlock: editor.isActive('codeBlock'),
    isBold: editor.isActive('bold'),
    isItalic: editor.isActive('italic'),
    isStrike: editor.isActive('strike'),
    isUnderline: editor.isActive('underline'),
    isCode: editor.isActive('code'),
    isLink: editor.isActive('link'),

    isTaskList: editor.isActive('taskList'),
    isBulletList: editor.isActive('bulletList'),
    isDetailList: editor.isActive('detailList'),
    isNumberedList: editor.isActive('orderedList'),
    //
    isSubscript: editor.isActive('subscript'),
    isSuperscript: editor.isActive('superscript'),
    isAlignLeft: editor.isActive({ textAlign: 'left' }),
    isAlignCenter: editor.isActive({ textAlign: 'center' }),
    isAlignRight: editor.isActive({ textAlign: 'right' }),
    isAlignJustify: editor.isActive({ textAlign: 'justify' }),
    currentColor: editor.getAttributes('textStyle')?.color || undefined,
    currentHighlight: editor.getAttributes('highlight')?.color || undefined,
    currentFont: editor.getAttributes('textStyle')?.fontFamily || undefined,
    currentSize: editor.getAttributes('textStyle')?.fontSize || undefined,
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
