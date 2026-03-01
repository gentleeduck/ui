'use client'

import type { TocEntry } from '@duck-docs/context'
import { useMounted } from '@duck-docs/hooks/use-mounted'
import { cn } from '@gentleduck/libs/cn'
import { BookOpenText } from 'lucide-react'
import * as React from 'react'

// -- Types -------------------------------------------------------------------

interface TocProps {
  toc: TocEntry[]
}

interface FlatTocItem {
  url: string
  title: string
  depth: number
}

// -- Helpers -----------------------------------------------------------------

function flattenToc(toc: TocEntry[], depth = 1): FlatTocItem[] {
  const result: FlatTocItem[] = []
  for (const entry of toc) {
    result.push({ url: entry.url, title: entry.title, depth })
    if (entry.items && depth < 2) {
      result.push(...flattenToc(entry.items, depth + 1))
    }
  }
  return result
}

function lineOffset(depth: number): number {
  return depth >= 2 ? 12 : 0
}

function itemPadding(depth: number): number {
  return depth >= 2 ? 28 : 16
}

// -- Hooks -------------------------------------------------------------------

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
      { rootMargin: '0% 0% -80% 0%' },
    )

    itemIds?.forEach((id) => {
      if (!id) return
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      itemIds?.forEach((id) => {
        if (!id) return
        const element = document.getElementById(id)
        if (element) observer.unobserve(element)
      })
    }
  }, [itemIds])

  return activeId
}

function useTocThumb(containerRef: React.RefObject<HTMLDivElement | null>, activeItem: string): [number, number] {
  const [pos, setPos] = React.useState<[number, number]>([0, 0])

  React.useEffect(() => {
    const container = containerRef.current
    if (!activeItem || !container || container.clientHeight === 0) {
      setPos([0, 0])
      return
    }

    const el = container.querySelector<HTMLElement>(`a[href="#${activeItem}"]`)
    if (!el) {
      setPos([0, 0])
      return
    }

    const styles = getComputedStyle(el)
    const top = el.offsetTop + parseFloat(styles.paddingTop)
    const bottom = el.offsetTop + el.clientHeight - parseFloat(styles.paddingBottom)
    setPos([top, bottom - top])
  }, [activeItem, containerRef])

  return pos
}

function useTocSvg(containerRef: React.RefObject<HTMLDivElement | null>, items: FlatTocItem[]) {
  const [svg, setSvg] = React.useState<{ path: string; width: number; height: number } | null>(null)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || container.clientHeight === 0) return

    function compute() {
      if (!container) return
      let w = 0
      let h = 0
      const d: string[] = []
      let previousOffset = 0
      let previousBottom = 0
      let hasStarted = false

      for (const item of items) {
        const el = container.querySelector<HTMLElement>(`a[href="${item.url}"]`)
        if (!el) continue

        const styles = getComputedStyle(el)
        const offset = lineOffset(item.depth) + 1
        const top = el.offsetTop + parseFloat(styles.paddingTop)
        const bottom = el.offsetTop + el.clientHeight - parseFloat(styles.paddingBottom)

        w = Math.max(offset, w)
        h = Math.max(h, bottom)

        if (!hasStarted) {
          d.push(`M${offset} ${top}`)
          d.push(`L${offset} ${bottom}`)
          hasStarted = true
        } else {
          // Connect stacked items (including depth changes) with one continuous path.
          if (top !== previousBottom || offset !== previousOffset) {
            d.push(`L${offset} ${top}`)
          }
          d.push(`L${offset} ${bottom}`)
        }

        previousOffset = offset
        previousBottom = bottom
      }

      setSvg(d.length > 0 ? { path: d.join(' '), width: w + 1, height: h } : null)
    }

    const observer = new ResizeObserver(compute)
    compute()
    observer.observe(container)
    return () => observer.disconnect()
  }, [items])

  return svg
}

// -- Skeleton ----------------------------------------------------------------

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
          <div className="h-3.5 animate-pulse rounded-full bg-muted/70" style={{ width: item.width }} />
        </li>
      ))}
    </ul>
  )
}

// -- TocTree -----------------------------------------------------------------

function TocTree({ items, activeItem }: { items: FlatTocItem[]; activeItem: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const thumb = useTocThumb(containerRef, activeItem)
  const svg = useTocSvg(containerRef, items)

  return (
    <div ref={containerRef} className="relative">
      {/* Shared SVG track for smoother joins and anti-aliased rendering */}
      {svg ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute start-0 top-0"
          height={svg.height}
          style={{ width: svg.width }}
          viewBox={`0 0 ${svg.width} ${svg.height}`}
          width={svg.width}>
          <path
            d={svg.path}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            className="text-muted-foreground/20"
          />
        </svg>
      ) : null}

      {/* Link labels */}
      {items.map((item, i) => {
        return (
          <a
            key={i}
            href={item.url}
            className={cn(
              'relative block py-1.5 no-underline transition-colors [overflow-wrap:anywhere]',
              item.url === `#${activeItem}`
                ? 'font-medium text-primary'
                : 'text-muted-foreground text-sm hover:text-foreground',
            )}
            style={{ paddingInlineStart: `${itemPadding(item.depth)}px` }}>
            {item.title}
          </a>
        )
      })}

      {/* Active highlight -- masked by the SVG path */}
      {svg ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute start-0 top-0"
          style={{
            width: svg.width,
            height: svg.height,
            maskImage: `url("data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg.width} ${svg.height}"><path d="${svg.path}" stroke="black" stroke-width="2" fill="none" /></svg>`,
            )}")`,
          }}>
          <div
            className="bg-primary transition-all duration-300 ease-out"
            style={{
              marginTop: thumb[0],
              height: thumb[1],
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

// -- Main component ----------------------------------------------------------

export function DashboardTableOfContents({ toc }: TocProps) {
  const flatItems = React.useMemo(() => flattenToc(toc), [toc])
  const itemIds = React.useMemo(() => flatItems.map((item) => item.url.split('#')[1]).filter(Boolean), [flatItems])
  const activeHeading = useActiveItem(itemIds)
  const mounted = useMounted()

  if (!toc.length) return null

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 items-center gap-2">
        <BookOpenText aria-hidden="true" className="size-4" />
        <p className="font-medium">On This Page</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {mounted ? <TocTree activeItem={activeHeading} items={flatItems} /> : <TocSkeleton toc={toc} />}
      </div>
    </div>
  )
}
