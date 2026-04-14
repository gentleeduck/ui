import * as React from 'react'
import type { IUseJsonEditorHotkeysOptions } from './json-editor.types'

export function useJsonEditorHotkeys(options: IUseJsonEditorHotkeysOptions) {
  return React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!options.enabled) return

      if (event.key === 'Escape') {
        event.preventDefault()
        options.onEscape()
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        options.onSave()
      }
    },
    [options],
  )
}
