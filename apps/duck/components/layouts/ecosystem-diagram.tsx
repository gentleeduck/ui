'use client'

import type { LucideIcon } from 'lucide-react'
import { Box, Calendar, Database, Keyboard, LayoutGrid, Link2, Terminal } from 'lucide-react'

interface Pkg {
  short: string
  color: string
  Icon: LucideIcon
}

const PKGS: Pkg[] = [
  { short: 'ui', color: '#00d4ff', Icon: LayoutGrid },
  { short: 'primitives', color: '#a78bfa', Icon: Box },
  { short: 'cli', color: '#4ade80', Icon: Terminal },
  { short: 'calendar', color: '#fb923c', Icon: Calendar },
  { short: 'vim', color: '#f87171', Icon: Keyboard },
  { short: 'state', color: '#818cf8', Icon: Database },
  { short: 'hooks', color: '#38bdf8', Icon: Link2 },
]

const W = 580
const H = 240
const BOX = 44
const ICON = 22
const BT = 16
const CX = W / 2
const CY = 196
const CR = 32
const PAD = 30
const N = PKGS.length
const STEP = (W - PAD * 2) / (N - 1)

export function EcosystemDiagram() {
  const xs = PKGS.map((_, i) => PAD + i * STEP)
  const sy = BT + BOX
  const ey = CY - CR

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-2xl"
      aria-label="gentleduck package ecosystem"
      role="img">
      <defs>
        <filter id="ed-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ed-center-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feBlend in="SourceGraphic" in2="blur" mode="screen" />
        </filter>
        <radialGradient id="ed-center-grad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Path glow layer */}
      {xs.map((sx, i) => {
        const { color, short } = PKGS[i]
        const cp1y = sy + (ey - sy) * 0.38
        const cp2y = sy + (ey - sy) * 0.62
        const d = `M ${sx} ${sy} C ${sx} ${cp1y}, ${CX} ${cp2y}, ${CX} ${ey}`
        return (
          <path
            key={`glow-${short}`}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="8"
            opacity="0.35"
            filter="url(#ed-glow)"
          />
        )
      })}

      {/* Path main layer */}
      {xs.map((sx, i) => {
        const { color, short } = PKGS[i]
        const cp1y = sy + (ey - sy) * 0.38
        const cp2y = sy + (ey - sy) * 0.62
        const d = `M ${sx} ${sy} C ${sx} ${cp1y}, ${CX} ${cp2y}, ${CX} ${ey}`
        return <path key={`path-${short}`} d={d} fill="none" stroke={color} strokeWidth="2.5" opacity="0.85" />
      })}

      {/* Center halo */}
      <circle cx={CX} cy={CY} r={CR + 10} fill="rgba(255,255,255,0.03)" filter="url(#ed-center-glow)" />

      {/* Center circle */}
      <circle cx={CX} cy={CY} r={CR} fill="#0f0f0f" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r={CR} fill="url(#ed-center-grad)" />

      {/* Center logo */}
      <image href="/icons/icon-dark.png" x={CX - 16} y={CY - 16} width="32" height="32" />

      {/* Package icon boxes */}
      {xs.map((x, i) => {
        const { color, short, Icon } = PKGS[i]
        return (
          <g key={short}>
            {/* Box */}
            <rect
              x={x - BOX / 2}
              y={BT}
              width={BOX}
              height={BOX}
              rx="10"
              fill="#111"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            {/* Icon */}
            <foreignObject x={x - ICON / 2} y={BT + (BOX - ICON) / 2} width={ICON} height={ICON}>
              <div style={{ display: 'flex', width: ICON, height: ICON }}>
                <Icon size={ICON} color="rgba(255,255,255,0.85)" />
              </div>
            </foreignObject>
            {/* Label */}
            <text
              x={x}
              y={BT + BOX + 16}
              textAnchor="middle"
              fill="rgba(160,160,160,0.6)"
              fontSize="8.5"
              fontFamily="ui-monospace, monospace">
              {short}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
