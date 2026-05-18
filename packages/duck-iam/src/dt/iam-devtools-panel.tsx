import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui/button'
import React from 'react'
import { Close } from './components/icons'
import { IamDevtoolsInner, type IIamDevtoolsInnerProps } from './iam-devtools'
import { GENTLEDUCK_LOGO_DATA_URL } from './lib/logo'
import { ensureStylesInjected } from './lib/styles'

export type ButtonPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'relative'
export type PanelPosition = 'top' | 'bottom' | 'left' | 'right'

export interface IIamDevtoolsProps extends IIamDevtoolsInnerProps {
  initialIsOpen?: boolean
  buttonPosition?: ButtonPosition
  position?: PanelPosition
  hideButton?: boolean
  storagePrefix?: string
  /** Floating gutter in px around the panel. 0 = flush edges (default). */
  inset?: number
}

const DEFAULT_SIZE = 500
const MIN_SIZE = 220
const MAX_SIZE_VW = 0.9
const ANIM_MS = 240

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
function saveState(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function panelSize(position: PanelPosition, size: number): React.CSSProperties {
  if (position === 'bottom' || position === 'top') return { height: size }
  return { width: size }
}

function panelHidden(position: PanelPosition): string {
  if (position === 'bottom') return 'translateY(100%)'
  if (position === 'top') return 'translateY(-100%)'
  if (position === 'right') return 'translateX(100%)'
  return 'translateX(-100%)'
}

export function IamDevtools({
  initialIsOpen = false,
  buttonPosition = 'bottom-right',
  position: positionProp,
  hideButton = false,
  storagePrefix = '__IAM_DEVTOOLS',
  inset = 0,
  ...inner
}: IIamDevtoolsProps) {
  React.useEffect(() => {
    ensureStylesInjected()
  }, [])

  const openKey = `${storagePrefix}_OPEN`
  const sizeKey = `${storagePrefix}_SIZE`
  const posKey = `${storagePrefix}_POSITION`

  const [open, setOpen] = React.useState<boolean>(() => loadState(openKey, initialIsOpen))
  const [mounted, setMounted] = React.useState<boolean>(() => loadState(openKey, initialIsOpen))
  const [animateIn, setAnimateIn] = React.useState<boolean>(false)
  const [size, setSize] = React.useState<number>(() => loadState(sizeKey, DEFAULT_SIZE))
  const [position, setPosition] = React.useState<PanelPosition>(() => loadState(posKey, positionProp ?? 'bottom'))
  const dragRef = React.useRef<{ start: number; size: number; axis: 'x' | 'y' } | null>(null)

  React.useEffect(() => saveState(openKey, open), [open, openKey])
  React.useEffect(() => saveState(sizeKey, size), [size, sizeKey])
  React.useEffect(() => saveState(posKey, position), [position, posKey])
  React.useEffect(() => {
    if (positionProp) setPosition(positionProp)
  }, [positionProp])

  React.useEffect(() => {
    let raf = 0
    let timeout = 0
    if (open) {
      setMounted(true)
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setAnimateIn(true))
      })
    } else {
      setAnimateIn(false)
      timeout = window.setTimeout(() => setMounted(false), ANIM_MS)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
    }
  }, [open])

  const onDragStart = (e: React.PointerEvent) => {
    const axis: 'x' | 'y' = position === 'left' || position === 'right' ? 'x' : 'y'
    dragRef.current = { start: axis === 'x' ? e.clientX : e.clientY, size, axis }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const onDragMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const delta = (d.axis === 'x' ? e.clientX : e.clientY) - d.start
    const sign = position === 'bottom' || position === 'right' ? -1 : 1
    const max = (d.axis === 'x' ? window.innerWidth : window.innerHeight) * MAX_SIZE_VW
    const next = Math.max(MIN_SIZE, Math.min(max, d.size + sign * delta))
    setSize(next)
  }
  const onDragEnd = (e: React.PointerEvent) => {
    dragRef.current = null
    try {
      ;(e.target as Element).releasePointerCapture(e.pointerId)
    } catch {}
  }

  const cycleDock = () => {
    const order: PanelPosition[] = ['bottom', 'right', 'top', 'left']
    const idx = order.indexOf(position)
    setPosition(order[(idx + 1) % order.length] as PanelPosition)
  }

  const resizeAxisCls = position === 'left' || position === 'right' ? 'iam-dt-resize--ew' : 'iam-dt-resize--ns'

  return (
    <>
      {!hideButton && buttonPosition !== 'relative' && (
        <div className="iam-dt-btn-wrap" data-pos={buttonPosition}>
          <button
            aria-label="Open duck-iam devtools"
            onClick={() => setOpen(true)}
            type="button"
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-xl active:scale-95',
              open && 'pointer-events-none scale-50 opacity-0',
            )}>
            <img
              alt=""
              className="h-6 w-6 object-contain"
              draggable={false}
              src={GENTLEDUCK_LOGO_DATA_URL}
              style={{ width: 24, height: 24, objectFit: 'contain', display: 'block' }}
            />
          </button>
        </div>
      )}

      {mounted && (
        <div
          className="iam-dt-panel-wrap"
          data-pos={position}
          data-inset={inset > 0 ? '1' : undefined}
          style={{
            transform: animateIn ? 'translate(0,0)' : panelHidden(position),
            opacity: animateIn ? 1 : 0,
            ...panelSize(position, size),
          }}>
          <div
            className={cn(
              'flex h-full min-h-0 flex-col overflow-hidden border border-border bg-background text-foreground shadow-2xl',
              inset > 0 && 'rounded-xl',
              inset === 0 && position === 'bottom' && 'border-x-0 border-b-0',
              inset === 0 && position === 'top' && 'border-x-0 border-t-0',
              inset === 0 && position === 'left' && 'border-y-0 border-l-0',
              inset === 0 && position === 'right' && 'border-y-0 border-r-0',
            )}>
            <div
              className={cn('iam-dt-resize', resizeAxisCls)}
              onPointerDown={onDragStart}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onPointerCancel={onDragEnd}
            />
            <header className="flex shrink-0 items-center justify-between gap-4 border-b bg-card px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                  <img
                    alt=""
                    className="h-4 w-4 object-contain"
                    draggable={false}
                    src={GENTLEDUCK_LOGO_DATA_URL}
                    style={{ width: 16, height: 16, objectFit: 'contain', display: 'block' }}
                  />
                </span>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="font-bold text-xs tracking-tight">duck-iam</span>
                  <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
                    devtools
                  </span>
                </div>
                <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-lime-500/30 bg-lime-500/10 px-2 py-0.5 font-mono font-semibold text-[9px] text-lime-400 uppercase">
                  <span aria-hidden className="h-1 w-1 animate-pulse rounded-full bg-lime-400" />
                  live
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cycleDock}
                  className="h-7 px-2 font-mono text-[10px] uppercase">
                  {position}
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  aria-label="Close devtools"
                  className="h-7 w-7 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400">
                  <Close size={12} />
                </Button>
              </div>
            </header>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <IamDevtoolsInner {...inner} embedded />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
