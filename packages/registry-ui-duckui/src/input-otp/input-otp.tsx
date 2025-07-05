'use client'

import * as React from 'react'
import { Dot } from 'lucide-react'

import { cn } from '@gentleduck/libs/cn'
import { useInputOTPInit } from './input-otp.hooks'
import { OTPInputContextType } from './input-otp.types'

export const OTPInputContext = React.createContext<OTPInputContextType | null>(null)

function InputOTP({
  className,
  children,
  value,
  onValueChange,
  ref,
  'aria-label': ariaLabel = 'One-time password input',
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  value?: string
  onValueChange?: (value: string) => void
}) {
  const { inputsRef, wrapperRef } = useInputOTPInit(value, onValueChange)

  return (
    <OTPInputContext.Provider
      value={{
        value,
        wrapperRef,
        inputsRef,
      }}>
      <div
        ref={wrapperRef}
        className={cn('flex items-center gap-2 disabled:cursor-not-allowed has-[:disabled]:opacity-50', className)}
        role="group"
        aria-label={ariaLabel}
        {...props}
        duck-input-otp="">
        {children}
      </div>
    </OTPInputContext.Provider>
  )
}

const InputOTPGroup = ({ className, ref, ...props }: React.ComponentPropsWithRef<'div'>) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center', className)}
      role="group"
      aria-label="OTP group"
      {...props}
      duck-input-otp-group=""
    />
  )
}

const InputOTPSlot = ({ className, ref, ...props }: React.ComponentPropsWithRef<'input'>) => {
  return (
    <input
      ref={ref}
      className={cn(
        'relative h-10 w-10 border-input border-y border-r text-center text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className,
      )}
      aria-required="true"
      aria-invalid="false"
      maxLength={1}
      duck-input-otp-slot=""
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
    <div ref={ref} role="presentation" aria-hidden="true" {...props} duck-input-otp-separator="">
      {customIndicator ? customIndicator : <Dot />}
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
