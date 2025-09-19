'use client'

import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui-duckui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { ChevronDown } from 'lucide-react'

const teamMembers = [
  {
    avatar: '/avatars/01.png',
    email: 'm@example.com',
    name: 'Sofia Davis',
    role: 'Owner',
  },
  {
    avatar: '/avatars/02.png',
    email: 'p@example.com',
    name: 'Jackson Lee',
    role: 'Developer',
  },
  {
    avatar: '/avatars/03.png',
    email: 'i@example.com',
    name: 'Isabella Nguyen',
    role: 'Billing',
  },
]

const roles = [
  {
    description: 'Can view and comment.',
    name: 'Viewer',
  },
  {
    description: 'Can view, comment and edit.',
    name: 'Developer',
  },
  {
    description: 'Can view, comment and manage billing.',
    name: 'Billing',
  },
  {
    description: 'Admin-level access to all resources.',
    name: 'Owner',
  },
]

export function CardsTeamMembers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Invite your team members to collaborate.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {teamMembers.map((member) => (
          <div className="flex items-center justify-between gap-4" key={member.name}>
            <div className="flex items-center gap-4">
              <Avatar alt={member.name.charAt(0)} className="border" src={member.avatar}></Avatar>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm leading-none font-medium">{member.name}</p>
                <p className="text-muted-foreground text-xs">{member.email}</p>
              </div>
            </div>
            <Popover placement="bottom-end">
              <PopoverTrigger asChild>
                <Button className="ml-auto shadow-none" size="sm" variant="outline">
                  {member.role} <ChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Select role..." />
                  <CommandList>
                    <CommandEmpty>No roles found.</CommandEmpty>
                    <CommandGroup>
                      {roles.map((role) => (
                        <CommandItem key={role.name}>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{role.name}</p>
                            <p className="text-muted-foreground">{role.description}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
