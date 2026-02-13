'use client'

import { type DocsConfig, useDocsConfig } from '@duck-docs/context'
import type { NavItem, NavItemWithChildren } from '@duck-docs/types/nav'
import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui-duckui/button'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface DocsPagerProps {
  doc: {
    slug?: string
    title: string
  }
}

export function DocsPagerBottom({ doc }: DocsPagerProps) {
  const docsConfig = useDocsConfig()
  const pager = getPagerForDoc(doc, docsConfig)

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Link
          className={cn(
            buttonVariants({
              className: 'flex items-center',
              variant: 'outline',
            }),
          )}
          href={pager.prev.href}
          scroll>
          <ChevronLeft className="mr-2 size-4" />
          <span>{pager.prev.title}</span>
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          className={cn(
            buttonVariants({
              className: 'flex items-center',
              variant: 'outline',
            }),
          )}
          href={pager.next.href}
          scroll>
          <span>{pager.next.title}</span>
          <ChevronRight className="ml-2 size-4" />
        </Link>
      )}
    </div>
  )
}
export function DocsPagerTop({ doc }: DocsPagerProps) {
  const docsConfig = useDocsConfig()
  const pager = getPagerForDoc(doc, docsConfig)

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Link
          className={cn(
            buttonVariants({
              className: '[&>svg]:!size-4 size-8 items-center',
              size: 'sm',
              variant: 'secondary',
            }),
          )}
          href={pager.prev.href}
          scroll>
          <ArrowLeft />
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          className={cn(
            buttonVariants({
              className: '[&>svg]:!size-4 ml-2 size-8 items-center',
              size: 'sm',
              variant: 'secondary',
            }),
          )}
          href={pager.next.href}
          scroll>
          <ArrowRight />
        </Link>
      )}
    </div>
  )
}

export function getPagerForDoc(doc: DocsPagerProps['doc'], docsConfig: DocsConfig) {
  const nav = doc.title.startsWith('/docs/charts') ? docsConfig.chartsNav : docsConfig.sidebarNav
  const flattenedLinks = [null, ...flatten(nav ?? []), null]
  const activeIndex = flattenedLinks.findIndex((link) => link?.href?.includes(doc.slug ?? doc.title))
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next = activeIndex !== flattenedLinks.length - 1 ? flattenedLinks[activeIndex + 1] : null
  return {
    next,
    prev,
  }
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links
    .reduce<NavItem[]>((flat, link) => {
      return flat.concat(link.items?.length ? flatten(link.items) : link)
    }, [])
    .filter((link) => !link?.disabled)
}
