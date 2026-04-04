'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentleduck/registry-ui/sheet'
import { Menu } from 'lucide-react'

export default function Demo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:ring-2 data-[state=open]:ring-ring">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>The menu icon stays active while the sheet is open.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
