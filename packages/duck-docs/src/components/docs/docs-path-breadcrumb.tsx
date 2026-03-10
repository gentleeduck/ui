'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@gentleduck/registry-ui/breadcrumb'
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
  if (!segments.length) return null

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList className="flex-nowrap">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const href = `/docs/${segments.slice(0, index + 1).join('/')}`

          return (
            <>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem key={href} className="min-w-0">
                {isLast ? (
                  <BreadcrumbPage className="block max-w-40 truncate">{toTitleCase(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="block max-w-40 truncate">
                      {toTitleCase(segment)}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
