import { Button } from '@gentleduck/registry-ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@gentleduck/registry-ui/item'
import { GitCommitVerticalIcon, PackageIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <PackageIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Release v2.4.0 Published</ItemTitle>
          <ItemDescription>Includes 12 bug fixes and 3 new components.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Changelog
          </Button>
        </ItemActions>
      </Item>
      <Item size="sm" variant="outline">
        <ItemMedia>
          <GitCommitVerticalIcon className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>feat: add slider primitive</ItemTitle>
          <ItemDescription>Committed 2 hours ago</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
