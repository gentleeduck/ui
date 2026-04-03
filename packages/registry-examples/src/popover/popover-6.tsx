'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { MotionPopoverContent, Popover, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Animated Popover</Button>
      </PopoverTrigger>
      <MotionPopoverContent className="w-80" open={open}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="p6-width">Width</Label>
              <Input className="col-span-2 h-8" defaultValue="100%" id="p6-width" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="p6-height">Height</Label>
              <Input className="col-span-2 h-8" defaultValue="25px" id="p6-height" />
            </div>
          </div>
        </div>
      </MotionPopoverContent>
    </Popover>
  )
}
