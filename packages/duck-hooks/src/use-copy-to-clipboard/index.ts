'use client'

import * as React from 'react'
import type { IUseCopyToClipboard } from './use-copy-to-clipboard.types'

export type { IUseCopyToClipboard } from './use-copy-to-clipboard.types'

/**
 * Copy text to the clipboard. Returns `{ copyToClipboard, isCopied }`.
 *
 * Failure mode: when the Clipboard API rejects (permission denied, insecure
 * context, no user gesture) the rejection is surfaced via the optional
 * `onError` callback. Without `onError` the rejection is silently swallowed.
 */
export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
  onError,
}: IUseCopyToClipboard.IOptions = {}): IUseCopyToClipboard.IReturn {
  const [isCopied, setIsCopied] = React.useState(false)

  // Track the reset timer so rapid double-copies don't race and so we can
  // cancel it on unmount to avoid setState-after-unmount.
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearResetTimer = React.useCallback(() => {
    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }
  }, [])

  const copyToClipboard = React.useCallback(
    (value: string): void => {
      if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
        return
      }

      if (!value) return

      navigator.clipboard.writeText(value).then(
        () => {
          setIsCopied(true)
          onCopy?.()
          clearResetTimer()
          resetTimerRef.current = setTimeout(() => {
            resetTimerRef.current = null
            setIsCopied(false)
          }, timeout)
        },
        (err: unknown) => {
          onError?.(err)
        },
      )
    },
    [timeout, onCopy, onError, clearResetTimer],
  )

  // Cancel any pending reset on unmount.
  React.useEffect(() => {
    return () => {
      clearResetTimer()
    }
  }, [clearResetTimer])

  return { copyToClipboard, isCopied }
}
