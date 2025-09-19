import { Button } from '@gentleduck/registry-ui-duckui/button'
// import {
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
//   CommandShortcut,
// } from '@gentleduck/registry-ui-duckui/command'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui-duckui/dialog'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import React from 'react'

export default function DialogDemo() {
  const [open, setOpen] = React.useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit Profile</Button>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger variant="outline">Edit Profile</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" renderOnce>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="name">
                Name
              </Label>
              <Input className="col-span-3" defaultValue="Pedro Duarte" id="name" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="username">
                Username
              </Label>
              <Input className="col-span-3" defaultValue="@peduarte" id="username" />
            </div>
          </div>
          <DialogFooter>
            <DialogTrigger>Save changes</DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
