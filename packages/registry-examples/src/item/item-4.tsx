import { Button } from '@gentleduck/registry-ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@gentleduck/registry-ui/item'
import { HardDriveIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <HardDriveIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Storage Almost Full</ItemTitle>
          <ItemDescription>You have used 48.2 GB of 50 GB. Free up space or upgrade your plan.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Manage
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}
