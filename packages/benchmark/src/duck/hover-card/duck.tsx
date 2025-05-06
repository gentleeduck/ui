import { HoverCard, HoverCardContent, HoverCardTrigger } from '@gentleduck/registry-ui-duckui/hover-card'

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent>The React Framework – created and maintained by @vercel.</HoverCardContent>
    </HoverCard>
  )
}
