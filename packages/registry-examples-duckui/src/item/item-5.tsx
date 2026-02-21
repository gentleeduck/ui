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
import { UserPlusIcon } from 'lucide-react'

export default function ItemAvatar() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar
            alt="profile picture for alexchen"
            className="size-10"
            fallback="AC"
            src="https://avatar.vercel.sh/alexchen"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Alex Chen</ItemTitle>
          <ItemDescription>Frontend Engineer -- joined 3 weeks ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button aria-label="Follow" className="rounded-full" size="icon-sm" variant="outline">
            <UserPlusIcon />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            <Avatar alt="sara" className="hidden sm:flex" fallback="SM" src="https://avatar.vercel.sh/sara" />
            <Avatar alt="omar" className="hidden sm:flex" fallback="OK" src="https://avatar.vercel.sh/omar" />
            <Avatar alt="liwei" className="hidden sm:flex" fallback="LW" src="https://avatar.vercel.sh/liwei" />
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Design Review Group</ItemTitle>
          <ItemDescription>3 reviewers awaiting your feedback on the mockups.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Review
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
