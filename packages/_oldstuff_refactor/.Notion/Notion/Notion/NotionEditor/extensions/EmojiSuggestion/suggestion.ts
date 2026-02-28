import { Editor } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance } from 'tippy.js'

import EmojiList from './components/EmojiList'

export const emojiSuggestion = {

  allowSpaces: false,
  items: ({ editor, query }: { editor: Editor; query: string }) =>
    editor.storage.emoji.emojis
      .filter(
        ({ shortcodes, tags }: { shortcodes: string[]; tags: string[] }) =>
          shortcodes.find((shortcode) => shortcode.startsWith(query.toLowerCase())) ||
          tags.find((tag) => tag.startsWith(query.toLowerCase())),
      )
      .slice(0, 250),

  render: () => {
    let component: ReactRenderer
    let popup: Instance

    return {

      onExit() {
        popup[0].destroy()
        component.destroy()
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          component.destroy()

          return true
        }

        return component.ref?.onKeyDown(props)
      },
      onStart: (props: SuggestionProps<any>) => {
        component = new ReactRenderer(EmojiList, {
          editor: props.editor,
          props,
        })

        popup = tippy('body', {
          appendTo: () => document.body,
          content: component.element,
          getReferenceClientRect: props.clientRect,
          interactive: true,
          placement: 'bottom-start',
          showOnCreate: true,
          trigger: 'manual',
        })
      },

      onUpdate(props: SuggestionProps<any>) {
        component.updateProps(props)

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },
    }
  },
}

export default emojiSuggestion
