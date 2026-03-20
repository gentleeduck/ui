'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@gentleduck/registry-ui/dropdown-menu'
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon } from 'lucide-react'
import type { CalendarView } from '../calendar-data'
import { formatViewHeading, formatViewSubheading } from '../calendar-utils'

interface CalendarToolbarProps {
  viewedDate: Date; calendarView: CalendarView
  onPrev: () => void; onNext: () => void; onToday: () => void
  onViewChange: (view: CalendarView) => void; onAddEvent: () => void
}

const VIEW_LABELS: Record<CalendarView, string> = { month: 'Month view', week: 'Week view', day: 'Day view', year: 'Year view' }

export function CalendarToolbar({ viewedDate, calendarView, onPrev, onNext, onToday, onViewChange, onAddEvent }: CalendarToolbarProps) {
  const today = new Date()
  const todayMonth = today.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const todayDay = today.getDate()
  const sub = formatViewSubheading(viewedDate, calendarView)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center rounded-lg border px-3 py-1.5">
          <span className="text-[10px] font-bold leading-tight text-primary">{todayMonth}</span>
          <span className="text-lg font-bold leading-tight">{todayDay}</span>
        </div>
        <div>
          <h2 className="font-semibold text-lg">{formatViewHeading(viewedDate, calendarView)}</h2>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button variant="ghost" size="icon" className="size-8"><SearchIcon className="size-4" /></Button>
        <Button variant="outline" size="icon" className="size-8" onClick={onPrev} aria-label="Previous"><ChevronLeftIcon className="size-4" /></Button>
        <Button variant="outline" size="sm" onClick={onToday} aria-label="Go to today">Today</Button>
        <Button variant="outline" size="icon" className="size-8" onClick={onNext} aria-label="Next"><ChevronRightIcon className="size-4" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm"><CalendarIcon className="mr-1.5 size-3.5" />{VIEW_LABELS[calendarView]}<ChevronDownIcon className="ml-1 size-3" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewChange('day')}>Day view</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('week')}>Week view</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('month')}>Month view</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('year')}>Year view</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" onClick={onAddEvent}><PlusIcon className="mr-1.5 size-3.5" />Add event</Button>
      </div>
    </div>
  )
}
