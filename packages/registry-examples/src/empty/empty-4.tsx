import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@gentleduck/registry-ui/empty'

export default function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Avatar className="size-12">
            <AvatarImage alt="a profile picture for wildduck2" src="https://github.com/wildduck2.png" />
            <AvatarFallback>WD</AvatarFallback>
          </Avatar>
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
