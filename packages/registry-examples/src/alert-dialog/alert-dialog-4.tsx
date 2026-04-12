'use client'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  MotionAlertDialog,
  MotionAlertDialogContent,
} from '@gentleduck/registry-ui/alert-dialog'
import { MotionButton } from '@gentleduck/registry-ui/button'

export default function Demo() {
  return (
    <MotionAlertDialog>
      <AlertDialogTrigger asChild>
        <MotionButton variant="outline">Open</MotionButton>
      </AlertDialogTrigger>
      <MotionAlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone This will permanently delete your account and remove your data from our servers
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <MotionButton variant="outline">Cancel</MotionButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <MotionButton>Continue</MotionButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </MotionAlertDialogContent>
    </MotionAlertDialog>
  )
}
