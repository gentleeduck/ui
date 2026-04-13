'use client'

import * as React from 'react'

export interface IUseCopyToClipboardOptions {
  timeout?: number
  onCopy?: () => void
}

export function useCopyToClipboard({ timeout = 2000, onCopy }: IUseCopyToClipboardOptions = {}) {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
      return
    }

    if (!value) return

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      if (onCopy) {
        onCopy()
      }

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    }, console.error)
  }

  return { copyToClipboard, isCopied }
}
