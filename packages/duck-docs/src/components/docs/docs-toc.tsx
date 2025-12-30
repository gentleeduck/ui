'use client'

import type { TocEntry } from '@duck-docs/context'
import { useMounted } from '@duck-docs/hooks/use-mounted'
import { cn } from '@gentleduck/libs/cn'
import * as React from 'react'

interface TocProps {
  toc: TocEntry[]
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

  return mounted ? (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <Tree activeItem={activeHeading} tree={toc} />
    </div>
  ) : null
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
                'inline-block no-underline',
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
