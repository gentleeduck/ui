import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui-duckui/avatar'
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
            <Avatar>
              <AvatarImage alt="collaborator 1" src="https://github.com/wildduck2.png" />
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage alt="collaborator 2" src="https://github.com/wildduck2.png" />
              <AvatarFallback>JR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage alt="collaborator 3" src="https://github.com/wildduck2.png" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
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
