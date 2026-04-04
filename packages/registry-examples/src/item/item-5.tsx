import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Button } from '@gentleduck/registry-ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@gentleduck/registry-ui/item'
import { UserPlusIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia>
          <Avatar className="size-10">
            <AvatarImage alt="profile picture for alexchen" src="https://avatar.vercel.sh/alexchen" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
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
            <Avatar className="hidden sm:flex">
              <AvatarImage alt="sara" src="https://avatar.vercel.sh/sara" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar className="hidden sm:flex">
              <AvatarImage alt="omar" src="https://avatar.vercel.sh/omar" />
              <AvatarFallback>OK</AvatarFallback>
            </Avatar>
            <Avatar className="hidden sm:flex">
              <AvatarImage alt="liwei" src="https://avatar.vercel.sh/liwei" />
              <AvatarFallback>LW</AvatarFallback>
            </Avatar>
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
