import * as React from 'react'
import { Primitive } from '../primitive-elements'

const INPUT_OTP_SLOT_NAME = 'InputOTPSlot'

type InputOTPSlotElement = React.ComponentRef<typeof Primitive.input>
type PrimitiveInputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>

interface InputOTPSlotProps extends PrimitiveInputProps {}

const InputOTPSlot = React.forwardRef<InputOTPSlotElement, InputOTPSlotProps>((props, forwardedRef) => {
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

export type { InputOTPSlotProps }
export { INPUT_OTP_SLOT_NAME, InputOTPSlot }
