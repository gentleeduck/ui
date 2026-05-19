'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gentleduck/registry-ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
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
              <Avatar className="border">
                <AvatarImage alt={member.name} src={member.avatar} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <p className="font-medium text-sm leading-none">{member.name}</p>
                <p className="text-muted-foreground text-xs">{member.email}</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="ml-auto shadow-none" size="sm" variant="outline">
                  {member.role} <ChevronDown aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end" className="p-0">
                <Command>
                  <CommandInput placeholder="Select role..." />
                  <CommandList>
                    <CommandEmpty>No roles found.</CommandEmpty>
                    <CommandGroup>
                      {roles.map((role) => (
                        <CommandItem key={role.name}>
                          <div className="flex flex-col">
                            <p className="font-medium text-sm">{role.name}</p>
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
