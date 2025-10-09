'use client'

import { cn } from '@gentleduck/libs/cn'
import { Dot } from 'lucide-react'
import * as React from 'react'
import { useInputOTPInit } from './input-otp.hooks'

export const REGEXP_ONLY_DIGITS_AND_CHARS = /^[\w\d\p{P}\p{S}]$/u
export const REGEXP_ONLY_DIGITS = /^[0-9]$/
export const OTPInputContext = React.createContext<{
  value?: string
  wrapperRef: React.RefObject<HTMLDivElement | null>
  inputsRef: React.RefObject<HTMLInputElement[]>
} | null>(null)

function InputOTP({
  className,
  children,
  value,
  onValueChange,
  pattern,
  ref,
  'aria-label': ariaLabel = 'otp-one-time-password',
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'pattern'> & {
  value?: string
  onValueChange?: (value: string) => void
  pattern?: RegExp
}) {
  const { inputsRef, wrapperRef } = useInputOTPInit(value, onValueChange, pattern)

  return (
    <OTPInputContext.Provider
      value={{
        inputsRef,
        value,
        wrapperRef,
      }}>
      <div
        aria-label={ariaLabel}
        className={cn('flex items-center gap-2 disabled:cursor-not-allowed has-[:disabled]:opacity-50', className)}
        ref={wrapperRef}
        role="region"
        {...props}
        data-slot="input-otp"
        duck-input-slot="">
        {children}
      </div>
    </OTPInputContext.Provider>
  )
}

const InputOTPGroup = ({ className, ref, ...props }: React.ComponentPropsWithRef<'div'>) => {
  return (
    <div
      aria-label="otp-group"
      className={cn('flex items-center', className)}
      ref={ref}
      role="group"
      {...props}
      data-slot="input-otp-group"
      duck-input-slot=""
    />
  )
}

const InputOTPSlot = ({ className, ref, ...props }: React.ComponentPropsWithRef<'input'>) => {
  return (
    <input
      aria-invalid="false"
      aria-required="true"
      className={cn(
        'relative h-10 w-10 border-input border-y border-r text-center text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md focus:shadow-none focus:outline-none focus:ring-ring focus:ring-offset-2',
        className,
      )}
      data-slot="input-otp-slot"
      duck-input-slot=""
      maxLength={1}
      ref={ref}
      {...props}
    />
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
    <div aria-hidden="true" ref={ref} role="presentation" {...props} data-slot="input-otp-separator" duck-input-slot="">
      {customIndicator ? customIndicator : <Dot />}
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
