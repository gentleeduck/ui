import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@gentleduck/registry-ui-duckui/item'
import { PlusIcon } from 'lucide-react'
import * as React from 'react'

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

export default function ItemGroupExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ItemGroup>
        {people.map((person, index) => (
          <React.Fragment key={person.username}>
            <Item>
              <ItemMedia>
                <Avatar alt={person.username} fallback={person.username.charAt(0)} src={person.avatar} />
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle>{person.username}</ItemTitle>
                <ItemDescription>{person.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button className="rounded-full" size="icon" variant="ghost">
                  <PlusIcon />
                </Button>
              </ItemActions>
            </Item>
            {index !== people.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>
    </div>
  )
}
