import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { IInputOTP } from './input-otp.types'

const INPUT_OTP_GROUP_NAME = 'InputOTPGroup'

type InputOTPGroupElement = React.ComponentRef<typeof Primitive.div>

const InputOTPGroup = React.forwardRef<InputOTPGroupElement, IInputOTP.IGroupProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} role="group" data-slot="input-otp-group" />
})

InputOTPGroup.displayName = INPUT_OTP_GROUP_NAME

export { INPUT_OTP_GROUP_NAME, InputOTPGroup }
