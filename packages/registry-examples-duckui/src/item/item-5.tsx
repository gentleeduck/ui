import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@gentleduck/registry-ui-duckui/item'
import { Plus } from 'lucide-react'

export default function ItemAvatar() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar
            alt="a profile picture for wildduck2"
            className="size-10"
            fallback="WD"
            src="https://github.com/wildduck2.png"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Evil Rabbit</ItemTitle>
          <ItemDescription>Last seen 5 months ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button aria-label="Invite" className="rounded-full" size="icon-sm" variant="outline">
            <Plus />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <div className="-space-x-2 flex *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            <Avatar alt="@shadcn" className="hidden sm:flex" fallback="CN" src="https://github.com/shadcn.png" />
            <Avatar alt="@shadcn" className="hidden sm:flex" fallback="CN" src="https://github.com/shadcn.png" />
            <Avatar alt="@shadcn" className="hidden sm:flex" fallback="CN" src="https://github.com/shadcn.png" />
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>No Team Members</ItemTitle>
          <ItemDescription>Invite your team to collaborate on this project.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
