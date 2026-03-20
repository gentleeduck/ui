'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@gentleduck/registry-ui/dropdown-menu'
import { Input } from '@gentleduck/registry-ui/input'
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react'
import * as React from 'react'
import type { CalendarView } from '../calendar-data'
import { formatDateRange, formatMonthYear } from '../calendar-utils'

interface CalendarToolbarProps {
  viewedMonth: Date; calendarView: CalendarView; searchQuery: string
  onPrevMonth: () => void; onNextMonth: () => void; onToday: () => void
  onViewChange: (view: CalendarView) => void; onSearchChange: (query: string) => void; onAddEvent: () => void
}

const VIEW_LABELS: Record<CalendarView, string> = { month: 'Month view', week: 'Week view', day: 'Day view' }

export function CalendarToolbar({ viewedMonth, calendarView, searchQuery, onPrevMonth, onNextMonth, onToday, onViewChange, onSearchChange, onAddEvent }: CalendarToolbarProps) {
  const [showSearch, setShowSearch] = React.useState(false)
  const today = new Date()
  const todayMonth = today.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const todayDay = today.getDate()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center rounded-lg border px-3 py-1">
          <span className="text-[10px] font-bold leading-tight text-muted-foreground">{todayMonth}</span>
          <span className="text-lg font-bold leading-tight">{todayDay}</span>
        </div>
        <div>
          <h2 className="font-semibold text-lg">{formatMonthYear(viewedMonth)}</h2>
          <p className="text-xs text-muted-foreground">{formatDateRange(viewedMonth)}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {showSearch ? (
          <div className="flex items-center gap-1">
            <Input value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search events..." className="h-8 w-48" autoFocus />
            <Button variant="ghost" size="icon" className="size-8" onClick={() => { setShowSearch(false); onSearchChange('') }}><XIcon className="size-4" /></Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setShowSearch(true)}><SearchIcon className="size-4" /></Button>
        )}
        <Button variant="outline" size="icon" className="size-8" onClick={onPrevMonth} aria-label="Previous month"><ChevronLeftIcon className="size-4" /></Button>
        <Button variant="outline" size="sm" onClick={onToday} aria-label="Go to today">Today</Button>
        <Button variant="outline" size="icon" className="size-8" onClick={onNextMonth} aria-label="Next month"><ChevronRightIcon className="size-4" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm"><CalendarIcon className="mr-1 size-3.5" />{VIEW_LABELS[calendarView]}<ChevronDownIcon className="ml-1 size-3" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewChange('month')}>Month view</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('week')}>Week view</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('day')}>Day view</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" onClick={onAddEvent}><PlusIcon className="mr-1 size-3.5" />Add event</Button>
      </div>
    </div>
  )
}
