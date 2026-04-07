'use client'

import {
  InputOTPGroup,
  InputOTPSeparator,
  MotionInputOTP,
  MotionInputOTPSlot,
} from '@gentleduck/registry-ui/input-otp'

export default function Demo() {
  return (
    <MotionInputOTP maxLength={6}>
      <InputOTPGroup>
        <MotionInputOTPSlot index={0} />
        <MotionInputOTPSlot index={1} />
        <MotionInputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <MotionInputOTPSlot index={3} />
        <MotionInputOTPSlot index={4} />
        <MotionInputOTPSlot index={5} />
      </InputOTPGroup>
    </MotionInputOTP>
  )
}
