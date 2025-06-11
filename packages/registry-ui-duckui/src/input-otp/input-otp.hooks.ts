import React from 'react'
import { OTPInputContext } from './input-otp'

export function useOTPInputContext() {
  const context = React.useContext(OTPInputContext)
  if (context === null) {
    throw new Error('useOTPInputContext must be used within a OTPInputProvider')
  }
  return context
}
export function useInputOTPInit(value?: string, onValueChange?: (value: string) => void) {
  const inputsRef = React.useRef<HTMLInputElement[]>([])
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const html = document.documentElement
    const inputs = Array.from(
      wrapperRef?.current?.querySelectorAll('input[duck-input-otp-slot]') as never as HTMLInputElement[],
    )
    const valueChunks = value?.split('')
    console.log(valueChunks)

    inputsRef.current = inputs
    inputsRef.current[0]?.focus()

    for (let i = 0; i < inputsRef.current.length; i++) {
      const item = inputsRef.current[i] as HTMLInputElement
      item.value = valueChunks?.[i] ?? ''
      item.setAttribute('aria-label', `Digit ${i + 1}`) // For screen reader clarity

      item.addEventListener('keydown', (e) => {
        if (
          e.key === 'Backspace' ||
          (e.key === 'ArrowLeft' && html.getAttribute('dir') === 'ltr') ||
          (e.key === 'ArrowRight' && html.getAttribute('dir') === 'rtl')
        ) {
          setTimeout(() => {
            inputs[i - 1]?.focus()
          }, 0)
        }

        if (
          (e.key === 'ArrowLeft' && html.getAttribute('dir') === 'rtl') ||
          (e.key === 'ArrowRight' && (html.getAttribute('dir') === 'ltr' || html.getAttribute('dir') === null))
        ) {
          setTimeout(() => {
            inputs[i + 1]?.focus()
          }, 0)
        }

        if (
          e.metaKey ||
          e.ctrlKey ||
          e.altKey ||
          ['ArrowLeft', 'ArrowRight', 'Backspace', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown'].includes(e.key) ||
          !/^[\w\d\p{P}\p{S}]$/u.test(e.key)
        ) {
          return
        }

        item.value = e.key
        inputs[i + 1]?.focus()
        if (onValueChange) onValueChange(inputs.map((input) => input.value).join(''))
      })
    }
  }, [inputsRef])
  return { inputsRef, wrapperRef }
}
