import React from 'react'
import { OTPInputContext } from './input-otp'

export function useOTPInputContext() {
  const context = React.useContext(OTPInputContext)
  if (context === null) {
    throw new Error('useOTPInputContext must be used within a OTPInputProvider')
  }
  return context
}

export function useInputOTPInit(
  value?: string,
  onValueChange?: (value: string) => void,
  pattern: RegExp = /^[\w\d\p{P}\p{S}]$/u,
) {
  const inputsRef = React.useRef<HTMLInputElement[]>([])
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const html = document.documentElement
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const inputs = Array.from(wrapper.querySelectorAll('input[duck-input-otp-slot]')) as HTMLInputElement[]
    const valueChunks = value?.split('') ?? []
    inputsRef.current = inputs

    const cleanup: Array<() => void> = []

    const emit = () => onValueChange?.(inputs.map((input) => input.value).join(''))

    const fillFrom = (startIndex: number, text: string) => {
      const chars = Array.from(text).filter((c) => pattern.test(c))
      if (chars.length === 0) return

      let j = 0
      for (let k = startIndex; k < inputs.length && j < chars.length; k++) {
        inputs[k]!.value = chars[j]!
        j++
      }

      const nextFocus = Math.min(startIndex + j, inputs.length - 1)
      inputs[nextFocus]?.focus()
      emit()
    }

    for (let i = 0; i < inputs.length; i++) {
      const item = inputs[i]!
      item.value = valueChunks[i] ?? ''
      item.setAttribute('aria-label', `Digit ${i + 1}`)

      const onKeyDown = (e: KeyboardEvent) => {
        // navigation keys
        if (
          e.key === 'Backspace' ||
          (e.key === 'ArrowLeft' && html.getAttribute('dir') === 'ltr') ||
          (e.key === 'ArrowRight' && html.getAttribute('dir') === 'rtl')
        ) {
          setTimeout(() => inputs[i - 1]?.focus(), 0)
        }

        if (
          (e.key === 'ArrowLeft' && html.getAttribute('dir') === 'rtl') ||
          (e.key === 'ArrowRight' && (html.getAttribute('dir') === 'ltr' || html.getAttribute('dir') === null))
        ) {
          setTimeout(() => inputs[i + 1]?.focus(), 0)
        }

        // skip special keys
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.altKey ||
          ['ArrowLeft', 'ArrowRight', 'Backspace', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown'].includes(e.key)
        ) {
          return
        }

        // validate input with pattern
        if (!pattern.test(e.key)) {
          e.preventDefault()
          return
        }

        item.value = e.key
        setTimeout(() => inputs[i + 1]?.focus(), 0)
        emit()
      }

      const onPaste = (e: ClipboardEvent) => {
        const text = e.clipboardData?.getData('text') ?? ''
        if (!text) return
        e.preventDefault()
        fillFrom(i, text) // fills until end then stops
      }

      item.addEventListener('keydown', onKeyDown)
      item.addEventListener('paste', onPaste)

      cleanup.push(() => {
        item.removeEventListener('keydown', onKeyDown)
        item.removeEventListener('paste', onPaste)
      })
    }

    return () => {
      for (const fn of cleanup) fn()
    }
  }, [value, onValueChange, pattern])

  return { inputsRef, wrapperRef }
}
