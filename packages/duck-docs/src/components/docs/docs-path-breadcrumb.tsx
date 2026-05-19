'use client'

import { useMediaQuery } from '@gentleduck/hooks/use-media-query'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@gentleduck/registry-ui/breadcrumb'
import { Button } from '@gentleduck/registry-ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@gentleduck/registry-ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gentleduck/registry-ui/dropdown-menu'
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

export function DocsPathBreadcrumb({ segments, basePath = '/docs' }: { segments: string[]; basePath?: string }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!segments.length) return null

  const items = segments.map((segment, index) => ({
    href: `${basePath}/${segments.slice(0, index + 1).join('/')}`,
    isLast: index === segments.length - 1,
    label: toTitleCase(segment),
  }))

  // Always show: first + last. Collapse everything in between.
  const first = items[0]
  const last = items.length > 1 ? items[items.length - 1] : null
  const middle = items.length > 2 ? items.slice(1, -1) : []

  return (
    <Breadcrumb className="min-w-0 overflow-hidden">
      <BreadcrumbList className="flex-nowrap overflow-hidden">
        {first && (
          <BreadcrumbItem className="min-w-0 shrink-0">
            {first.isLast ? (
              <BreadcrumbPage className="truncate font-medium">{first.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={first.href} className="truncate">
                  {first.label}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        )}

        {middle.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu onOpenChange={setOpen} open={open}>
                  <DropdownMenuTrigger aria-label="Show more" className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start">
                    {middle.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer onOpenChange={setOpen} open={open}>
                  <DrawerTrigger aria-label="Show more">
                    <BreadcrumbEllipsis className="size-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>Select a page to navigate to.</DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {middle.map((item) => (
                        <Link className="py-1 text-sm" href={item.href} key={item.href}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
          </>
        )}

        {last && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="block max-w-32 truncate font-medium sm:max-w-48">{last.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
