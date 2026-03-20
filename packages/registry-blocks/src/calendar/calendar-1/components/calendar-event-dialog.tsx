'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import { Calendar } from '@gentleduck/registry-ui/calendar'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@gentleduck/registry-ui/dialog'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { CATEGORY_COLORS, CATEGORY_LABELS, type CalendarEvent, type EventCategory } from '../calendar-data'
import { formatDateString, parseTimeToMinutes } from '../calendar-utils'

interface CalendarEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (event: CalendarEvent) => void
  editingEvent: CalendarEvent | null
  defaultDate: string | null
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[]

function parseDateStr(s: string): Date | undefined {
  if (!s) return undefined
  const d = new Date(s + 'T00:00:00')
  return Number.isNaN(d.getTime()) ? undefined : d
}

export function CalendarEventDialog({ open, onOpenChange, onSave, editingEvent, defaultDate }: CalendarEventDialogProps) {
  const [title, setTitle] = React.useState('')
  const [date, setDate] = React.useState('')
  const [time, setTime] = React.useState('9:00 AM')
  const [category, setCategory] = React.useState<EventCategory>('other')
  const [starred, setStarred] = React.useState(false)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      if (editingEvent) {
        setTitle(editingEvent.title)
        setDate(editingEvent.date)
        setTime(editingEvent.time)
        setCategory(editingEvent.category)
        setStarred(editingEvent.starred ?? false)
      } else {
        setTitle('')
        setDate(defaultDate ?? formatDateString(new Date()))
        setTime('9:00 AM')
        setCategory('other')
        setStarred(false)
      }
    }
  }, [open, editingEvent, defaultDate])

  function handleSave() {
    if (!title.trim() || !date) return
    onSave({
      id: editingEvent?.id ?? crypto.randomUUID(),
      title: title.trim(),
      date,
      time,
      timeValue: parseTimeToMinutes(time),
      category,
      starred: starred || undefined,
    })
    onOpenChange(false)
  }

  const selectedDate = parseDateStr(date)
  const displayDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Pick a date'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="evt-title">Title</Label>
            <Input id="evt-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
          </div>

          <div className="flex gap-4">
            {/* Date picker with Calendar popover */}
            <div className="flex flex-1 flex-col gap-2">
              <Label>Date</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-between font-normal', !date && 'text-muted-foreground')}>
                    <span className="flex items-center gap-2">
                      <CalendarIcon className="size-3.5" />
                      {displayDate}
                    </span>
                    <ChevronDownIcon className="size-3.5 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    onSelect={(d) => {
                      if (d) setDate(formatDateString(d))
                      setDatePickerOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time input */}
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="evt-time">Time</Label>
              <Input id="evt-time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="9:00 AM" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${CATEGORY_COLORS[cat].dot}`} />
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={starred} onChange={(e) => setStarred(e.target.checked)} className="rounded" />
            External / Shared event
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim() || !date}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
