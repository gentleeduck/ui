'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui/popover'
import {
  ClockIcon,
  EditIcon,
  ExternalLinkIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  StarIcon,
  Trash2Icon,
  UsersIcon,
} from 'lucide-react'
import * as React from 'react'
import { CATEGORY_COLORS, CATEGORY_LABELS, type CalendarEvent } from '../calendar-data'
import { formatFullDate } from '../calendar-utils'

interface ICalendarEventDetailProps {
  event: CalendarEvent
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (id: string) => void
  children: React.ReactNode
}

export function CalendarEventDetail({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  children,
}: ICalendarEventDetailProps) {
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  React.useEffect(() => {
    if (!open) setConfirmDelete(false)
  }, [open])

  const colors = CATEGORY_COLORS[event.category]

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96 p-0 shadow-lg" side="right" align="start" sideOffset={8}>
        {/* Colored header bar */}
        <div className={cn('h-2.5 rounded-t-md', colors.dot)} />

        <div className="p-4">
          {/* Title + starred */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight">{event.title}</h3>
            {event.starred && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-[11px] text-amber-600 dark:text-amber-400">
                <StarIcon className="size-3 fill-current" />
                Shared
              </span>
            )}
          </div>

          {/* Date & time */}
          <div className="mt-2 flex items-center gap-2 text-muted-foreground text-sm">
            <ClockIcon className="size-3.5 shrink-0" />
            <span>
              {formatFullDate(event.date)} - {event.time}
            </span>
          </div>

          {/* Category badge */}
          <div className="mt-3 flex items-center gap-2">
            <span className={cn('size-3 rounded-full', colors.dot)} />
            <span className={cn('font-medium text-sm', colors.text)}>{CATEGORY_LABELS[event.category]}</span>
          </div>

          {/* Description */}
          {event.description && (
            <p className="mt-3 rounded-lg bg-muted/50 p-3 text-muted-foreground text-sm leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Location */}
          {event.location && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <MapPinIcon className="size-3.5 shrink-0 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          )}

          {/* Meeting link */}
          {event.link && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 truncate text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}>
                Join meeting
                <ExternalLinkIcon className="size-3" />
              </a>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-1.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                <UsersIcon className="size-3.5" />
                {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
              </div>
              <div className="flex flex-col gap-2">
                {event.attendees.map((person) => (
                  <div key={person.email} className="flex items-center gap-2.5">
                    {person.avatar ? (
                      // biome-ignore lint/performance/noImgElement: registry block, not a Next.js page
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="size-7 rounded-full ring-2 ring-background"
                      />
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-full bg-muted font-semibold text-[11px] ring-2 ring-background">
                        {person.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">{person.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{person.email}</p>
                    </div>
                    <a
                      href={`mailto:${person.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <MailIcon className="size-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2 border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => {
                onEdit(event)
                onOpenChange(false)
              }}>
              <EditIcon className="size-3.5" />
              Edit
            </Button>
            {confirmDelete ? (
              <div className="flex flex-1 gap-1.5">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    onDelete(event.id)
                    onOpenChange(false)
                  }}>
                  Confirm
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-destructive hover:text-destructive"
                onClick={() => setConfirmDelete(true)}>
                <Trash2Icon className="size-3.5" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
