import * as React from 'react'
import type { IDirection } from '../direction'
import { useDirection } from '../direction'
import { useComposedRefs } from '../libs/compose-ref'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import type { IInputOTP } from './input-otp.types'

const INPUT_OTP_NAME = 'InputOTP'

export const REGEXP_ONLY_DIGITS_AND_CHARS = /^.$/
export const REGEXP_ONLY_DIGITS = /^[0-9]$/

const [createInputOTPContext, createInputOTPScope] = createContextScope(INPUT_OTP_NAME)

const [InputOTPProvider, useInputOTPContext] = createInputOTPContext<IInputOTP.IContext>(INPUT_OTP_NAME)

type InputOTPElement = React.ComponentRef<typeof Primitive.div>

function useInputOTPBehavior({
  value,
  onValueChange,
  pattern,
  direction,
  inputsRef,
  wrapperRef,
  maxLength,
}: {
  value?: string | undefined
  onValueChange?: ((value: string) => void) | undefined
  pattern: RegExp
  direction: IDirection.Kind
  inputsRef: React.RefObject<HTMLInputElement[]>
  wrapperRef: React.RefObject<HTMLDivElement | null>
  maxLength?: number | undefined
}) {
  React.useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const allInputs = Array.from(wrapper.querySelectorAll('input[data-input-otp-slot]')) as HTMLInputElement[]
    const inputs = typeof maxLength === 'number' ? allInputs.slice(0, Math.max(0, maxLength)) : allInputs
    const valueChunks = value?.split('') ?? []
    inputsRef.current = inputs

    const cleanup: Array<() => void> = []

    const emit = () => onValueChange?.(inputs.map((input) => input.value).join(''))

    const fillFrom = (startIndex: number, text: string) => {
      const chars = Array.from(text).filter((char) => pattern.test(char))
      if (chars.length === 0) return

      let j = 0
      for (let k = startIndex; k < inputs.length && j < chars.length; k++) {
        const input = inputs[k]
        const char = chars[j]
        if (input === undefined || char === undefined) continue
        input.value = char
        j++
      }

      const nextFocus = Math.min(startIndex + j, inputs.length - 1)
      inputs[nextFocus]?.focus()
      emit()
    }

    for (let i = 0; i < inputs.length; i++) {
      const item = inputs[i]
      if (!item) continue
      item.value = valueChunks[i] ?? ''
      item.setAttribute('aria-label', `Digit ${i + 1}`)

      const onKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === 'Backspace' ||
          (e.key === 'ArrowLeft' && direction === 'ltr') ||
          (e.key === 'ArrowRight' && direction === 'rtl')
        ) {
          setTimeout(() => inputs[i - 1]?.focus(), 0)
        }

        if ((e.key === 'ArrowLeft' && direction === 'rtl') || (e.key === 'ArrowRight' && direction === 'ltr')) {
          setTimeout(() => inputs[i + 1]?.focus(), 0)
        }

        if (
          e.metaKey ||
          e.ctrlKey ||
          e.altKey ||
          ['ArrowLeft', 'ArrowRight', 'Backspace', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown'].includes(e.key)
        ) {
          return
        }

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
        fillFrom(i, text)
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
  }, [value, onValueChange, pattern, direction, maxLength, inputsRef, wrapperRef])
}

const InputOTP = React.forwardRef<InputOTPElement, IInputOTP.IProps>(
  (props: IInputOTP.IScoped<IInputOTP.IProps>, forwardedRef) => {
    const {
      __scopeInputOTP,
      value,
      onValueChange,
      pattern = REGEXP_ONLY_DIGITS_AND_CHARS,
      dir,
      maxLength,
      children,
      'aria-label': ariaLabel = 'otp-one-time-password',
      ...inputOTPProps
    } = props
    const direction = useDirection(dir)
    const inputsRef = React.useRef<HTMLInputElement[]>([])
    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const composedRef = useComposedRefs(forwardedRef, wrapperRef)

    useInputOTPBehavior({
      value,
      onValueChange,
      pattern,
      direction,
      inputsRef,
      wrapperRef,
      maxLength,
    })

    return (
      <InputOTPProvider
        scope={__scopeInputOTP}
        value={value}
        inputsRef={inputsRef}
        wrapperRef={wrapperRef}
        dir={direction}
        maxLength={maxLength}>
        <Primitive.div
          {...inputOTPProps}
          ref={composedRef}
          role="region"
          dir={direction}
          aria-label={ariaLabel}
          data-slot="input-otp">
          {children}
        </Primitive.div>
      </InputOTPProvider>
    )
  },
)

InputOTP.displayName = INPUT_OTP_NAME

export { createInputOTPScope, INPUT_OTP_NAME, InputOTP, InputOTPProvider, useInputOTPContext }
