'use client'

import type { TocEntry } from '@duck-docs/context'
import { useMounted } from '@duck-docs/hooks/use-mounted'
import { cn } from '@gentleduck/libs/cn'
import { BookOpenText } from 'lucide-react'
import * as React from 'react'

interface TocProps {
  toc: TocEntry[]
}

function TocSkeleton({ toc }: TocProps) {
  const skeletonItems = React.useMemo(() => {
    const items: { level: number; width: string }[] = []
    for (const entry of toc) {
      const chars = entry.title.length
      items.push({ level: 1, width: `${Math.min(Math.max(chars * 8, 80), 200)}px` })
      if (entry.items) {
        for (const sub of entry.items) {
          const subChars = sub.title.length
          items.push({ level: 2, width: `${Math.min(Math.max(subChars * 7, 64), 160)}px` })
        }
      }
    }
    return items
  }, [toc])

  return (
    <ul className="m-0 list-none">
      {skeletonItems.map((item, i) => (
        <li key={i} className={cn('mt-0 pt-2', { 'pl-4': item.level > 1 })}>
          <div
            className="h-3.5 animate-pulse rounded-full bg-muted/70"
            style={{ width: item.width }}
          />
        </li>
      ))}
    </ul>
  )
}

export function DashboardTableOfContents({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () =>
      toc
        ? toc
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split('#')[1])
        : [],
    [toc],
  )
  const activeHeading = useActiveItem(itemIds)
  const mounted = useMounted()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 items-center gap-2">
        <BookOpenText aria-hidden="true" className="size-4" />
        <p className="font-medium">On This Page</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {mounted ? <Tree activeItem={activeHeading} tree={toc} /> : <TocSkeleton toc={toc} />}
      </div>
    </div>
  )
}

function useActiveItem(itemIds: (string | undefined)[]) {
  const [activeId, setActiveId] = React.useState<string>('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` },
    )

    itemIds?.forEach((id) => {
      if (!id) {
        return
      }

      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      itemIds?.forEach((id) => {
        if (!id) {
          return
        }

        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [itemIds])

  return activeId
}

interface TreeProps {
  tree: TocEntry[]
  level?: number
  activeItem?: string | null
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree.length && level < 3 ? (
    <ul className={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
      {tree.map((item, index) => {
        return (
          <li className={cn('mt-0 pt-2')} key={index}>
            <a
              className={cn(
                'inline-block no-underline transition-colors hover:text-foreground',
                item.url === `#${activeItem}` ? 'font-medium text-primary' : 'text-muted-foreground text-sm',
              )}
              href={item.url}>
              {item.title}
            </a>
            {item.items?.length ? <Tree activeItem={activeItem} level={level + 1} tree={item.items} /> : null}
          </li>
        )
      })}
    </ul>
  ) : null
}
