import * as React from 'react'
import { Primitive } from '../primitive-elements'

const INPUT_OTP_GROUP_NAME = 'InputOTPGroup'

type InputOTPGroupElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

interface IInputOTPGroupProps extends PrimitiveDivProps {}

const InputOTPGroup = React.forwardRef<InputOTPGroupElement, IInputOTPGroupProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} role="group" data-slot="input-otp-group" />
})

InputOTPGroup.displayName = INPUT_OTP_GROUP_NAME

export type { IInputOTPGroupProps }
export { INPUT_OTP_GROUP_NAME, InputOTPGroup }
