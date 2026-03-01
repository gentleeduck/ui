import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@gentleduck/registry-ui/item'
import { ChevronRightIcon, ExternalLinkIcon } from 'lucide-react'

export default function ItemLink() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Item asChild>
        <a href="#">
          <ItemContent>
            <ItemTitle>API Reference</ItemTitle>
            <ItemDescription>Explore endpoints, parameters, and response schemas.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </a>
      </Item>
      <Item asChild variant="outline">
        <a href="#" rel="noopener noreferrer" target="_blank">
          <ItemContent>
            <ItemTitle>Changelog - February 2026</ItemTitle>
            <ItemDescription>See what shipped this month across all packages.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ExternalLinkIcon className="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  )
}
