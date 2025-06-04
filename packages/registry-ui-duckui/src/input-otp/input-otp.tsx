'use client'

import * as React from 'react'
import { Dot } from 'lucide-react'

import { cn } from '@gentleduck/libs/cn'

export interface OTPInputContextType {}
const OTPInputContext = React.createContext<OTPInputContextType | null>(null)

export function useOTPInputContext() {
  const context = React.useContext(OTPInputContext)
  if (context === null) {
    throw new Error('useOTPInputContext must be used within a OTPInputProvider')
  }
  return context
}

function InputOTP({
  className,
  children,
  value,
  onValueChange,
  ref,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  value?: string
  onValueChange?: (value: string) => void
}) {
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
          !/^[\w\d\p{P}\p{S}]$/u.test(e.key) // optional: restrict to desired character set
        ) {
          return
        }

        item.value = e.key
        inputs[i + 1]?.focus()
        if (onValueChange) onValueChange(inputs.map((input) => input.value).join(''))
      })
    }

    console.log(inputs)
  }, [inputsRef])

  return (
    <OTPInputContext.Provider value={{}}>
      <div
        ref={wrapperRef}
        className={cn('flex items-center gap-2 has-[:disabled]:opacity-50 disabled:cursor-not-allowed', className)}
        {...props}
        duck-input-otp="">
        {children}
      </div>
    </OTPInputContext.Provider>
  )
}

const InputOTPGroup = ({ className, ref, ...props }: React.ComponentPropsWithRef<'div'>) => {
  return <div ref={ref} className={cn('flex items-center', className)} {...props} duck-input-otp-group="" />
}

const InputOTPSlot = ({ className, ref, ...props }: React.ComponentPropsWithRef<'input'>) => {
  return (
    <input
      ref={ref}
      className={cn(
        'relative text-center h-10 w-10 border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        // isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className,
      )}
      {...props}
      maxLength={1}
      duck-input-otp-slot=""
    />
    // {
    //   // hasFakeCaret && (
    //   //         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    //   //           <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
    //   //         </div>
    //   //       )
    // }
  )
}

const InputOTPSeparator = ({
  ref,
  customIndicator,
  ...props
}: React.ComponentPropsWithRef<'div'> & {
  customIndicator?: React.ReactNode
}) => {
  return (
    <div ref={ref} role="separator" {...props} duck-input-otp-separator="">
      {customIndicator ? customIndicator : <Dot />}
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
