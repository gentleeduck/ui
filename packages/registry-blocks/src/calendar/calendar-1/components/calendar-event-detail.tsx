'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { EditIcon, StarIcon, Trash2Icon } from 'lucide-react'
import * as React from 'react'
import { CATEGORY_COLORS, CATEGORY_LABELS, type CalendarEvent } from '../calendar-data'
import { formatFullDate } from '../calendar-utils'

interface CalendarEventDetailProps { event: CalendarEvent | null; open: boolean; onOpenChange: (open: boolean) => void; onEdit: (event: CalendarEvent) => void; onDelete: (id: string) => void; children: React.ReactNode }

export function CalendarEventDetail({ event, open, onOpenChange, onEdit, onDelete, children }: CalendarEventDetailProps) {
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  React.useEffect(() => { if (!open) setConfirmDelete(false) }, [open])
  if (!event) return <>{children}</>
  const colors = CATEGORY_COLORS[event.category]

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <div className="flex flex-col gap-3">
          <div>
            <h4 className="font-semibold text-sm">{event.title}</h4>
            <p className="text-xs text-muted-foreground">{formatFullDate(event.date)}</p>
            <p className="text-xs text-muted-foreground">{event.time}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${colors.dot}`} />
            <span className="text-xs">{CATEGORY_LABELS[event.category]}</span>
            {event.starred && <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700"><StarIcon className="size-3 fill-amber-400" />Shared</span>}
          </div>
          <div className="flex items-center gap-2 border-t pt-3">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => { onEdit(event); onOpenChange(false) }}><EditIcon className="mr-1 size-3" />Edit</Button>
            {confirmDelete ? (
              <div className="flex flex-1 gap-1">
                <Button variant="destructive" size="sm" className="flex-1" onClick={() => { onDelete(event.id); onOpenChange(false) }}>Yes</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirmDelete(false)}>No</Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="flex-1 text-destructive" onClick={() => setConfirmDelete(true)}><Trash2Icon className="mr-1 size-3" />Delete</Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
