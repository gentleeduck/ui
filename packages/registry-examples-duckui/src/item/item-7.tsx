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
    avatar: 'https://github.com/wildduck2.png',
    email: 'wildduck@gentleduck.org',
    username: 'wildduck',
  },
  {
    avatar: 'https://github.com/gentleeduck/duck-ui/blob/master/apps/duck-ui-docs/public/static/LOGO.png?raw=true',
    email: 'gentleduck@gentleduck.org',
    username: 'gentleduck',
  },
  {
    avatar:
      'https://raw.githubusercontent.com/wildduck2/duck-starter-kit/15fbc61fb02cd21a873108b380ca12fe31f50099/apps/document-client/public/placeholder2.webp',
    email: 'inc@gentleduck.org',
    username: 'gentleduck.inc',
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
