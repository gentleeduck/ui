import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { ChevronDown, ChevronRight, Search } from './icons'

export function SplitView({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid h-full min-h-0 grid-cols-[300px_1fr] overflow-hidden">
      <aside className="flex h-full min-h-0 flex-col overflow-hidden border-r bg-card">{left}</aside>
      <section className="flex h-full min-h-0 flex-col overflow-hidden bg-background">{right}</section>
    </div>
  )
}

export function ListShell({
  title,
  count,
  toolbar,
  children,
}: {
  title?: string
  count?: number
  toolbar?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-card px-3 py-2">
        <div className="flex items-center gap-2">
          {title && (
            <h3 className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{title}</h3>
          )}
          {typeof count === 'number' && (
            <span className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 font-mono font-semibold text-[9px] text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        {toolbar}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

export function ListItem({
  active,
  onClick,
  dot,
  primary,
  secondary,
  trailing,
}: {
  active?: boolean
  onClick?: () => void
  dot?: string
  primary: React.ReactNode
  secondary?: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-2 border-border/50 border-b px-3 py-1.5 text-left transition-colors',
        active ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-muted/50',
      )}>
      {dot && <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div
          className={cn(
            'truncate font-mono text-[11px]',
            active ? 'font-semibold text-foreground' : 'text-foreground',
          )}>
          {primary}
        </div>
        {secondary && <div className="truncate font-mono text-[9px] text-muted-foreground">{secondary}</div>}
      </div>
      {trailing}
    </button>
  )
}

export function Section({
  title,
  defaultOpen = true,
  toolbar,
  children,
}: {
  title: string
  defaultOpen?: boolean
  toolbar?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className="border-b">
      <div className="flex items-center justify-between gap-2 bg-card/60 px-3 py-1.5">
        <button type="button" onClick={() => setOpen((o) => !o)} className="flex flex-1 items-center gap-2 text-left">
          <span className="inline-flex w-3 text-muted-foreground">
            {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </span>
          <h4 className="font-semibold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{title}</h4>
        </button>
        {toolbar}
      </div>
      {open && <div className="px-3 py-2">{children}</div>}
    </div>
  )
}

export function DetailEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground text-xs">
      {message}
    </div>
  )
}

export function FilterBar({
  value,
  onChange,
  placeholder = 'Filter',
  trailing,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-card/60 px-2 py-1.5">
      <div className="relative flex flex-1 items-center">
        <Search className="pointer-events-none absolute left-2 text-muted-foreground" size={11} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex h-7 w-full rounded-md border border-input bg-background pr-2 pl-7 text-[11px] outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        />
      </div>
      {trailing}
    </div>
  )
}
