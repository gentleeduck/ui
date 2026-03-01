'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Button } from '@gentleduck/registry-ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui/card'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import { Separator } from '@gentleduck/registry-ui/separator'
import * as React from 'react'

const people = [
  {
    avatar: '/avatars/03.png',
    email: 'm@example.com',
    name: 'Olivia Martin',
  },
  {
    avatar: '/avatars/04.png',
    email: 'b@example.com',
    name: 'Isabella Nguyen',
  },
  {
    avatar: '/avatars/05.png',
    email: 'p@example.com',
    name: 'Sofia Davis',
  },
  {
    avatar: '/avatars/01.png',
    email: 'e@example.com',
    name: 'Ethan Thompson',
  },
]
export function CardsShare() {
  const id = React.useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>Anyone with the link can view this document.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Label className="sr-only" htmlFor={`${id}-link`}>
            Link
          </Label>
          <Input className="h-8" id={`${id}-link`} readOnly value="http://example.com/link/to/document" />
          <Button className="shadow-none" size="sm" variant="outline">
            Copy Link
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <div className="font-medium text-sm">People with access</div>
          <div className="grid gap-6">
            {people.map((person) => (
              <div className="flex items-center justify-between gap-4" key={person.email}>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage alt={person.name} src={person.avatar} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm leading-none">{person.name}</p>
                    <p className="text-muted-foreground text-sm">{person.email}</p>
                  </div>
                </div>
                <Select defaultValue="edit">
                  <Button asChild size="sm" variant="outline">
                    <SelectTrigger aria-label={`Permission for ${person.name}`} className="ml-auto pr-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </Button>
                  <SelectContent side="bottom" align="end">
                    <SelectItem value="edit">Can edit</SelectItem>
                    <SelectItem value="view">Can view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
