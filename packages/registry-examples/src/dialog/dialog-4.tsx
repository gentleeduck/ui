'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gentleduck/registry-ui/dialog'
import { Pencil } from 'lucide-react'

export default function DialogActiveDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="data-[state=open]:bg-primary data-[state=open]:text-primary-foreground">
          <Pencil className="mr-2 h-4 w-4" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>The trigger button is highlighted while this dialog is open.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
