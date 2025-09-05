import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { Badge } from '@gentleduck/registry-ui-duckui/badge'

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="rounded-full mx-auto">
      <Link href="/docs/changelog">
        Introducing New Version of Components <span className="underline">V3</span>
        <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
