'use client'

import { ChevronDownIcon } from 'lucide-react'

import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@gentleduck/registry-ui-duckui/item'

const people = [
  {
    username: 'shadcn',
    avatar: 'https://github.com/shadcn.png',
    email: 'shadcn@vercel.com',
  },
  {
    username: 'maxleiter',
    avatar: 'https://github.com/maxleiter.png',
    email: 'maxleiter@vercel.com',
  },
  {
    username: 'evilrabbit',
    avatar: 'https://github.com/evilrabbit.png',
    email: 'evilrabbit@vercel.com',
  },
]

export default function ItemDropdown() {
  return (
    <div className="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-fit">
            Select <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 [--radius:0.65rem]" align="end">
          {people.map((person) => (
            <DropdownMenuItem key={person.username} className="p-0">
              <Item size="sm" className="w-full p-2">
                <ItemMedia>
                  <Avatar
                    className="size-8"
                    src={person.avatar}
                    alt={person.username}
                    fallback={person.username.charAt(0)}
                  />
                </ItemMedia>
                <ItemContent className="gap-0.5">
                  <ItemTitle>{person.username}</ItemTitle>
                  <ItemDescription>{person.email}</ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
