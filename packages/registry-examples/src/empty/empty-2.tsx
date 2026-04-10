import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'
import { IconBookmark } from '@tabler/icons-react'

export default function Demo() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBookmark />
        </EmptyMedia>
        <EmptyTitle>No Saved Items</EmptyTitle>
        <EmptyDescription>Bookmark articles, pages, or resources to find them quickly later.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Browse Content
        </Button>
      </EmptyContent>
    </Empty>
  )
}
