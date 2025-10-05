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
            className="size-12"
            src="https://github.com/wildduck2.png"
            alt="a profile picture for wildduck2"
            fallback="WD"
          />
        </EmptyMedia>
        <EmptyTitle>User Offline</EmptyTitle>
        <EmptyDescription>
          This user is currently offline. You can leave a message to notify them or try again later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Leave Message</Button>
      </EmptyContent>
    </Empty>
  )
}
