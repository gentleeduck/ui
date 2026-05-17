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
          <SidebarItem depth={0} item={item} key={getSidebarItemKey(item)} pathname={pathname} />
        ))}
      </div>
    )
  )
}

function SidebarItem({
  item,
  pathname,
  depth = 0,
}: {
  item: ISidebarNavItem
  pathname: string | null
  depth?: number
}) {
  const hasChildren = Boolean(item.items?.length)
  const isCollapsible = hasChildren && Boolean(item.collapsible)
  const isCurrent = Boolean(pathname && item.href && isPathCurrent(pathname, item.href))
  const isActiveBranch = hasActivePath(item, pathname)
  const isActive = isCurrent || (hasChildren && isActiveBranch)
  const [isOpen, setIsOpen] = React.useState(() => Boolean(item.defaultOpen))
  const linkRef = React.useRef<HTMLAnchorElement>(null)

  React.useEffect(() => {
    if (!isCurrent || !linkRef.current) return
    const scrollParent = linkRef.current.closest<HTMLElement>('[class*="overflow"]')
    if (!scrollParent) return
    const el = linkRef.current
    const scrollRect = scrollParent.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    if (elRect.top < scrollRect.top || elRect.bottom > scrollRect.bottom) {
      scrollParent.scrollTo({
        top: el.offsetTop - scrollParent.offsetTop - scrollParent.clientHeight / 2 + el.clientHeight / 2,
        behavior: 'smooth',
      })
    }
  }, [isCurrent])

  const toggle = isCollapsible ? (
    <button
      aria-expanded={isOpen}
      aria-label={`Toggle ${item.title}`}
      className="relative inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-accent hover:text-foreground"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen((o) => !o)
      }}
      type="button">
      <ChevronRight aria-hidden="true" className={cn('size-3 transition-transform', isOpen && 'rotate-90')} />
    </button>
  ) : null

  const childList = hasChildren ? (
    <AnimatedHeightCollapse open={!isCollapsible || isOpen}>
      {depth === 0 ? (
        <div className="border-l-2">
          <ul>
            {item.items?.map((child) => (
              <SidebarItem depth={1} item={child} key={getSidebarItemKey(child)} pathname={pathname} />
            ))}
          </ul>
        </div>
      ) : (
        <ul className="ml-3 border-l">
          {item.items?.map((child) => (
            <SidebarItem depth={depth + 1} item={child} key={getSidebarItemKey(child)} pathname={pathname} />
          ))}
        </ul>
      )}
    </AnimatedHeightCollapse>
  ) : null

  if (depth === 0) {
    return (
      <div className="mb-2 flex flex-col">
        <div className="flex h-9 w-full items-center justify-between pr-2 text-start font-semibold text-sm">
          {item.href ? (
            <Link
              aria-label={item.title || 'Section overview'}
              className="flex-1 hover:text-foreground"
              href={item.href}>
              {item.title || <span className="sr-only">Section overview</span>}
            </Link>
          ) : (
            <span className="flex-1">{item.title}</span>
          )}
          <div className="flex shrink-0 items-center gap-1">
            {item.label && (
              <span className="rounded-md px-1.5 py-0.5 font-normal text-muted-foreground text-xs leading-none">
                {item.label}
              </span>
            )}
            {toggle}
          </div>
        </div>
        {childList}
      </div>
    )
  }

  // Pull the active border out by the parent border width so it sits ON
  // TOP of the parent border instead of next to it. Depth-1 parent uses
  // border-l-2; deeper parents use border-l (1px).
  const activeOverlay = depth === 1 ? '-ml-0.5 border-primary border-l-2' : '-ml-px border-primary border-l'

  return (
    <li className={cn(isActive && activeOverlay)}>
      <div className="flex items-center">
        {item.href && !item.disabled ? (
          <Link
            ref={linkRef}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'group flex w-full items-center px-4 py-1 font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              depth > 1 && 'px-3',
              isActive ? 'text-foreground' : 'text-muted-foreground',
            )}
            href={item.href}
            rel={item.external ? 'noreferrer' : ''}
            scroll
            target={item.external ? '_blank' : ''}>
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-primary px-1.5 py-0.5 font-medium text-accent text-xs leading-none no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
            {item.external && <span className="sr-only"> (opens in a new tab)</span>}
          </Link>
        ) : (
          <span
            className={cn(
              'flex w-full cursor-not-allowed items-center px-4 py-1 text-muted-foreground text-sm',
              depth > 1 && 'px-3',
            )}>
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-xs leading-none">
                {item.label}
              </span>
            )}
          </span>
        )}
        {toggle && <div className="mr-1">{toggle}</div>}
      </div>
      {childList}
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

export { SidebarItem as DocsSidebarNavItem }
export function DocsSidebarNavItems({
  items,
  pathname,
  depth = 0,
}: {
  items: ISidebarNavItem[]
  pathname: string | null
  className?: string
  depth?: number
  accordionDefault?: boolean
}) {
  return (
    items?.length && (
      <ul className={cn(depth > 0 && 'ml-3 border-l')}>
        {items.map((item) => (
          <SidebarItem depth={depth} item={item} key={getSidebarItemKey(item)} pathname={pathname} />
        ))}
      </ul>
    )
  )
}
