import { BubbleMenu, Editor, EditorContent, useEditor } from '@tiptap/react'
import { ScrollArea } from '@/components/ui'
import { cn } from '@/utils'
import ExtensionKit from './extensions/extension-kit'
import { initialContent, NotionEditorProps } from './NotionEditor.types'
import { ContentItemMenu } from './NotionEditorContentItemMenu/NotionEditorContentItemMenu'
import { NotionEditorToolbarTextMenu } from './NotionEditorToolbarTextMenu'

export const NotionEditor = ({ description, onChange, className }: NotionEditorProps) => {
  const editor = useEditor({
    autofocus: true,
    editorProps: {
      attributes: {
        autocapitalize: 'on',
        autocomplete: 'on',
        autocorrect: 'on',
        class: cn(className, 'min-h-full border borer-solid border-border notion'),
      },
    },
    extensions: [
      ...ExtensionKit({
        // provider,
      }),
    ],
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
