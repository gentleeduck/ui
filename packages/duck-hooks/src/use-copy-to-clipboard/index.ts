'use client'

import * as React from 'react'

/** Options for {@link useCopyToClipboard}. */
export interface IUseCopyToClipboardOptions {
  /** Time in ms before `isCopied` resets to `false`. Defaults to `2000`. */
  timeout?: number
  /** Called immediately after a successful copy. */
  onCopy?: () => void
}

/** Return value of {@link useCopyToClipboard}. */
export interface IUseCopyToClipboardReturn {
  /** Copy `value` to the clipboard. No-op when value is empty or clipboard API is unavailable. */
  copyToClipboard: (value: string) => void
  /** `true` for `timeout` ms after a successful copy, then resets. */
  isCopied: boolean
}

/**
 * Copy text to the clipboard and track the copied state.
 *
 * Returns an object with `copyToClipboard` and a transient `isCopied` flag
 * that auto-resets after the configured timeout.
 */
export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
}: IUseCopyToClipboardOptions = {}): IUseCopyToClipboardReturn {
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
