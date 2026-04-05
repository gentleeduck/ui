'use client'

import { Button } from '@gentleduck/registry-ui/button'
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
          <Button variant={'outline'}>Open Dialog</Button>
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
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </MotionDialogContent>
      </form>
    </MotionDialog>
  )
}
