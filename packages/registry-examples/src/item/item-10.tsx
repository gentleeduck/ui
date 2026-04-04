'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Button } from '@gentleduck/registry-ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@gentleduck/registry-ui/item'
import { ChevronDownIcon } from 'lucide-react'

const workspaces = [
  {
    avatar: 'https://avatar.vercel.sh/ducklabs',
    description: '12 members',
    name: 'Duck Labs',
  },
  {
    avatar: 'https://avatar.vercel.sh/starter',
    description: '5 members',
    name: 'Starter Kit',
  },
  {
    avatar: 'https://avatar.vercel.sh/oss',
    description: '28 members',
    name: 'Open Source Org',
  },
]

export default function Demo() {
  return (
    <div className="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-fit" size="sm" variant="outline">
            Switch Workspace <ChevronDownIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 [--radius:0.65rem]" side="bottom">
          {workspaces.map((workspace) => (
            <DropdownMenuItem className="p-0" key={workspace.name}>
              <Item className="w-full p-2" size="sm">
                <ItemMedia>
                  <Avatar className="size-8">
                    <AvatarImage alt={workspace.name} src={workspace.avatar} />
                    <AvatarFallback>{workspace.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="gap-0.5">
                  <ItemTitle>{workspace.name}</ItemTitle>
                  <ItemDescription>{workspace.description}</ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
