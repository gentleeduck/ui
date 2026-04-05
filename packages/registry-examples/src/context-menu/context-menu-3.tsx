'use client'

import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  MotionContextMenu,
  MotionContextMenuContent,
} from '@gentleduck/registry-ui/context-menu'

export default function Demo() {
  return (
    <MotionContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here (animated)
      </ContextMenuTrigger>
      <MotionContextMenuContent className="w-64">
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>View Page Source</ContextMenuItem>
        <ContextMenuItem>Inspect</ContextMenuItem>
      </MotionContextMenuContent>
    </MotionContextMenu>
  )
}
