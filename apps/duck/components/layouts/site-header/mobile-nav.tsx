'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@gentleduck/registry-ui/drawer'
import { ScrollArea } from '@gentleduck/registry-ui/scroll-area'
import { PanelsTopLeft } from 'lucide-react'
import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { navItems } from '~/config/nav-items'
import type { PackageLifecycleStatus } from '~/config/package-status'
import type { IMainNavItem } from '~/types/nav'

type NavItemType = IMainNavItem & {
  icon?: React.ElementType
  color?: string
  description?: string
  status?: PackageLifecycleStatus
  items?: NavItemType[]
}

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
          <nav aria-label="Site" className="hide-scroll my-4 h-[calc(100vh-8rem)] pr-4 pb-10 pl-6">
            <ul className="flex flex-col gap-6">
              {(navItems as NavItemType[]).map((item) => (
                <MobileNavSection key={item.href ?? item.title} item={item} onClose={() => setOpen(false)} />
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

function MobileNavSection({ item, onClose }: { item: NavItemType; onClose: () => void }) {
  if (!item.items?.length) {
    return (
      <li>
        <MobileLink
          className="block py-1 font-semibold text-base text-foreground"
          href={item.href ?? '#'}
          onOpenChange={onClose}>
          {item.title}
        </MobileLink>
      </li>
    )
  }

  return (
    <li>
      <div className="mb-2 flex items-center justify-between">
        <MobileLink className="font-semibold text-base text-foreground" href={item.href ?? '#'} onOpenChange={onClose}>
          {item.title}
        </MobileLink>
      </div>
      <ul className="flex flex-col gap-1">
        {item.items.map((sub) => (
          <li key={sub.href ?? sub.title}>
            <MobileLink
              className="flex items-start gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
              href={sub.href ?? '#'}
              onOpenChange={onClose}>
              <NavIcon icon={sub.icon} color={sub.color} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-foreground text-sm leading-tight">{sub.title}</span>
                  {sub.status && (
                    <span className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground uppercase tracking-wide">
                      {sub.status}
                    </span>
                  )}
                </span>
                {sub.description && (
                  <span className="mt-0.5 line-clamp-2 block text-muted-foreground text-xs leading-snug">
                    {sub.description}
                  </span>
                )}
              </span>
            </MobileLink>
          </li>
        ))}
      </ul>
    </li>
  )
}

function NavIcon({ icon: Icon, color }: { icon?: React.ElementType; color?: string }) {
  if (!Icon) return null
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
      style={{
        background: color ? `${color}1f` : 'rgba(255,255,255,0.06)',
        border: `1px solid ${color ? `${color}40` : 'rgba(255,255,255,0.1)'}`,
      }}>
      <Icon className="h-3.5 w-3.5" style={{ color: color ?? '#fff' }} />
    </span>
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
