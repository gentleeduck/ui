'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import { EditIcon, StarIcon, Trash2Icon } from 'lucide-react'
import * as React from 'react'
import { CATEGORY_COLORS, CATEGORY_LABELS, type CalendarEvent } from '../calendar-data'
import { formatFullDate } from '../calendar-utils'

interface CalendarEventDetailProps {
  event: CalendarEvent
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (id: string) => void
  children: React.ReactNode
}

export function CalendarEventDetail({ event, open, onOpenChange, onEdit, onDelete, children }: CalendarEventDetailProps) {
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  React.useEffect(() => { if (!open) setConfirmDelete(false) }, [open])

  const colors = CATEGORY_COLORS[event.category]

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="right" align="start" sideOffset={8}>
        {/* Colored top bar */}
        <div className={cn('h-2 rounded-t-md', colors.dot)} />
        <div className="flex flex-col gap-3 p-4">
          <div>
            <h4 className="font-semibold">{event.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{formatFullDate(event.date)}</p>
            <p className="text-xs text-muted-foreground">{event.time}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className={cn('size-2.5 rounded-full', colors.dot)} />
            <span className="text-sm">{CATEGORY_LABELS[event.category]}</span>
            {event.starred && (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <StarIcon className="size-3 fill-current" />
                Shared
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 border-t pt-3">
            <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => { onEdit(event); onOpenChange(false) }}>
              <EditIcon className="size-3.5" /> Edit
            </Button>
            {confirmDelete ? (
              <div className="flex flex-1 gap-1.5">
                <Button variant="destructive" size="sm" className="flex-1" onClick={() => { onDelete(event.id); onOpenChange(false) }}>Confirm</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2Icon className="size-3.5" /> Delete
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
