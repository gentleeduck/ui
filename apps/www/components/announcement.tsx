import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export function Announcement() {
  return (
    <Badge asChild className="mx-auto rounded-full" variant="secondary">
      <Link className="flex items-center gap-2" href="/docs/news">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">New</span>
        <span className="text-sm">
          Gen and Query are here <span className="underline">Learn more</span>
        </span>
        <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
