'use client'

import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui-duckui/dropdown-menu'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@gentleduck/registry-ui-duckui/item'
import { ChevronDownIcon } from 'lucide-react'

const people = [
  {
    avatar: 'https://github.com/shadcn.png',
    email: 'shadcn@vercel.com',
    username: 'shadcn',
  },
  {
    avatar: 'https://github.com/maxleiter.png',
    email: 'maxleiter@vercel.com',
    username: 'maxleiter',
  },
  {
    avatar: 'https://github.com/evilrabbit.png',
    email: 'evilrabbit@vercel.com',
    username: 'evilrabbit',
  },
]

export default function ItemDropdown() {
  return (
    <div className="flex min-h-64 w-full max-w-md flex-col items-center gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-fit" size="sm" variant="outline">
            Select <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 [--radius:0.65rem]">
          {people.map((person) => (
            <DropdownMenuItem className="p-0" key={person.username}>
              <Item className="w-full p-2" size="sm">
                <ItemMedia>
                  <Avatar
                    alt={person.username}
                    className="size-8"
                    fallback={person.username.charAt(0)}
                    src={person.avatar}
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
