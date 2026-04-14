'use client'

import { type IDocsConfig, useDocsConfig } from '@duck-docs/context'
import type { ISidebarNavItem } from '@duck-docs/types/nav'
import { cn } from '@gentleduck/libs/cn'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

export interface IDocsSidebarNavProps {
  config?: IDocsConfig
}

function getSidebarItemKey(item: ISidebarNavItem) {
  return item.href ?? `${item.title}-${item.label ?? 'item'}`
}

function isPathActive(pathname: string, href: string) {
  return pathname === href || (href !== '/docs' && pathname.startsWith(`${href}/`))
}

function isPathCurrent(pathname: string, href: string) {
  return pathname === href
}

function hasActivePath(item: ISidebarNavItem, pathname: string | null): boolean {
  if (!pathname) return false
  if (item.href && isPathActive(pathname, item.href)) return true
  return Boolean(item.items?.some((child) => hasActivePath(child, pathname)))
}

export function DocsSidebarNav({ config }: IDocsSidebarNavProps) {
  const pathname = usePathname()
  const fallbackConfig = useDocsConfig()
  const resolvedConfig = config ?? fallbackConfig

  const items = pathname?.startsWith('/charts') ? resolvedConfig.chartsNav : resolvedConfig.sidebarNav

  return (
    items?.length && (
      <div className="flex w-full flex-col">
        {items.map((item) => (
          <CategoryItem item={item} key={getSidebarItemKey(item)} pathname={pathname} />
        ))}
      </div>
    )
  )
}

// Memoized category component to prevent unnecessary re-renders
const CategoryItem = ({ item, pathname }: { item: ISidebarNavItem; pathname: string | null }) => {
  return (
    <div className="mb-2 flex flex-col">
      <div className="flex h-[36px] w-full items-center justify-between text-start font-semibold text-sm [&>div]:w-full [&>div]:justify-between">
        {item.title}
        {item.label && (
          <span className="bg- ml-2 rounded-md px-1.5 py-0.5 font-normal text-[#000000] text-sm leading-none no-underline group-hover:no-underline">
            {item.label}
          </span>
        )}
      </div>
      <div className="border-l-2">
        {item?.items?.length && (
          <DocsSidebarNavItems accordionDefault={Boolean(item.collapsible)} items={item.items} pathname={pathname} />
        )}
      </div>
    </div>
  )
}

interface IDocsSidebarNavItemsProps {
  items: ISidebarNavItem[]
  pathname: string | null
  className?: string
  depth?: number
  accordionDefault?: boolean
}

export function DocsSidebarNavItems({
  items,
  pathname,
  className,
  depth = 0,
  accordionDefault = false,
}: IDocsSidebarNavItemsProps) {
  const activeAccordionIndex = React.useMemo(
    () =>
      items.findIndex((item) => {
        const hasChildren = Boolean(item.items?.length)
        const isAccordionItem = hasChildren && Boolean(item.collapsible ?? accordionDefault)
        return isAccordionItem && hasActivePath(item, pathname)
      }),
    [items, pathname, accordionDefault],
  )

  return (
    items?.length && (
      <ul className={cn(depth > 0 && 'ml-3 border-l', className)}>
        {items.map((item, index) => (
          <DocsSidebarNavItem
            accordionDefault={accordionDefault}
            depth={depth}
            forceClose={activeAccordionIndex !== -1 && activeAccordionIndex !== index}
            forceOpen={activeAccordionIndex === index}
            item={item}
            key={getSidebarItemKey(item)}
            pathname={pathname}
          />
        ))}
      </ul>
    )
  )
}

