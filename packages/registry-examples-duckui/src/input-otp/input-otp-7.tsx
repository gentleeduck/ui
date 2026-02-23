import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gentleduck/registry-ui-duckui/input-otp'

export default function InputOtpRtlDemo() {
  return (
    <div dir="rtl">
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
