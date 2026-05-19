'use client'

import { NativeAdapter } from '@gentleduck/calendar'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import { XIcon } from 'lucide-react'
import * as React from 'react'

const adapter = new NativeAdapter()

function daysBetween(a: Date, b: Date): Date[] {
  const start = adapter.isBefore(a, b) ? a : b
  const end = adapter.isBefore(a, b) ? b : a
  const days: Date[] = []
  for (let d = adapter.fromDate(start); !adapter.isAfter(d, end); d = adapter.addDays(d, 1)) {
    days.push(d)
  }
  return days
}

function hasDate(dates: Date[], target: Date) {
  return dates.some((d) => adapter.isSameDay(d, target))
}

function getPosition(dates: Date[], target: Date) {
  if (!hasDate(dates, target)) return 'none' as const
  const hasPrev = hasDate(dates, adapter.addDays(target, -1))
  const hasNext = hasDate(dates, adapter.addDays(target, 1))
  if (hasPrev && hasNext) return 'middle' as const
  if (hasPrev) return 'end' as const
  if (hasNext) return 'start' as const
  return 'single' as const
}

const MS_PER_DAY = 86_400_000

function getRanges(dates: Date[]): { from: Date; to: Date }[] {
  if (dates.length === 0) return []
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime())
  const ranges: { from: Date; to: Date }[] = []
  const first = sorted[0]
  if (!first) return []
  let from = first
  let to = first
  for (let i = 1; i < sorted.length; i++) {
    const d = sorted[i]
    if (!d) continue
    if (d.getTime() - to.getTime() <= MS_PER_DAY) {
      to = d
    } else {
      ranges.push({ from, to })
      from = d
      to = d
    }
  }
  ranges.push({ from, to })
  return ranges
}

function findOwnerRange(ranges: { from: Date; to: Date }[], date: Date) {
  return ranges.find((r) => !adapter.isBefore(date, r.from) && !adapter.isAfter(date, r.to))
}

export default function Demo() {
  const [dates, setDates] = React.useState<Date[]>([])
  const [anchor, setAnchor] = React.useState<Date | null>(null)
  const shiftRef = React.useRef(false)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      shiftRef.current = e.shiftKey
    }
    document.addEventListener('keydown', handler)
    document.addEventListener('keyup', handler)
    return () => {
      document.removeEventListener('keydown', handler)
      document.removeEventListener('keyup', handler)
    }
  }, [])

  const ranges = getRanges(dates)

  const removeDate = (target: Date) => setDates((prev) => prev.filter((d) => !adapter.isSameDay(d, target)))

  const removeRange = (r: { from: Date; to: Date }) => {
    const days = daysBetween(r.from, r.to)
    setDates((prev) => prev.filter((d) => !days.some((rd) => adapter.isSameDay(rd, d))))
  }

  const handleClick = (date: Date) => {
    const selected = hasDate(dates, date)
    const pos = getPosition(dates, date)
    const isShift = shiftRef.current

    if (isShift && selected && pos === 'middle') {
      const owner = findOwnerRange(ranges, date)
      if (owner) {
        const len = daysBetween(owner.from, owner.to).length
        if (len > 3) {
          removeDate(date)
          setAnchor(null)
        }
      }
      return
    }

    if (anchor && adapter.isSameDay(date, anchor)) {
      removeDate(date)
      setAnchor(null)
      return
    }

    if (selected && !isShift) {
      setAnchor(null)

      if (pos === 'start' || pos === 'end') {
        const owner = findOwnerRange(ranges, date)
        if (owner) removeRange(owner)
        return
      }

      if (pos === 'single') {
        removeDate(date)
        return
      }

      // trim middle: keep from..clicked, drop the rest
      if (pos === 'middle') {
        const owner = findOwnerRange(ranges, date)
        if (owner) {
          const toRemove = daysBetween(adapter.addDays(date, 1), owner.to)
          setDates((prev) => prev.filter((d) => !toRemove.some((rd) => adapter.isSameDay(rd, d))))
        }
        return
      }
    }

    if (anchor) {
      const range = daysBetween(anchor, date)
      setDates((prev) => {
        const merged = [...prev]
        for (const d of range) {
          if (!hasDate(merged, d)) merged.push(d)
        }
        return merged
      })
      setAnchor(null)
      return
    }

    setDates((prev) => [...prev, date])
    setAnchor(date)
  }

  return (
    <div className="flex rounded-md border shadow-sm">
      <Calendar
        className="shrink-0"
        mode="single"
        selected={null}
        showDropdowns={false}
        onSelect={(clicked) => {
          if (!clicked) return
          handleClick(clicked as Date)
        }}
        renderDay={(day, children) => {
          const pos = getPosition(dates, day.date)
          const isAnchorDay = anchor !== null && adapter.isSameDay(day.date, anchor)

          if (pos === 'none') return children

          const styles = {
            single: 'rounded-md bg-primary text-primary-foreground',
            start: 'rounded-s-md bg-primary text-primary-foreground',
            end: 'rounded-e-md bg-primary text-primary-foreground',
            middle: 'bg-accent text-accent-foreground',
          }

          return (
            <span
              className={[
                'flex size-full items-center justify-center',
                styles[pos],
                isAnchorDay && 'ring-2 ring-ring ring-offset-1 ring-offset-background',
              ]
                .filter(Boolean)
                .join(' ')}>
              {children}
            </span>
          )
        }}
      />
      <div className="flex max-h-[340px] min-w-[180px] flex-col gap-2 border-s p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">
            {dates.length > 0 ? `${dates.length} day${dates.length !== 1 ? 's' : ''}` : 'No selection'}
          </h3>
          {dates.length > 0 && (
            <button
              type="button"
              className="text-muted-foreground text-xs hover:text-foreground"
              onClick={() => {
                setDates([])
                setAnchor(null)
              }}>
              Clear
            </button>
          )}
        </div>

        {ranges.length > 0 && (
          <div className="max-h-[182px] space-y-1.5 overflow-y-auto">
            {ranges.map((r) => {
              const days = daysBetween(r.from, r.to)
              const label = adapter.isSameDay(r.from, r.to)
                ? adapter.format(r.from, { month: 'short', day: 'numeric' })
                : `${adapter.format(r.from, { month: 'short', day: 'numeric' })} - ${adapter.format(r.to, { month: 'short', day: 'numeric' })}`
              return (
                <div
                  key={r.from.getTime()}
                  className="flex items-center justify-between rounded-md border bg-muted/50 px-2.5 py-1.5">
                  <div>
                    <p className="font-medium text-xs">{label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {days.length} day{days.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-sm p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => removeRange(r)}>
                    <XIcon className="size-3" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <p className="mt-auto text-[11px] text-muted-foreground leading-tight">
          Click to start, click again to complete. Click start/end to remove range. Click middle to trim.{' '}
          <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">⇧</kbd> click to split.
        </p>
      </div>
    </div>
  )
}
