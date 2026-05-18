import { cn } from '@gentleduck/libs/cn'
import { Badge as RxBadge } from '@gentleduck/registry-ui/badge'
import { Button as RxButton } from '@gentleduck/registry-ui/button'
import { CardContent, CardHeader, CardTitle, Card as RxCard } from '@gentleduck/registry-ui/card'
import { Input as RxInput } from '@gentleduck/registry-ui/input'
import { Textarea as RxTextarea } from '@gentleduck/registry-ui/textarea'
import type React from 'react'

export function Card({
  title,
  children,
  actions,
}: {
  title?: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <RxCard className="gap-0 overflow-hidden py-0">
      {(title || actions) && (
        <CardHeader className="flex items-center justify-between gap-2 border-b px-3 py-2 [.border-b]:pb-2">
          {title && (
            <CardTitle className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
              {title}
            </CardTitle>
          )}
          {actions}
        </CardHeader>
      )}
      <CardContent className="p-3 text-xs">{children}</CardContent>
    </RxCard>
  )
}

export function Button({
  children,
  onClick,
  variant = 'default',
  disabled,
  type = 'button',
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  const rxVariant =
    variant === 'primary' ? 'default' : variant === 'danger' ? 'destructive' : variant === 'ghost' ? 'ghost' : 'outline'
  return (
    <RxButton
      className={cn('text-[11px]', className)}
      disabled={disabled}
      onClick={onClick}
      size="sm"
      type={type}
      variant={rxVariant}>
      {children}
    </RxButton>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      {children}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <RxInput {...props} className={cn('h-7 text-xs', props.className)} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <RxTextarea {...props} className={cn('font-mono text-[11px] leading-relaxed', props.className)} />
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'allow' | 'deny' | 'info' | 'warn'
  className?: string
}) {
  const variant =
    tone === 'allow'
      ? 'default'
      : tone === 'deny'
        ? 'destructive'
        : tone === 'info'
          ? 'secondary'
          : tone === 'warn'
            ? 'outline'
            : 'outline'
  const toneCls =
    tone === 'allow'
      ? 'bg-lime-500/10 text-lime-400 border-lime-500/35 hover:bg-lime-500/15'
      : tone === 'deny'
        ? 'bg-red-500/10 text-red-400 border-red-500/35 hover:bg-red-500/15'
        : tone === 'info'
          ? 'bg-sky-500/10 text-sky-400 border-sky-500/35 hover:bg-sky-500/15'
          : tone === 'warn'
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/35 hover:bg-amber-500/15'
            : ''
  return (
    <RxBadge
      className={cn('h-5 rounded-full px-2 font-semibold text-[9px] uppercase tracking-wider', toneCls, className)}
      variant={variant}>
      {children}
    </RxBadge>
  )
}

export function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-border/60 border-dashed bg-muted/20 p-6 text-center text-muted-foreground text-xs">
      {message}
    </div>
  )
}

export function Alert({ kind, children }: { kind: 'error' | 'success'; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'm-2 rounded-md px-3 py-2 font-medium text-[11px]',
        kind === 'error' && 'border border-red-500/30 bg-red-500/10 text-red-400',
        kind === 'success' && 'border border-lime-500/30 bg-lime-500/10 text-lime-400',
      )}>
      {children}
    </div>
  )
}
