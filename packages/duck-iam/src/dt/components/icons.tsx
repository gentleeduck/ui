import type { CSSProperties } from 'react'

interface IconProps {
  size?: number
  className?: string
  style?: CSSProperties
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function ChevronDown({ size = 12, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <path d="M3 6l5 5 5-5" />
    </svg>
  )
}

export function ChevronRight({ size = 12, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <path d="M6 3l5 5-5 5" />
    </svg>
  )
}

export function Close({ size = 14, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  )
}

export function Refresh({ size = 12, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <path d="M13.5 7a5.5 5.5 0 1 0-1.5 4M13.5 3v4h-4" />
    </svg>
  )
}

export function Search({ size = 12, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  )
}

export function ArrowRight({ size = 12, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

export function CornerUpRight({ size = 12, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <path d="M3 12V6a2 2 0 0 1 2-2h8M10 1l4 3-4 3" />
    </svg>
  )
}

export function Dot({ size = 4, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 4 4" className={className} style={style}>
      <circle cx="2" cy="2" r="2" fill="currentColor" />
    </svg>
  )
}

export function Spinner({ size = 12, className, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      {...base}
      className={className}
      style={{ ...style, animation: 'iam-dt-spin 0.9s linear infinite' }}>
      <path d="M8 1.5a6.5 6.5 0 1 1-6.5 6.5" />
    </svg>
  )
}

export function Check({ size = 12, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <path d="M3 8.5l3.5 3.5L13 5" />
    </svg>
  )
}

export function Minus({ size = 12, className, style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" {...base} className={className} style={style}>
      <path d="M3 8h10" />
    </svg>
  )
}
