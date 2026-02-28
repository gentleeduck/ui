import { Group } from './types'

export const GROUPS: Group[] = [
  {
    commands: [
      {
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run()
        },
        aliases: ['h1'],
        description: 'High priority section title',
        iconName: 'Heading1',
        label: 'Heading 1',
        name: 'heading1',
      },
      {
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run()
        },
        aliases: ['h2'],
        description: 'Medium priority section title',
        iconName: 'Heading2',
        label: 'Heading 2',
        name: 'heading2',
      },
      {
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run()
        },
        aliases: ['h3'],
        description: 'Low priority section title',
        iconName: 'Heading3',
        label: 'Heading 3',
        name: 'heading3',
      },
      {
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run()
        },
        aliases: ['ul'],
        description: 'Unordered list of items',
        iconName: 'List',
        label: 'Bullet List',
        name: 'bulletList',
      },
      {
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run()
        },
        aliases: ['ol'],
        description: 'Ordered list of items',
        iconName: 'ListOrdered',
        label: 'Numbered List',
        name: 'numberedList',
      },
      {
        action: (editor) => {
          editor.chain().focus().toggleTaskList().run()
        },
        aliases: ['todo'],
        description: 'Task list with todo items',
        iconName: 'ListTodo',
        label: 'Task List',
        name: 'taskList',
      },
      {
        action: (editor) => {
          editor.chain().focus().setBlockquote().run()
        },
        description: 'Element for quoting',
        iconName: 'Quote',
        label: 'Blockquote',
        name: 'blockquote',
      },
      {
        action: (editor) => {
          editor.chain().focus().setCodeBlock().run()
        },
        description: 'Code block with syntax highlighting',
        iconName: 'SquareCode',
        label: 'Code Block',
        name: 'codeBlock',
        shouldBeHidden: (editor) => editor.isActive('columns'),
      },
    ],
    name: 'format',
    title: 'Format',
  },
  {
    commands: [
      {
        action: (editor) => {
          editor.chain().focus().insertTable({ cols: 3, rows: 3, withHeaderRow: false }).run()
        },
        description: 'Insert a table',
        iconName: 'Table',
        label: 'Table',
        name: 'table',
        shouldBeHidden: (editor) => editor.isActive('columns'),
      },
      {
        action: (editor) => {
          editor.chain().focus().setImageUpload().run()
        },
        aliases: ['img'],
        description: 'Insert an image',
        iconName: 'Image',
        label: 'Image',
        name: 'image',
      },
      {
        action: (editor) => {
          editor
            .chain()
            .focus()
            .setColumns()
            .focus(editor.state.selection.head - 1)
            .run()
        },
        aliases: ['cols'],
        description: 'Add two column content',
        iconName: 'Columns',
        label: 'Columns',
        name: 'columns',
        shouldBeHidden: (editor) => editor.isActive('columns'),
      },
      {
        action: (editor) => {
          editor.chain().focus().setHorizontalRule().run()
        },
        aliases: ['hr'],
        description: 'Insert a horizontal divider',
        iconName: 'Minus',
        label: 'Horizontal Rule',
        name: 'horizontalRule',
      },
      {
        action: (editor) => {
          editor.chain().focus().insertTableOfContents().run()
        },
        aliases: ['outline'],
        description: 'Insert a table of contents',
        iconName: 'Book',
        label: 'Table of Contents',
        name: 'toc',
        shouldBeHidden: (editor) => editor.isActive('columns'),
      },
    ],
    name: 'insert',
    title: 'Insert',
  },
]
