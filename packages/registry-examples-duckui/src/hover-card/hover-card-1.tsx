import { Avatar } from '@gentleduck/registry-ui-duckui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui-duckui/hover-card'
import { CalendarIcon } from 'lucide-react'

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger variant={'link'}>@nextjs</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar alt="VC" src="https://github.com/vercel.png" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">@nextjs</h4>
            <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-muted-foreground text-xs">Joined December 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
