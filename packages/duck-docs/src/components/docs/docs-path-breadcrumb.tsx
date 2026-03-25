'use client'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@gentleduck/registry-ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'

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

  // On small screens, collapse middle segments into an ellipsis
  // Always show the first segment and the last segment
  const COLLAPSE_THRESHOLD = 3

  const items: { href: string; isLast: boolean; label: string }[] = segments.map((segment, index) => ({
    href: `/docs/${segments.slice(0, index + 1).join('/')}`,
    isLast: index === segments.length - 1,
    label: toTitleCase(segment),
  }))

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {items.length <= COLLAPSE_THRESHOLD ? (
          items.map((item, index) => (
            <React.Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="min-w-0">
                {item.isLast ? (
                  <BreadcrumbPage className="block max-w-44 truncate font-medium">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="block max-w-32 truncate">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))
        ) : (
          <>
            {/* First segment */}
            <BreadcrumbItem className="hidden min-w-0 sm:inline-flex">
              <BreadcrumbLink asChild>
                <Link href={items[0]!.href} className="block max-w-32 truncate">
                  {items[0]!.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:list-item" />

            {/* Collapsed middle on mobile, expanded on desktop */}
            {items.length > COLLAPSE_THRESHOLD && (
              <>
                <BreadcrumbItem className="inline-flex sm:hidden">
                  <BreadcrumbEllipsis className="size-4" />
                </BreadcrumbItem>
                <BreadcrumbSeparator className="list-item sm:hidden" />
              </>
            )}

            {/* Middle segments — hidden on mobile when too many */}
            {items.slice(1, -1).map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && <BreadcrumbSeparator className="hidden sm:list-item" />}
                <BreadcrumbItem className="hidden min-w-0 sm:inline-flex">
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="block max-w-32 truncate">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
            <BreadcrumbSeparator />

            {/* Last segment — always visible */}
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="block max-w-44 truncate font-medium">{items.at(-1)!.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
