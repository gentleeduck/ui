'use client'

import { MotionAlert, MotionAlertDescription, MotionAlertTitle } from '@gentleduck/registry-ui/alert'
import { AlertCircle, Terminal } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <MotionAlert>
        <Terminal aria-hidden="true" className="h-4 w-4" />
        <MotionAlertTitle>Heads up!</MotionAlertTitle>
        <MotionAlertDescription>You can add components to your app using the cli.</MotionAlertDescription>
      </MotionAlert>
      <MotionAlert variant="destructive">
        <AlertCircle aria-hidden="true" className="h-4 w-4" />
        <MotionAlertTitle>Error</MotionAlertTitle>
        <MotionAlertDescription>Your session has expired. Please log in again.</MotionAlertDescription>
      </MotionAlert>
    </div>
  )
}
