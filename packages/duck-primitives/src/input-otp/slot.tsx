import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { IInputOTP } from './input-otp.types'

const INPUT_OTP_SLOT_NAME = 'InputOTPSlot'

type InputOTPSlotElement = React.ComponentRef<typeof Primitive.input>

const InputOTPSlot = React.forwardRef<InputOTPSlotElement, IInputOTP.ISlotProps>((props, forwardedRef) => {
  const { maxLength = 1, ...slotProps } = props
  return (
    <Primitive.input
      {...slotProps}
      ref={forwardedRef}
      maxLength={maxLength}
      data-slot="input-otp-slot"
      data-input-otp-slot=""
    />
  )
})

InputOTPSlot.displayName = INPUT_OTP_SLOT_NAME

export { INPUT_OTP_SLOT_NAME, InputOTPSlot }
