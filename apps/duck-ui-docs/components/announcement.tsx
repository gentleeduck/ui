import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export function Announcement() {
  return (
    <Badge asChild className="mx-auto rounded-full" variant="secondary">
      <Link className="flex items-center gap-2" href="/docs/changelog">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">New</span>
        <span className="text-sm">
          gentleduck/ui — Charts, Sidebar blocks, and more <span className="underline">See what's new</span>
        </span>
        <ArrowRightIcon aria-hidden="true" />
      </Link>
    </Badge>
  )
}
