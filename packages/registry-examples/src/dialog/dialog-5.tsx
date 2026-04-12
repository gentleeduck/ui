'use client'

import { Button, MotionButton } from '@gentleduck/registry-ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  MotionDialog,
  MotionDialogContent,
} from '@gentleduck/registry-ui/dialog'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <MotionDialog>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <MotionButton variant={'outline'}>Open Dialog</MotionButton>
        </DialogTrigger>
        <MotionDialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-5">Name</Label>
              <Input defaultValue="Pedro Duarte" id="name-5" name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-5">Username</Label>
              <Input defaultValue="@peduarte" id="username-5" name="username" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <MotionButton variant={'outline'}>Cancel</MotionButton>
            </DialogClose>
            <MotionButton type="submit">Save changes</MotionButton>
          </DialogFooter>
        </MotionDialogContent>
      </form>
    </MotionDialog>
  )
}
