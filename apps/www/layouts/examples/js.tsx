import { Button } from '@gentleduck/registry-ui-duckui/button'
import { SonnerUpload } from '@gentleduck/registry-ui-duckui/sonner'
import React from 'react'
import { toast } from 'sonner'

export function SONNER_V2() {
  const controllerRef = React.useRef(new AbortController())
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const progressRef = React.useRef(0)

  const updateToast = (progress: number) => {
    toast(
      <SonnerUpload
        attachments={2}
        onCancel={handleCancel}
        progress={progress}
        remainingTime={Math.max(0, 3000 - progress * 30)}
      />,
      { dismissible: false, id: 'sonner' },
    )
  }

  const startProgress = () => {
    progressRef.current = 0
    updateToast(0)

    intervalRef.current = setInterval(() => {
      const randomStep = Math.floor(Math.random() * 11) + 5 // 5–15%
      progressRef.current = Math.min(progressRef.current + randomStep, 100)
      updateToast(progressRef.current)

      if (progressRef.current >= 100) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
      }
    }, 400)
  }

  const handleCancel = () => {
    toast.dismiss('sonner')
    controllerRef.current.abort()
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleClick = () => {
    handleCancel() // Ensure no previous interval is running
    controllerRef.current = new AbortController()
    startProgress()
  }

  return (
    <Button border="default" onClick={handleClick} size="sm" variant="outline">
      Show Upload Toast
    </Button>
  )
}

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gentleduck/registry-ui-duckui/input-otp'

export function InputOTPDemo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
