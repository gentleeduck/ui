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
  pattern: RegExp = /^[\w\d\p{P}\p{S}]$/u, // default if not provided
) {
  const inputsRef = React.useRef<HTMLInputElement[]>([])
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const html = document.documentElement
    const inputs = Array.from(
      wrapperRef?.current?.querySelectorAll('input[duck-input-otp-slot]') as never as HTMLInputElement[],
    )
    const valueChunks = value?.split('')
    inputsRef.current = inputs

    for (let i = 0; i < inputsRef.current.length; i++) {
      const item = inputsRef.current[i] as HTMLInputElement
      item.value = valueChunks?.[i] ?? ''
      item.setAttribute('aria-label', `Digit ${i + 1}`)

      item.addEventListener('keydown', (e) => {
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
        onValueChange?.(inputs.map((input) => input.value).join(''))
      })
    }
  }, [inputsRef, pattern])

  return { inputsRef, wrapperRef }
}
