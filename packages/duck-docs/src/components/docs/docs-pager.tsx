'use client'

import { type IDocsConfig, useDocsConfig } from '@duck-docs/context'
import type { INavItem, INavItemWithChildren } from '@duck-docs/types/nav'
import { cn } from '@gentleduck/libs/cn'
import { buttonVariants } from '@gentleduck/registry-ui/button'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface IDocsPagerProps {
  doc: {
    slug?: string
    title: string
  }
}

export function DocsPagerBottom({ doc }: IDocsPagerProps) {
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
          <ChevronLeft aria-hidden="true" className="mr-2 size-4" />
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
          <ChevronRight aria-hidden="true" className="ml-2 size-4" />
        </Link>
      )}
    </div>
  )
}
export function DocsPagerTop({ doc }: IDocsPagerProps) {
  const docsConfig = useDocsConfig()
  const pager = getPagerForDoc(doc, docsConfig)

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Link
          aria-label={`Previous: ${pager.prev.title}`}
          className={cn(
            buttonVariants({
              className: '[&>svg]:!size-4 size-8 items-center md:size-7',
              size: 'sm',
              variant: 'secondary',
            }),
          )}
          href={pager.prev.href}
          scroll>
          <ArrowLeft aria-hidden="true" />
        </Link>
      )}
      {pager?.next?.href && (
        <Link
          aria-label={`Next: ${pager.next.title}`}
          className={cn(
            buttonVariants({
              className: '[&>svg]:!size-4 ml-2 size-8 items-center md:size-7',
              size: 'sm',
              variant: 'secondary',
            }),
          )}
          href={pager.next.href}
          scroll>
          <ArrowRight aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export function getPagerForDoc(doc: IDocsPagerProps['doc'], docsConfig: IDocsConfig) {
  const allNav = [...(docsConfig.sidebarNav ?? []), ...(docsConfig.chartsNav ?? [])]
  const flattenedLinks = [null, ...flatten(allNav), null]

  // Normalize slug: ensure leading /, strip trailing /index
  const normalizedSlug = `/${doc.slug ?? ''}`.replace(/\/+/g, '/').replace(/\/index$/, '')

  const activeIndex = flattenedLinks.findIndex((link) => {
    if (!link?.href) return false
    return link.href.replace(/\/index$/, '') === normalizedSlug
  })

  const prev = activeIndex > 0 ? flattenedLinks[activeIndex - 1] : null
  const next = activeIndex < flattenedLinks.length - 1 ? flattenedLinks[activeIndex + 1] : null
  return {
    next,
    prev,
  }
}

/** @internal */
export function flatten(links: INavItemWithChildren[]): INavItem[] {
  return links
    .reduce<INavItem[]>((flat, link) => {
      if (link.items?.length) {
        // Include the parent itself if it has an href (it's a real page), then flatten children
        return flat.concat(link.href ? [link] : [], flatten(link.items))
      }
      return flat.concat(link)
    }, [])
    .filter((link) => !link?.disabled)
}
