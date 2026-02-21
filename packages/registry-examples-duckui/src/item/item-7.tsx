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
import { MessageSquareIcon } from 'lucide-react'
import * as React from 'react'

const contacts = [
  {
    avatar: 'https://avatar.vercel.sh/jordan',
    lastMessage: 'Sounds good, let me check the PR.',
    name: 'Jordan Rivera',
  },
  {
    avatar: 'https://avatar.vercel.sh/taylor',
    lastMessage: 'The staging deploy is live now.',
    name: 'Taylor Kim',
  },
  {
    avatar: 'https://avatar.vercel.sh/casey',
    lastMessage: 'Can we reschedule the sync to Thursday?',
    name: 'Casey Nakamura',
  },
]

export default function ItemGroupExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <ItemGroup>
        {contacts.map((contact, index) => (
          <React.Fragment key={contact.name}>
            <Item>
              <ItemMedia>
                <Avatar alt={contact.name} fallback={contact.name.charAt(0)} src={contact.avatar} />
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle>{contact.name}</ItemTitle>
                <ItemDescription>{contact.lastMessage}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button className="rounded-full" size="icon" variant="ghost">
                  <MessageSquareIcon />
                </Button>
              </ItemActions>
            </Item>
            {index !== contacts.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>
    </div>
  )
}
