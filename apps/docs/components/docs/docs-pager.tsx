import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { NavItem, NavItemWithChildren } from 'types/nav'
import { docsConfig } from '~/config/docs'
import { Docs } from '../../.velite'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface DocsPagerProps {
  doc: Docs
}

export function DocsPagerBottom({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc)

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Link
          href={pager.prev.href}
          className={cn(
            buttonVariants({
              variant: 'outline',
              className: 'items-center flex ',
            }),
          )}>
          <ChevronLeftIcon className="mr-2 size-4" />
          <span>{pager.prev.title}</span>
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          href={pager.next.href}
          className={cn(
            buttonVariants({
              variant: 'outline',
              className: 'items-center flex ',
            }),
          )}>
          <span>{pager.next.title}</span>
          <ChevronRightIcon className="ml-2 size-4" />
        </Link>
      )}
    </div>
  )
}
export function DocsPagerTop({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc)

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Link
          href={pager.prev.href}
          className={cn(
            buttonVariants({
              size: 'sm',
              variant: 'secondary',
              className: 'items-center [&>svg]:!size-4 size-8',
            }),
          )}>
          <ArrowLeft />
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          href={pager.next.href}
          className={cn(
            buttonVariants({
              variant: 'secondary',
              size: 'sm',
              className: 'items-center [&>svg]:!size-4 size-8 ml-2',
            }),
          )}>
          <ArrowRight />
        </Link>
      )}
    </div>
  )
}

export function getPagerForDoc(doc: Docs) {
  const nav = doc.title.startsWith('/docs/charts') ? docsConfig.chartsNav : docsConfig.sidebarNav
  const flattenedLinks = [null, ...flatten(nav), null]
  const activeIndex = flattenedLinks.findIndex((link) => link?.href?.includes(doc.slug ?? doc.title))
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next = activeIndex !== flattenedLinks.length - 1 ? flattenedLinks[activeIndex + 1] : null
  return {
    prev,
    next,
  }
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links
    .reduce<NavItem[]>((flat, link) => {
      return flat.concat(link.items?.length ? flatten(link.items) : link)
    }, [])
    .filter((link) => !link?.disabled)
}
