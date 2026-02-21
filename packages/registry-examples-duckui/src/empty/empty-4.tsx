import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui-duckui/empty'

export default function EmptyAvatar() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Avatar
            alt="a profile picture for wildduck2"
            className="size-12"
            fallback="WD"
            src="https://github.com/wildduck2.png"
          />
        </EmptyMedia>
        <EmptyTitle>No Activity Yet</EmptyTitle>
        <EmptyDescription>
          This account has no recent activity. Start a conversation or share an update to get things going.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Share Update</Button>
      </EmptyContent>
    </Empty>
  )
}
