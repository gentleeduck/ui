import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { ChevronDown, ChevronRight } from './icons'

export interface IJsonTreeProps {
  data: unknown
  label?: string
  defaultOpen?: boolean
  level?: number
}

function typeOf(v: unknown): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' | 'undefined' | 'function' {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  if (typeof v === 'object') return 'object'
  return typeof v as 'string' | 'number' | 'boolean' | 'undefined' | 'function'
}

function previewLen(v: unknown): string {
  if (Array.isArray(v)) return `${v.length} ${v.length === 1 ? 'item' : 'items'}`
  if (v && typeof v === 'object') {
    const n = Object.keys(v as Record<string, unknown>).length
    return `${n} ${n === 1 ? 'item' : 'items'}`
  }
  return ''
}

function Primitive({ value }: { value: unknown }) {
  const t = typeOf(value)
  if (t === 'string') return <span className="text-lime-400">"{String(value)}"</span>
  if (t === 'number') return <span className="text-amber-400">{String(value)}</span>
  if (t === 'boolean') return <span className="font-semibold text-sky-400">{String(value)}</span>
  if (t === 'null') return <span className="text-muted-foreground italic">null</span>
  if (t === 'undefined') return <span className="text-muted-foreground italic">undefined</span>
  if (t === 'function') return <span className="text-muted-foreground italic">ƒ()</span>
  return <span>{String(value)}</span>
}

export function JsonTree({ data, label, defaultOpen = false, level = 0 }: IJsonTreeProps) {
  const t = typeOf(data)
  const isContainer = t === 'object' || t === 'array'
  const [open, setOpen] = React.useState(defaultOpen || level === 0)

  if (!isContainer) {
    return (
      <div className="font-mono text-[11px] leading-relaxed">
        <div className="flex items-baseline gap-1.5 pl-4">
          {label != null && <span className="text-sky-400">{label}:</span>}
          <Primitive value={data} />
        </div>
      </div>
    )
  }

  const entries = Array.isArray(data)
    ? (data as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(data as Record<string, unknown>)
  const summary = previewLen(data)

  return (
    <div className="font-mono text-[11px] leading-relaxed">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn('flex w-full items-baseline gap-1 rounded px-1 py-0.5 text-left hover:bg-muted/60')}>
        <span className="inline-flex w-3 shrink-0 text-muted-foreground">
          {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </span>
        {label != null && <span className="text-sky-400">{label}:</span>}
        <span className="text-muted-foreground">{t === 'array' ? '[' : '{'}</span>
        {!open && <span className="text-muted-foreground">...{t === 'array' ? ']' : '}'}</span>}
        <span className="ml-1.5 text-[9px] text-muted-foreground/60 italic">{summary}</span>
      </button>
      {open && (
        <div className="ml-3 border-border/60 border-l pl-2">
          {entries.map(([k, v]) => (
            <JsonTree data={v} key={k} label={k} level={level + 1} />
          ))}
          <div className="pl-1 text-muted-foreground">{t === 'array' ? ']' : '}'}</div>
        </div>
      )}
    </div>
  )
}
