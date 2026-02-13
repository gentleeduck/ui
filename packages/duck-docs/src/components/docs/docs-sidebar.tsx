'use client'

import { type DocsConfig, useDocsConfig } from '@duck-docs/context'
import type { SidebarNavItem } from '@duck-docs/types/nav'
import { cn } from '@gentleduck/libs/cn'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface DocsSidebarNavProps {
  config?: DocsConfig
}

export function DocsSidebarNav({ config }: DocsSidebarNavProps) {
  const pathname = usePathname()
  const fallbackConfig = useDocsConfig()
  const resolvedConfig = config ?? fallbackConfig

  const items = pathname?.startsWith('/charts') ? resolvedConfig.chartsNav : resolvedConfig.sidebarNav

  return (
    items?.length && (
      <div className="flex w-full flex-col">
        {items.map((item, index) => (
          <CategoryItem item={item} key={index} pathname={pathname} />
        ))}
      </div>
    )
  )
}

// Memoized category component to prevent unnecessary re-renders
const CategoryItem = ({ item, pathname }: { item: SidebarNavItem; pathname: string | null }) => {
  return (
    <div className="mb-2 flex flex-col gap-1">
      <div className="flex h-[36px] w-full items-center justify-between text-start font-semibold text-sm [&>div]:w-full [&>div]:justify-between">
        {item.title}
        {item.label && (
          <span className="bg- ml-2 rounded-md px-1.5 py-0.5 font-normal text-[#000000] text-sm leading-none no-underline group-hover:no-underline">
            {item.label}
          </span>
        )}
      </div>
      <div className="border-l">
        {item?.items?.length && <DocsSidebarNavItems items={item.items} pathname={pathname} />}
      </div>
    </div>
  )
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
  className?: string
}

export function DocsSidebarNavItems({ items, pathname }: DocsSidebarNavItemsProps) {
  return (
    items?.length && (
      <ul>
        {items.map((item, index) => (
          <DocsSidebarNavItem item={item} key={index} pathname={pathname} />
        ))}
      </ul>
    )
  )
}

export function DocsSidebarNavItem({ item, pathname }: { item: SidebarNavItem; pathname: string | null }) {
  if (item.href && !item.disabled) {
    return (
      <li className={cn(pathname === item.href && 'border-primary border-l')}>
        <Link
          className={cn(
            'group flex w-full items-center border-primary px-4 py-1 font-medium text-sm focus-visible:border-l focus-visible:outline-none',
            pathname === item.href ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}
          href={item.href}
          scroll
          rel={item.external ? 'noreferrer' : ''}
          target={item.external ? '_blank' : ''}>
          {item.title}
          {item.label && (
            <span className="ml-2 rounded-md bg-primary px-1.5 py-0.5 font-medium text-accent text-xs leading-none no-underline group-hover:no-underline">
              {item.label}
            </span>
          )}
        </Link>
      </li>
    )
  }

  return (
    <span
      className={cn(
        'flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline',
      )}>
      {item.title}
      {item.label && (
        <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-sm leading-none no-underline group-hover:no-underline">
          {item.label}
        </span>
      )}
    </span>
  )
}
