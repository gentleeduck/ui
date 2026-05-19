import { Avatar, AvatarFallback, AvatarImage } from '@gentleduck/registry-ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui/hover-card'

export default function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href="https://github.com/gentleeduck"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-sm underline-offset-4 hover:underline data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:no-underline">
          @gentleduck
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/gentleeduck.png" />
            <AvatarFallback>GD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">gentleduck</h4>
            <p className="text-muted-foreground text-sm">The trigger link is highlighted while hovering this card.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
