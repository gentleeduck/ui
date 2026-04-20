import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export function Announcement() {
  return (
    <Link
      href="/docs/changelog"
      className="mx-auto inline-flex w-fit max-w-full items-center gap-2 overflow-hidden rounded-full border border-transparent bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground text-sm transition-colors hover:bg-secondary/80">
      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">New</span>
      <span className="truncate">gentleduck/ui - Charts, Sidebar blocks, and more</span>
      <span className="shrink-0 underline">See what's new</span>
      <ArrowRightIcon aria-hidden="true" className="size-4 shrink-0" />
    </Link>
  )
}
