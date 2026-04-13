import * as React from 'react'
import { Primitive } from '../primitive-elements'

const INPUT_OTP_SEPARATOR_NAME = 'InputOTPSeparator'

type InputOTPSeparatorElement = React.ComponentRef<typeof Primitive.div>
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

interface IInputOTPSeparatorProps extends PrimitiveDivProps {
  customIndicator?: React.ReactNode
}

const InputOTPSeparator = React.forwardRef<InputOTPSeparatorElement, IInputOTPSeparatorProps>((props, forwardedRef) => {
  const { customIndicator, children, ...separatorProps } = props
  return (
    <Primitive.div
      {...separatorProps}
      ref={forwardedRef}
      role="presentation"
      aria-hidden="true"
      data-slot="input-otp-separator">
      {customIndicator ?? children}
    </Primitive.div>
  )
})

InputOTPSeparator.displayName = INPUT_OTP_SEPARATOR_NAME

export type { IInputOTPSeparatorProps }
export { INPUT_OTP_SEPARATOR_NAME, InputOTPSeparator }
