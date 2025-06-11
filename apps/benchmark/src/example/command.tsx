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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger variant="outline">Edit Profile</DialogTrigger>
        <DialogContent renderOnce className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" defaultValue="@peduarte" className="col-span-3" />
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
