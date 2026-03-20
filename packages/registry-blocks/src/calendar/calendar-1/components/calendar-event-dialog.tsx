'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@gentleduck/registry-ui/dialog'
import { Input } from '@gentleduck/registry-ui/input'
import { Label } from '@gentleduck/registry-ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui/select'
import * as React from 'react'
import { CATEGORY_COLORS, CATEGORY_LABELS, type CalendarEvent, type EventCategory } from '../calendar-data'
import { formatDateString, parseTimeToMinutes } from '../calendar-utils'

interface CalendarEventDialogProps { open: boolean; onOpenChange: (open: boolean) => void; onSave: (event: CalendarEvent) => void; editingEvent: CalendarEvent | null; defaultDate: string | null }

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[]

export function CalendarEventDialog({ open, onOpenChange, onSave, editingEvent, defaultDate }: CalendarEventDialogProps) {
  const [title, setTitle] = React.useState('')
  const [date, setDate] = React.useState('')
  const [time, setTime] = React.useState('9:00 AM')
  const [category, setCategory] = React.useState<EventCategory>('other')
  const [starred, setStarred] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      if (editingEvent) { setTitle(editingEvent.title); setDate(editingEvent.date); setTime(editingEvent.time); setCategory(editingEvent.category); setStarred(editingEvent.starred ?? false) }
      else { setTitle(''); setDate(defaultDate ?? formatDateString(new Date())); setTime('9:00 AM'); setCategory('other'); setStarred(false) }
    }
  }, [open, editingEvent, defaultDate])

  function handleSave() {
    if (!title.trim() || !date) return
    onSave({ id: editingEvent?.id ?? crypto.randomUUID(), title: title.trim(), date, time, timeValue: parseTimeToMinutes(time), category, starred: starred || undefined })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2"><Label htmlFor="evt-title">Title</Label><Input id="evt-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" /></div>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2"><Label htmlFor="evt-date">Date</Label><Input id="evt-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="flex flex-1 flex-col gap-2"><Label htmlFor="evt-time">Time</Label><Input id="evt-time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="9:00 AM" /></div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}><span className="flex items-center gap-2"><span className={`size-2 rounded-full ${CATEGORY_COLORS[cat].dot}`} />{CATEGORY_LABELS[cat]}</span></SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={starred} onChange={(e) => setStarred(e.target.checked)} className="rounded" />External / Shared event</label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim() || !date}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