export function DocsSidebarNavItem({
  item,
  pathname,
  depth = 0,
  accordionDefault = false,
  forceOpen = false,
  forceClose = false,
}: {
  item: ISidebarNavItem
  pathname: string | null
  depth?: number
  accordionDefault?: boolean
  forceOpen?: boolean
  forceClose?: boolean
}) {
  const hasChildren = Boolean(item.items?.length)
  const isAccordionItem = hasChildren && Boolean(item.collapsible ?? accordionDefault)
  const isCurrent = Boolean(pathname && item.href && isPathCurrent(pathname, item.href))
  const isActiveBranch = hasActivePath(item, pathname)
  const isActive = isCurrent || (hasChildren && isActiveBranch)
  const [isOpen, setIsOpen] = React.useState(() => {
    if (!isAccordionItem) return true
    return isActiveBranch || Boolean(item.defaultOpen)
  })

  React.useEffect(() => {
    if (!isAccordionItem) return
    if (forceOpen || isActiveBranch) {
      setIsOpen(true)
      return
    }
    if (forceClose) {
      setIsOpen(false)
    }
  }, [isAccordionItem, forceOpen, forceClose, isActiveBranch])

  const linkRef = React.useRef<HTMLAnchorElement>(null)

  // Scroll the active sidebar link into view on mount
  React.useEffect(() => {
    if (!isCurrent || !linkRef.current) return

    const scrollParent = linkRef.current.closest<HTMLElement>('[class*="overflow"]')
    if (!scrollParent) return

    const el = linkRef.current
    const scrollRect = scrollParent.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()

    if (elRect.top < scrollRect.top || elRect.bottom > scrollRect.bottom) {
      const targetScroll = el.offsetTop - scrollParent.offsetTop - scrollParent.clientHeight / 2 + el.clientHeight / 2
      scrollParent.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }, [isCurrent])

  if (item.href && !item.disabled) {
    return (
      <li className={cn(isActive && 'border-primary border-l')}>
        <div className="flex items-center">
          <Link
            ref={linkRef}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'group flex w-full items-center border-primary px-4 py-1 font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              depth > 0 && 'px-3',
              isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
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
            {item.external && <span className="sr-only"> (opens in a new tab)</span>}
          </Link>
          {isAccordionItem && (
            <button
              aria-expanded={isOpen}
              aria-label={`Toggle ${item.title}`}
              className="relative mr-1 inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-accent hover:text-foreground"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setIsOpen((open) => !open)
              }}
              type="button">
              <ChevronRight aria-hidden="true" className={cn('size-3 transition-transform', isOpen && 'rotate-90')} />
            </button>
          )}
        </div>
        {hasChildren &&
          (isAccordionItem ? (
            <AnimatedHeightCollapse open={isOpen}>
              <DocsSidebarNavItems
                accordionDefault={accordionDefault}
                depth={depth + 1}
                items={item.items ?? []}
                pathname={pathname}
              />
            </AnimatedHeightCollapse>
          ) : (
            <DocsSidebarNavItems
              accordionDefault={accordionDefault}
              depth={depth + 1}
              items={item.items ?? []}
              pathname={pathname}
            />
          ))}
      </li>
    )
  }

  return (
    <li>
      <div className="flex items-center">
        <span
          className={cn(
            'flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline',
            depth > 0 && 'px-3',
          )}>
          {item.title}
          {item.label && (
            <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-sm leading-none no-underline group-hover:no-underline">
              {item.label}
            </span>
          )}
        </span>
        {isAccordionItem && (
          <button
            aria-expanded={isOpen}
            aria-label={`Toggle ${item.title}`}
            className="relative mr-1 inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-accent hover:text-foreground"
            onClick={() => {
              setIsOpen((open) => !open)
            }}
            type="button">
            <ChevronRight aria-hidden="true" className={cn('size-3 transition-transform', isOpen && 'rotate-90')} />
          </button>
        )}
      </div>
      {hasChildren &&
        (isAccordionItem ? (
          <AnimatedHeightCollapse open={isOpen}>
            <DocsSidebarNavItems
              accordionDefault={accordionDefault}
              depth={depth + 1}
              items={item.items ?? []}
              pathname={pathname}
            />
          </AnimatedHeightCollapse>
        ) : (
          <DocsSidebarNavItems
            accordionDefault={accordionDefault}
            depth={depth + 1}
            items={item.items ?? []}
            pathname={pathname}
          />
        ))}
    </li>
  )
}

function AnimatedHeightCollapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        'grid transition-[grid-template-rows] duration-300 ease-(--gentleduck-motion-ease)',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
      inert={!open || undefined}>
      <div className={cn('overflow-hidden', !open && 'invisible')}>{children}</div>
    </div>
  )
}
