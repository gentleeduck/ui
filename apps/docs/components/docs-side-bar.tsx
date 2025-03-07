'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarNavItem } from 'types/nav'

import { cn } from '@duck/libs/cn'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { type DocsConfig } from '~/config/docs'
import { Button } from '@duck/registry-ui-duckui/button'

export interface DocsSidebarNavProps {
  config: DocsConfig
}

export function DocsSidebarNav({ config }: DocsSidebarNavProps) {
  const pathname = usePathname()

  const items = pathname?.startsWith('/charts')
    ? config.chartsNav
    : config.sidebarNav

  return (
    items.length && (
      <div className="w-full flex flex-col">
        {items.map((item, index) => (
          <CategoryItem key={index} item={item} pathname={pathname} />
        ))}
      </div>
    )
  )
}

// Memoized category component to prevent unnecessary re-renders
const CategoryItem = ({
  item,
  pathname,
}: { item: SidebarNavItem; pathname: string | null }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-1">
      <Button
        className="flex justify-between w-full text-start text-sm font-semibold"
        onClick={() => setIsOpen(!isOpen)}
        variant={'ghost'}
        secondIcon={
          <ChevronDown
            className={cn(
              'transition-transform',
              isOpen ? 'rotate-180' : 'rotate-0',
            )}
          />
        }
      >
        {item.title}
        {item.label && (
          <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs font-normal leading-none text-[#000000] no-underline group-hover:no-underline">
            {item.label}
          </span>
        )}
      </Button>
      {item?.items?.length && (
        <DocsSidebarNavItems
          className={isOpen ? '!grid-rows-[1fr]' : ''}
          items={item.items}
          pathname={pathname}
        />
      )}
    </div>
  )
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
  className?: string
}

export function DocsSidebarNavItems({
  items,
  pathname,
  className,
}: DocsSidebarNavItemsProps) {
  return (
    items?.length && (
      <div
        className={cn(
          'grid text-sm transition-all duration-500 grid-rows-[0fr] will-change-[grid-template-rows]',
          className,
        )}
      >
        <ul className="overflow-hidden transition-all ps-2">
          {items.map((item, index) => (
            <DocsSidebarNavItem key={index} item={item} pathname={pathname} />
          ))}
        </ul>
      </div>
    )
  )
}

export function DocsSidebarNavItem({
  item,
  pathname,
}: {
  item: SidebarNavItem
  pathname: string | null
}) {
  if (item.href && !item.disabled) {
    return (
      <li>
        <Link
          href={item.href}
          className={cn(
            'group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline',
            pathname === item.href
              ? 'font-medium text-foreground'
              : 'text-muted-foreground',
          )}
          target={item.external ? '_blank' : ''}
          rel={item.external ? 'noreferrer' : ''}
        >
          {item.title}
          {item.label && (
            <span className="ml-2 rounded-md bg-[#89b4fa] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
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
      )}
    >
      {item.title}
      {item.label && (
        <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
          {item.label}
        </span>
      )}
    </span>
  )
}
