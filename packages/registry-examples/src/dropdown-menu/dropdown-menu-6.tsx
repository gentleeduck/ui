'use client'

import { Button } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  MotionDropdownMenuContent,
} from '@gentleduck/registry-ui/dropdown-menu'
import { LogOut, Settings, User } from 'lucide-react'
import React from 'react'

export default function Demo() {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Animated Menu</Button>
      </DropdownMenuTrigger>
      <MotionDropdownMenuContent className="w-56" open={open}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </MotionDropdownMenuContent>
    </DropdownMenu>
  )
}
