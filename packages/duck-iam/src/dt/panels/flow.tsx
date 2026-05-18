import { cn } from '@gentleduck/libs/cn'
import React from 'react'
import { Refresh } from '../components/icons'
import { JsonTree } from '../components/json-tree'
import { DetailEmpty, FilterBar, ListItem, ListShell, Section, SplitView } from '../components/layout'
import { Badge, Button } from '../components/ui'
import type { IFlowEntry, IFlowRecorder } from '../lib/flow'

function pad(n: number, w = 2) {
  return String(n).padStart(w, '0')
}
function fmtTime(ts: number) {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
}
function fmtAgo(ts: number, now: number) {
  const ms = Math.max(0, now - ts)
  if (ms < 1000) return `${ms}ms ago`
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`
  return `${Math.floor(ms / 3_600_000)}h ago`
}

function ActionChip({ action }: { action: string }) {
  return (
    <code className="inline-flex h-6 items-center rounded-md border border-sky-500/30 bg-sky-500/10 px-2 font-mono font-semibold text-[11px] text-sky-500">
      {action}
    </code>
  )
}
function ResourceChip({ resource, resourceId }: { resource: string; resourceId?: string }) {
  return (
    <code className="inline-flex h-6 items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 font-mono font-semibold text-[11px] text-amber-500">
      {resource}
      {resourceId && <span className="opacity-60">#{resourceId}</span>}
    </code>
  )
}
function SubjectChip({ id }: { id: string }) {
  const initial = id.replace(/^u-/, '').charAt(0).toUpperCase() || '?'
  return (
    <div className="inline-flex items-center gap-2 rounded-md border bg-card px-2 py-1">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 font-bold font-mono text-[10px] text-primary">
        {initial}
      </span>
      <code className="font-mono font-semibold text-[11px] text-foreground">{id}</code>
    </div>
  )
}

export function FlowPanel({ flow }: { flow: IFlowRecorder }) {
  const [entries, setEntries] = React.useState<readonly IFlowEntry[]>(() => flow.list())
  const [selected, setSelected] = React.useState<number | null>(null)
  const [filter, setFilter] = React.useState('')
  const [showAllow, setShowAllow] = React.useState(true)
  const [showDeny, setShowDeny] = React.useState(true)
  const [now, setNow] = React.useState(Date.now())
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    const off = flow.subscribe(() => setEntries(flow.list().slice()))
    return off
  }, [flow])
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const q = filter.trim().toLowerCase()
  const filtered = entries.filter((e) => {
    if (!showAllow && e.allowed) return false
    if (!showDeny && !e.allowed) return false
    if (!q) return true
    return (
      e.subjectId.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.resource.toLowerCase().includes(q) ||
      (e.resourceId ?? '').toLowerCase().includes(q)
    )
  })

  const current = selected != null ? (flow.get(selected) ?? null) : null
  const counts = React.useMemo(() => {
    let allow = 0,
      deny = 0
    for (const e of entries) e.allowed ? allow++ : deny++
    return { allow, deny }
  }, [entries])

  const copyEntry = async () => {
    if (!current) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(current, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <SplitView
      left={
        <ListShell
          count={filtered.length}
          title="Flow"
          toolbar={
            <Button onClick={() => flow.clear()}>
              <Refresh size={10} /> clear
            </Button>
          }>
          <FilterBar onChange={setFilter} placeholder="Filter by subject, action, resource" value={filter} />
          <div className="flex items-center gap-1.5 border-b bg-card/40 px-3 py-2">
            <FilterPill active={showAllow} tone="allow" onClick={() => setShowAllow((v) => !v)}>
              allow <span className="opacity-70">{counts.allow}</span>
            </FilterPill>
            <FilterPill active={showDeny} tone="deny" onClick={() => setShowDeny((v) => !v)}>
              deny <span className="opacity-70">{counts.deny}</span>
            </FilterPill>
          </div>
          {filtered.length === 0 && (
            <DetailEmpty
              message={
                entries.length === 0
                  ? 'No access checks recorded yet. Interact with the app to see live flow.'
                  : 'No matches.'
              }
            />
          )}
          {filtered.map((e) => (
            <ListItem
              active={selected === e.id}
              dot={e.allowed ? '#84cc16' : '#ef4444'}
              key={e.id}
              onClick={() => setSelected(e.id)}
              primary={
                <span className="inline-flex items-baseline gap-1.5">
                  <span className="font-semibold text-sky-500">{e.action}</span>
                  <span className="text-muted-foreground">on</span>
                  <span className="font-semibold text-amber-500">{e.resource}</span>
                  {e.resourceId && <span className="text-muted-foreground">#{e.resourceId}</span>}
                </span>
              }
              secondary={
                <span className="inline-flex items-center gap-1.5">
                  {e.subjectId}
                  <Dot />
                  {fmtAgo(e.ts, now)}
                  {typeof e.durationMs === 'number' && (
                    <>
                      <Dot />
                      {e.durationMs.toFixed(1)}ms
                    </>
                  )}
                </span>
              }
            />
          ))}
        </ListShell>
      }
      right={
        !current ? (
          <DetailEmpty message="Pick a check on the left to inspect." />
        ) : (
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <header className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-2 border-b bg-card/60 px-4 py-3 backdrop-blur">
              <Badge tone={current.allowed ? 'allow' : 'deny'}>{current.allowed ? 'allow' : 'deny'}</Badge>
              <ActionChip action={current.action} />
              <span className="text-muted-foreground text-xs">on</span>
              <ResourceChip resource={current.resource} resourceId={current.resourceId} />
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                {fmtTime(current.ts)}
                {typeof current.durationMs === 'number' && (
                  <>
                    <Dot />
                    {current.durationMs.toFixed(2)}ms
                  </>
                )}
              </span>
            </header>
            <div className="flex-1 overflow-auto">
              <Section title="Subject">
                <div className="flex flex-wrap items-center gap-2">
                  <SubjectChip id={current.subjectId} />
                  {current.scope && <Badge tone="info">scope: {current.scope}</Badge>}
                </div>
              </Section>
              {current.reason && (
                <Section title="Reason">
                  <p className="whitespace-pre-wrap font-mono text-[11px] text-foreground/80 leading-relaxed">
                    {current.reason}
                  </p>
                </Section>
              )}
              {(current.decidingPolicy || current.decidingRule) && (
                <Section title="Deciding">
                  <div className="flex flex-wrap gap-2">
                    {current.decidingPolicy && <Kv k="policy" v={current.decidingPolicy} />}
                    {current.decidingRule && <Kv k="rule" v={current.decidingRule} />}
                  </div>
                </Section>
              )}
              {current.environment && Object.keys(current.environment).length > 0 && (
                <Section defaultOpen={false} title="Environment">
                  <JsonTree data={current.environment} defaultOpen />
                </Section>
              )}
              <Section defaultOpen={false} title="Raw entry">
                <JsonTree data={current} defaultOpen />
              </Section>
            </div>
            <footer className="flex shrink-0 items-center justify-end gap-1.5 border-t bg-card/60 px-3 py-2">
              <Button onClick={copyEntry} variant="ghost">
                {copied ? 'copied' : 'copy entry'}
              </Button>
            </footer>
          </div>
        )
      }
    />
  )
}

function FilterPill({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean
  tone: 'allow' | 'deny'
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-mono font-semibold text-[10px] uppercase tracking-wider transition-all',
        active && tone === 'allow' && 'border-lime-500/35 bg-lime-500/10 text-lime-500 hover:bg-lime-500/15',
        active && tone === 'deny' && 'border-red-500/35 bg-red-500/10 text-red-500 hover:bg-red-500/15',
        !active && 'border-border bg-transparent text-muted-foreground opacity-60 hover:opacity-100',
      )}>
      {children}
    </button>
  )
}

function Dot() {
  return <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-current opacity-40" />
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1">
      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{k}</span>
      <code className="font-mono font-semibold text-[11px] text-foreground">{v}</code>
    </div>
  )
}
