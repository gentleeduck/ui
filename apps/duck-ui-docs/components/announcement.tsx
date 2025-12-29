import { Badge } from '@gentleduck/registry-ui-duckui/badge'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export function Announcement() {
  return (
    <Badge asChild className="rounded-full mx-auto" variant="secondary">
      <Link href="/docs/components">
        Introducing New Version of Components <span className="underline">V3</span>
        <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
