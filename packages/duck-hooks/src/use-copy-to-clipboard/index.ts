'use client'

import * as React from 'react'
import type { IUseCopyToClipboard } from './use-copy-to-clipboard.types'

export type { IUseCopyToClipboard } from './use-copy-to-clipboard.types'

/**
 * Copy text to the clipboard with a transient `isCopied` flag that
 * auto-resets after `timeout` ms.
 */
export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: IUseCopyToClipboard.IOptions = {}): IUseCopyToClipboard.IReturn {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(
    (value: string): void => {
      if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
        return
      }

      if (!value) return

      navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true)
        onCopy?.()

        setTimeout(() => {
          setIsCopied(false)
        }, timeout)
      }, console.error)
    },
    [timeout, onCopy],
  )

  return { copyToClipboard, isCopied }
}
