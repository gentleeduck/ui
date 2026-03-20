import { Badge } from '@gentleduck/registry-ui/badge'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export function Announcement() {
  return (
    <Badge asChild className="mx-auto max-w-full rounded-full" variant="secondary">
      <Link className="flex items-center gap-2 overflow-hidden" href="/docs/changelog">
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">New</span>
        <span className="truncate text-sm">gentleduck/ui - Charts, Sidebar blocks, and more</span>
        <span className="shrink-0 text-sm underline">See what's new</span>
        <ArrowRightIcon aria-hidden="true" className="shrink-0" />
      </Link>
    </Badge>
  )
}
