'use client'

import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gentleduck/registry-ui-duckui/card'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Label } from '@gentleduck/registry-ui-duckui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import { Separator } from '@gentleduck/registry-ui-duckui/separator'

const people = [
  {
    name: 'Olivia Martin',
    email: 'm@example.com',
    avatar: '/avatars/03.png',
  },
  {
    name: 'Isabella Nguyen',
    email: 'b@example.com',
    avatar: '/avatars/04.png',
  },
  {
    name: 'Sofia Davis',
    email: 'p@example.com',
    avatar: '/avatars/05.png',
  },
  {
    name: 'Ethan Thompson',
    email: 'e@example.com',
    avatar: '/avatars/01.png',
  },
]
export function CardsShare() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this document</CardTitle>
        <CardDescription>Anyone with the link can view this document.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input id="link" value="http://example.com/link/to/document" className="h-8" readOnly />
          <Button size="sm" variant="outline" className="shadow-none">
            Copy Link
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium">People with access</div>
          <div className="grid gap-6">
            {people.map((person) => (
              <div key={person.email} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar src={person.avatar} alt={person.name.charAt(0)}></Avatar>
                  <div>
                    <p className="text-sm leading-none font-medium">{person.name}</p>
                    <p className="text-muted-foreground text-sm">{person.email}</p>
                  </div>
                </div>
                <Select defaultValue="edit" placement="bottom-end">
                  <Button variant="outline" size="sm" asChild>
                    <SelectTrigger className="ml-auto pr-2" aria-label="Edit">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </Button>
                  <SelectContent>
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
