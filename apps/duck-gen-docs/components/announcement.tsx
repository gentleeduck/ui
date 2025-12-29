import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export function Announcement() {
  return (
    <Badge asChild className="rounded-full mx-auto" variant="secondary">
      <Link href="/docs/duck-gen">
        Duck Gen docs are live <span className="underline">Start here</span>
        <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
