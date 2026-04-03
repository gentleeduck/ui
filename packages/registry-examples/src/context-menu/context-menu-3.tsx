'use client'

import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  MotionContextMenuContent,
} from '@gentleduck/registry-ui/context-menu'
import React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)

  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here (animated)
      </ContextMenuTrigger>
      <MotionContextMenuContent className="w-64" open={open}>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>View Page Source</ContextMenuItem>
        <ContextMenuItem>Inspect</ContextMenuItem>
      </MotionContextMenuContent>
    </ContextMenu>
  )
}
