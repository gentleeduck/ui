'use client'

import { cn } from '@gentleduck/libs/cn'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@gentleduck/registry-ui/navigation-menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { navItems } from '~/config/nav-items'
import type { PackageLifecycleStatus } from '~/config/package-status'
import type { IMainNavItem } from '~/types/nav'
import { HeaderBrand } from '../header-shell'

function NavIcon({ icon: Icon, color }: { icon?: React.ElementType; color?: string }) {
  if (!Icon) return null
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      style={{
        background: color ? `${color}18` : 'rgba(255,255,255,0.06)',
        border: `1px solid ${color ? `${color}40` : 'rgba(255,255,255,0.1)'}`,
      }}>
      <Icon className="h-4 w-4" style={{ color: color ?? '#fff' }} />
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ComponentRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: React.ElementType; color?: string; status?: PackageLifecycleStatus }
>(({ className, title, children, icon, color, status, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          'flex select-none flex-row items-center gap-2.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className,
        )}
        {...props}>
        <NavIcon icon={icon} color={color} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="font-medium text-xs leading-none">
              {title} {status && <>({status.toUpperCase()}) </>}
            </div>
          </div>
          <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground leading-snug">{children}</p>
        </div>
      </a>
    </NavigationMenuLink>
  </li>
))
ListItem.displayName = 'ListItem'

type NavItemType = IMainNavItem & { icon?: React.ElementType; color?: string; items?: NavItemType[] }

function NavItem({ item, pathname }: { item: NavItemType; pathname: string }) {
  if (!item.items?.length) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink
          asChild
          className={cn(
            navigationMenuTriggerStyle(),
            'bg-transparent text-sm',
            pathname === item.href ? 'text-foreground' : 'text-foreground/70',
          )}>
          <Link href={item.href ?? '#'}>{item.title}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent text-foreground/70 text-sm">{item.title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul
          className="grid gap-1 p-1"
          style={{
            gridTemplateRows: 'repeat(6, auto)',
            gridAutoFlow: 'column',
            gridAutoColumns: '300px',
            width: 'max-content',
          }}>
          {item.items.map((sub) => (
            <ListItem
              key={sub.title}
              href={sub.href}
              title={sub.title}
              icon={sub.icon}
              color={sub.color}
              status={sub.status}>
              {sub.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <HeaderBrand className="mr-4 lg:mr-6" />
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          {navItems.map((item) => (
            <NavItem key={item.href ?? item.title} item={item as NavItemType} pathname={pathname} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
