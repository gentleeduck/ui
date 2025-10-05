import { PlusIcon } from 'lucide-react'

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

export default function EmptyAvatarGroup() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <Avatar src="https://github.com/wildduck2.png" alt="a profile picture for wildduck2" fallback="WD" />
            <Avatar src="https://github.com/wildduck2.png" alt="a profile picture for wildduck2" fallback="WD" />
            <Avatar src="https://github.com/wildduck2.png" alt="a profile picture for wildduck2" fallback="WD" />
          </div>
        </EmptyMedia>
        <EmptyTitle>No Team Members</EmptyTitle>
        <EmptyDescription>Invite your team to collaborate on this project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon />
          Invite Members
        </Button>
      </EmptyContent>
    </Empty>
  )
}
