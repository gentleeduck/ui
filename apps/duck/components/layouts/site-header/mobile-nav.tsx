'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@gentleduck/registry-ui/drawer'
import { ScrollArea } from '@gentleduck/registry-ui/scroll-area'
import { PanelsTopLeft } from 'lucide-react'
import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { docsConfig } from '~/config/docs'
import type { ISidebarNavItem } from '~/types/nav'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button
          aria-label="Open navigation menu"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          icon={<PanelsTopLeft aria-hidden="true" />}
          size={'icon'}
          variant="ghost"></Button>
      </DrawerTrigger>
      <DrawerContent className="pr-0 pb-4">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Site navigation</DrawerTitle>
        </DrawerHeader>
        <ScrollArea>
          <div className="hide-scroll my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
            <div className="flex flex-col space-y-3">
              {docsConfig.mainNav?.map(
                (item) =>
                  item.href && (
                    <MobileLink href={item.href} key={item.href} onOpenChange={setOpen}>
                      {item.title}
                    </MobileLink>
                  ),
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {docsConfig.sidebarNav.map((item) => (
                <div className="flex flex-col space-y-3 pt-6" key={item.title}>
                  <h4 className="font-medium">{item.title}</h4>
                  <MobileSidebarNavItems items={item.items ?? []} onOpenChange={setOpen} />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

function MobileSidebarNavItems({
  items,
  onOpenChange,
  depth = 0,
}: {
  items: ISidebarNavItem[]
  onOpenChange: (open: boolean) => void
  depth?: number
}) {
  if (!items.length) {
    return null
  }

  return (
    <div className={cn('flex flex-col space-y-2', depth > 0 && 'ml-4 border-l pl-3')}>
      {items.map((item, index) => {
        const key = item.href ?? `${depth}-${index}-${item.title}`
        const hasChildren = Boolean(item.items?.length)

        return (
          <div className="flex flex-col space-y-2" key={key}>
            {!item.disabled &&
              (item.href ? (
                <MobileLink className="text-muted-foreground" href={item.href} onOpenChange={onOpenChange}>
                  {item.title}
                  {item.label && (
                    <span className="ml-2 rounded-md bg-primary px-1.5 py-0.5 text-accent text-xs leading-none no-underline group-hover:no-underline">
                      {item.label}
                    </span>
                  )}
                </MobileLink>
              ) : (
                <p className="text-muted-foreground text-sm">{item.title}</p>
              ))}
            {hasChildren && (
              <MobileSidebarNavItems depth={depth + 1} items={item.items ?? []} onOpenChange={onOpenChange} />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface IMobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: IMobileLinkProps) {
  const pathname = usePathname()
  return (
    <Link
      aria-current={pathname === href ? 'page' : undefined}
      className={cn(className)}
      href={href}
      scroll
      onClick={() => {
        onOpenChange?.(false)
      }}
      {...props}>
      {children}
    </Link>
  )
}
