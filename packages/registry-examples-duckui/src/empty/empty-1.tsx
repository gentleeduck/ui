import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui-duckui/empty'
import { IconInbox } from '@tabler/icons-react'
import { ArrowUpRightIcon } from 'lucide-react'

export default function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconInbox />
        </EmptyMedia>
        <EmptyTitle>Your Inbox is Empty</EmptyTitle>
        <EmptyDescription>
          No messages waiting for you. New conversations will show up here when someone reaches out.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Compose Message</Button>
          <Button variant="outline">View Archived</Button>
        </div>
      </EmptyContent>
      <Button asChild className="text-muted-foreground" size="sm" variant="link">
        <a href="#">
          Manage Preferences <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  )
}
