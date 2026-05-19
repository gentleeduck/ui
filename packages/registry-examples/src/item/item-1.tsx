import { Button } from '@gentleduck/registry-ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@gentleduck/registry-ui/item'
import { ChevronRightIcon, ClipboardListIcon } from 'lucide-react'

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Weekly Standup Notes</ItemTitle>
          <ItemDescription>Review action items from the last meeting before Friday.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item asChild size="sm" variant="outline">
        {/* biome-ignore lint/a11y/useValidAnchor: placeholder href in demo component */}
        <a href="#">
          <ItemMedia>
            <ClipboardListIcon className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>3 tasks assigned to you this sprint.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  )
}
