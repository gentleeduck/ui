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
import { PlusIcon } from 'lucide-react'

export default function EmptyAvatarGroup() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <div className="flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            <Avatar alt="collaborator 1" fallback="AL" src="https://github.com/wildduck2.png" />
            <Avatar alt="collaborator 2" fallback="JR" src="https://github.com/wildduck2.png" />
            <Avatar alt="collaborator 3" fallback="SK" src="https://github.com/wildduck2.png" />
          </div>
        </EmptyMedia>
        <EmptyTitle>No Collaborators</EmptyTitle>
        <EmptyDescription>Add collaborators to work together on shared documents and tasks.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon />
          Add Collaborator
        </Button>
      </EmptyContent>
    </Empty>
  )
}
