'use client'

import { buildCalendarYear, goToMonth, goToYear, NativeAdapter } from '@gentleduck/calendar'
import { cn } from '@gentleduck/libs/cn'
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { buttonVariants } from '../button'

const adapter = new NativeAdapter()

const ITEM_HEIGHT = 28
const VISIBLE_ITEMS = 7
const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS
const OVERSCAN = 3

// ---------------------------------------------------------------------------
// VirtualizedDropdown — shared by month and year
// ---------------------------------------------------------------------------

function VirtualizedDropdown({
  items,
  activeValue,
  onSelect,
  width,
}: {
  items: { value: string; label: string }[]
  activeValue: string
  onSelect: (value: string) => void
  width: string
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = React.useState(() => {
    const idx = items.findIndex((i) => i.value === activeValue)
    return Math.max(0, idx * ITEM_HEIGHT - LIST_HEIGHT / 2 + ITEM_HEIGHT / 2)
  })

  const totalHeight = items.length * ITEM_HEIGHT

  React.useLayoutEffect(() => {
    if (scrollRef.current) {
      const idx = items.findIndex((i) => i.value === activeValue)
      const target = Math.max(0, idx * ITEM_HEIGHT - LIST_HEIGHT / 2 + ITEM_HEIGHT / 2)
      scrollRef.current.scrollTop = target
    }
  }, [activeValue, items])

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN)
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + LIST_HEIGHT) / ITEM_HEIGHT) + OVERSCAN)

  return (
    <div
      ref={scrollRef}
      className={cn('overflow-y-auto rounded-md border bg-popover p-1 shadow-md', width)}
      style={{ height: LIST_HEIGHT, scrollBehavior: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {items.slice(startIndex, endIndex).map((item, i) => {
          const isActive = item.value === activeValue
          return (
            <button
              key={item.value}
              type="button"
              className={cn(
                'flex w-full cursor-default select-none items-center gap-2 rounded-sm ps-6 pe-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-accent font-medium text-accent-foreground',
              )}
              style={{
                position: 'absolute',
                top: (startIndex + i) * ITEM_HEIGHT,
                height: ITEM_HEIGHT,
                left: 0,
                right: 0,
              }}
              onClick={() => onSelect(item.value)}>
              {isActive && <CheckIcon className="absolute start-1.5 size-3.5" />}
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DropdownTrigger — shared trigger button
// ---------------------------------------------------------------------------

function DropdownTrigger({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onClick}
      className="flex h-7 w-auto min-w-0 items-center gap-1 rounded-md border px-2 font-medium text-sm shadow-xs">
      {label}
      <ChevronDownIcon className="size-3 text-muted-foreground" />
    </button>
  )
}

// ---------------------------------------------------------------------------
// CalendarHeader
// ---------------------------------------------------------------------------

interface CalendarHeaderProps {
  month: Date
  title: string
  direction: 'ltr' | 'rtl'
  locale?: string
  buttonVariant: string
  showDropdowns: boolean
  yearRange: { from: number; to: number }
  getNavProps: (dir: 'prev' | 'next') => { 'aria-label': string; disabled: boolean; onClick: () => void }
  getHeaderProps: () => { id: string; 'aria-live': 'polite' }
  onMonthSelect: (date: Date) => void
}

/** Prevents Select portal interactions from dismissing parent Popover. */
function stopPopoverDismiss(e: React.PointerEvent) {
  e.stopPropagation()
}

export function CalendarHeader({
  month,
  title,
  direction,
  locale,
  buttonVariant,
  showDropdowns,
  yearRange,
  getNavProps,
  getHeaderProps,
  onMonthSelect,
}: CalendarHeaderProps) {
  const headerProps = getHeaderProps()
  const currentYear = adapter.getYear(month)
  const currentMonth = adapter.getMonth(month)
  const [monthOpen, setMonthOpen] = React.useState(false)
  const [yearOpen, setYearOpen] = React.useState(false)

  const monthItems = React.useMemo(() => {
    const entries = buildCalendarYear(adapter, month, locale)
    return entries.map((e) => ({ value: String(e.month), label: e.label.slice(0, 3) }))
  }, [month, locale])

  const yearItems = React.useMemo(() => {
    const result: { value: string; label: string }[] = []
    for (let y = yearRange.from; y <= yearRange.to; y++) {
      result.push({ value: String(y), label: String(y) })
    }
    return result
  }, [yearRange.from, yearRange.to])

  const closeAll = () => {
    setMonthOpen(false)
    setYearOpen(false)
  }

  return (
    <div className="flex h-(--gentleduck-calendar-cell) w-full items-center justify-center px-(--gentleduck-calendar-cell)">
      <div className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
        <button
          type="button"
          {...getNavProps('prev')}
          className={cn(
            buttonVariants({ variant: buttonVariant as 'ghost' }),
            'size-(--gentleduck-calendar-cell) select-none p-0 aria-disabled:opacity-50',
          )}>
          <ChevronLeftIcon className={cn('size-4', direction === 'rtl' && 'rotate-180')} />
        </button>

        {showDropdowns ? (
          <div {...headerProps} className="flex items-center gap-1.5" onPointerDown={stopPopoverDismiss}>
            {/* Month dropdown */}
            <div className="relative">
              <DropdownTrigger
                label={adapter.format(month, { month: 'short' }, locale)}
                open={monthOpen}
                onClick={() => {
                  setMonthOpen((o) => !o)
                  setYearOpen(false)
                }}
              />
              {monthOpen && (
                <>
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is mouse-only */}
                  <div className="fixed inset-0 z-40" onClick={closeAll} />
                  <div className="absolute start-0 top-full z-50 mt-1">
                    <VirtualizedDropdown
                      items={monthItems}
                      activeValue={String(currentMonth)}
                      width="w-20"
                      onSelect={(v) => {
                        onMonthSelect(goToMonth(adapter, month, Number(v)))
                        setMonthOpen(false)
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Year dropdown */}
            <div className="relative">
              <DropdownTrigger
                label={String(currentYear)}
                open={yearOpen}
                onClick={() => {
                  setYearOpen((o) => !o)
                  setMonthOpen(false)
                }}
              />
              {yearOpen && (
                <>
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is mouse-only */}
                  <div className="fixed inset-0 z-40" onClick={closeAll} />
                  <div className="absolute end-0 top-full z-50 mt-1">
                    <VirtualizedDropdown
                      items={yearItems}
                      activeValue={String(currentYear)}
                      width="w-20"
                      onSelect={(v) => {
                        onMonthSelect(goToYear(adapter, month, Number(v)))
                        setYearOpen(false)
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div {...headerProps} className="select-none font-medium text-sm">
            {title}
          </div>
        )}

        <button
          type="button"
          {...getNavProps('next')}
          className={cn(
            buttonVariants({ variant: buttonVariant as 'ghost' }),
            'size-(--gentleduck-calendar-cell) select-none p-0 aria-disabled:opacity-50',
          )}>
          <ChevronRightIcon className={cn('size-4', direction === 'rtl' && 'rotate-180')} />
        </button>
      </div>
    </div>
  )
}

CalendarHeader.displayName = 'CalendarHeader'
