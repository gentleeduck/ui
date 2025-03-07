'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarNavItem } from 'types/nav'

import { cn } from '@duck/libs/cn'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { type DocsConfig } from '~/config/docs'

export interface DocsSidebarNavProps {
  config: DocsConfig
}

export function DocsSidebarNav({ config }: DocsSidebarNavProps) {
  const pathname = usePathname()
  const [openIndexes, setOpenIndexes] = useState<{ [key: number]: boolean }>({})

  const items = pathname?.startsWith('/charts')
    ? config.chartsNav
    : config.sidebarNav

  const toggleCategory = (index: number) => {
    setOpenIndexes((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  return items.length && (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="flex justify-between cursor-pointer rounded-md w-full text-start px-2 py-1 text-sm font-semibold"
            onClick={() => toggleCategory(index)}
          >
            {item.title}
            <ChevronDown
              className={cn(
                'transition-transform',
                openIndexes[index] ? 'rotate-180' : 'rotate-0',
              )}
            />
          </button>
          {item?.items?.length && (
            <DocsSidebarNavItems
              className={openIndexes[index] ? '!grid-rows-[1fr]' : ''}
              items={item.items}
              pathname={pathname}
            />
          )}
        </div>
      ))}
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
  return items?.length ? (
    <div
      className={cn(
        'grid text-sm transition-all duration-500 grid-rows-[0fr] will-change-[grid-template-rows]',
        className,
      )}
    >
      <ul className="overflow-hidden transition-all ps-2">
        {items.map((item, index) =>
          item.href && !item.disabled ? (
            <li key={index}>
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
          ) : (
            <span
              key={index}
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
          ),
        )}
      </ul>
    </div>
  ) : null
}
