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

const ITEMS_TO_DISPLAY = 3

export function DocsPathBreadcrumb({ segments }: { segments: string[] }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!segments.length) return null

  const items = segments.map((segment, index) => ({
    href: `/docs/${segments.slice(0, index + 1).join('/')}`,
    isLast: index === segments.length - 1,
    label: toTitleCase(segment),
  }))

  const needsCollapse = items.length > ITEMS_TO_DISPLAY
  const collapsedItems = needsCollapse ? items.slice(1, -2) : []
  const trailingItems = needsCollapse ? items.slice(-ITEMS_TO_DISPLAY + 1) : items.slice(1)
  const firstItem = items[0]

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {/* First segment — always visible */}
        {firstItem && (
          <>
            <BreadcrumbItem className="min-w-0">
              {firstItem.isLast ? (
                <BreadcrumbPage className="block max-w-28 truncate font-medium sm:max-w-44">
                  {firstItem.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={firstItem.href} className="block max-w-24 truncate sm:max-w-32">
                    {firstItem.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!firstItem.isLast && <BreadcrumbSeparator />}
          </>
        )}

        {/* Collapsed middle segments — ellipsis with dropdown/drawer */}
        {needsCollapse && (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu onOpenChange={setOpen} open={open}>
                  <DropdownMenuTrigger aria-label="Show more" className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start">
                    {collapsedItems.map((item) => (
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
                      {collapsedItems.map((item) => (
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
            <BreadcrumbSeparator />
          </>
        )}

        {/* Trailing segments */}
        {trailingItems.map((item) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem className="min-w-0">
              {item.isLast ? (
                <BreadcrumbPage className="block max-w-28 truncate font-medium sm:max-w-44">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
