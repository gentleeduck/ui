import { BubbleMenu, Editor, EditorContent, useEditor } from '@tiptap/react'

import { initialContent, NotionEditorProps } from './NotionEditor.types'

import { ScrollArea } from '@/components/ui'
import { cn } from '@/utils'
import { NotionEditorToolbarTextMenu } from './NotionEditorToolbarTextMenu'
import ExtensionKit from './extensions/extension-kit'
import { ContentItemMenu } from './NotionEditorContentItemMenu/NotionEditorContentItemMenu'

export const NotionEditor = ({ description, onChange, className }: NotionEditorProps) => {
  const editor = useEditor({
    extensions: [
      ...ExtensionKit({
        // provider,
      }),
    ],
    editorProps: {
      attributes: {
        autocomplete: 'on',
        autocorrect: 'on',
        autocapitalize: 'on',
        class: cn(className, 'min-h-full border borer-solid border-border notion'),
      },
    },
    autofocus: true,
    onCreate: ({ editor }) => {
      // provider?.on('synced', () => {
      // if (editor.isEmpty) {
      // editor.commands.setContent(initialContent)
      //   }
      // })
    },
    // content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
  })

  if (!editor) {
    return null
  }

  return (
    <ScrollArea className={(cn('bg-green-500 grid h-[400px] mx-auto w-full'), className)}>
      <NotionEditorToolbarTextMenu editor={editor} />
      <EditorContent editor={editor} />
    </ScrollArea>
  )
}
