import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

function toTitleCase(segment: string) {
  return segment
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function DocsPathBreadcrumb({ segments }: { segments: string[] }) {
  if (!segments.length) {
    return null
  }

  return (
    <nav aria-label="Page path" className="hidden items-center gap-2 text-muted-foreground text-sm md:flex">
      {segments.map((segment, index) => (
        <div className="flex items-center gap-2" key={`${segment}-${index}`}>
          {index > 0 && <ChevronRightIcon aria-hidden="true" className="size-4" />}
          <Link
            className="transition-colors hover:text-foreground"
            href={`/docs/${segments.slice(0, index + 1).join('/')}`}>
            {toTitleCase(segment)}
          </Link>
        </div>
      ))}
    </nav>
  )
}
