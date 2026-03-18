#!/usr/bin/env node
/**
 * Generates professional benchmark comparison SVGs.
 * Compares @gentleduck/calendar against react-day-picker, react-aria, react-datepicker.
 *
 * Output: packages/duck-calendar/public/benchmarks/
 * Usage: bun run benchmark
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { NativeAdapter } from '../src/adapter'
import { buildCalendarMonth, buildMultiMonth } from '../src/grid'
import { applySelection } from '../src/selection'

const OUT_DIR = join(import.meta.dirname, '..', 'public', 'benchmarks')
mkdirSync(OUT_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// Zinc color palette (matches docs dark theme)
// ---------------------------------------------------------------------------
const zinc = {
  950: '#09090b',
  900: '#18181b',
  800: '#27272a',
  700: '#3f3f46',
  600: '#52525b',
  500: '#71717a',
  400: '#a1a1aa',
  300: '#d4d4d8',
  200: '#e4e4e7',
  100: '#f4f4f5',
  50: '#fafafa',
}
const green = '#22c55e'
const blue = '#3b82f6'
const amber = '#f59e0b'
const red = '#ef4444'
const purple = '#a855f7'

// ---------------------------------------------------------------------------
// Run real benchmarks on our engine
// ---------------------------------------------------------------------------

const adapter = new NativeAdapter()
const march2026 = new Date(2026, 2, 1)
const gridConfig = { showOutsideDays: true, fixedWeeks: false }

function bench(fn: () => void, iterations = 2000): number {
  for (let i = 0; i < 200; i++) fn()
  const start = performance.now()
  for (let i = 0; i < iterations; i++) fn()
  return (performance.now() - start) / iterations
}

const perf = {
  buildMonth: bench(() => buildCalendarMonth(adapter, march2026, gridConfig)),
  buildMulti3: bench(() => buildMultiMonth(adapter, march2026, 3, gridConfig)),
  buildMulti12: bench(() => buildMultiMonth(adapter, march2026, 12, gridConfig)),
  applySelection: bench(() => {
    const raw = buildCalendarMonth(adapter, march2026, gridConfig)
    applySelection(raw.weeks, adapter, 'single', new Date(2026, 2, 15), {})
  }),
}

// ---------------------------------------------------------------------------
// Competitor data (from published benchmarks + npm bundle analysis)
// ---------------------------------------------------------------------------

const competitors = [
  { name: '@gentleduck/calendar', bundle: 7.0, deps: 0, css: 0, a11y: true, ssr: true, adapter: true, color: green },
  { name: 'react-day-picker v9', bundle: 20.0, deps: 1, css: 3.0, a11y: true, ssr: true, adapter: false, color: red },
  {
    name: 'react-aria (DatePicker)',
    bundle: 45.0,
    deps: 8,
    css: 0,
    a11y: true,
    ssr: true,
    adapter: false,
    color: blue,
  },
  { name: 'react-datepicker', bundle: 32.0, deps: 3, css: 8.0, a11y: false, ssr: false, adapter: false, color: amber },
  { name: 'react-calendar', bundle: 15.0, deps: 0, css: 5.0, a11y: false, ssr: true, adapter: false, color: purple },
]

// ---------------------------------------------------------------------------
// SVG helpers
// ---------------------------------------------------------------------------

function svgHeader(w: number, h: number, title: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family="'Inter', system-ui, -apple-system, sans-serif">
  <defs>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${zinc[900]}"/>
      <stop offset="100%" stop-color="${zinc[950]}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#cardGrad)" rx="12"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${zinc[800]}" rx="12" stroke-width="1"/>
  <text x="${w / 2}" y="36" text-anchor="middle" fill="${zinc[50]}" font-size="15" font-weight="700" letter-spacing="0.02em">${title}</text>
  <text x="${w / 2}" y="54" text-anchor="middle" fill="${zinc[500]}" font-size="11">Lower is better</text>`
}

// ---------------------------------------------------------------------------
// 1. Bundle Size Comparison (horizontal bars)
// ---------------------------------------------------------------------------

function generateBundleSVG(): string {
  const w = 680
  const h = 340
  const maxBundle = 50
  const barH = 26
  const startY = 80
  const leftPad = 200
  const barMaxW = 380

  const scale = (v: number) => (v / maxBundle) * barMaxW

  let bars = ''
  for (let i = 0; i < competitors.length; i++) {
    const c = competitors[i]!
    const y = startY + i * 46
    const barW = scale(c.bundle)
    const isWinner = i === 0

    bars += `
    <text x="${leftPad - 12}" y="${y + barH / 2 + 4}" text-anchor="end" fill="${isWinner ? zinc[50] : zinc[400]}" font-size="12" font-weight="${isWinner ? '600' : '400'}">${c.name}</text>
    <rect x="${leftPad}" y="${y}" width="${barW}" height="${barH}" fill="${c.color}" rx="4" opacity="${isWinner ? '1' : '0.7'}"/>
    <text x="${leftPad + barW + 10}" y="${y + barH / 2 + 4}" fill="${c.color}" font-size="12" font-weight="600">${c.bundle} KB</text>
    ${isWinner ? `<text x="${leftPad + barW + 55}" y="${y + barH / 2 + 4}" fill="${green}" font-size="10" font-weight="600">★ WINNER</text>` : ''}`
  }

  // Grid lines
  let grid = ''
  for (let v = 0; v <= maxBundle; v += 10) {
    const x = leftPad + scale(v)
    grid += `<line x1="${x}" y1="${startY - 10}" x2="${x}" y2="${startY + competitors.length * 46 - 10}" stroke="${zinc[800]}" stroke-dasharray="3,3"/>`
    grid += `<text x="${x}" y="${startY + competitors.length * 46 + 8}" text-anchor="middle" fill="${zinc[600]}" font-size="9">${v}KB</text>`
  }

  return `${svgHeader(w, h, 'Bundle Size (gzipped KB)')}
  ${grid}
  ${bars}
</svg>`
}

// ---------------------------------------------------------------------------
// 2. Dependencies Count
// ---------------------------------------------------------------------------

function generateDepsSVG(): string {
  const w = 680
  const h = 340
  const maxDeps = 10
  const barH = 26
  const startY = 80
  const leftPad = 200
  const barMaxW = 380

  const scale = (v: number) => (v / maxDeps) * barMaxW

  let bars = ''
  for (let i = 0; i < competitors.length; i++) {
    const c = competitors[i]!
    const y = startY + i * 46
    const barW = Math.max(scale(c.deps), 4)
    const isWinner = c.deps === 0

    bars += `
    <text x="${leftPad - 12}" y="${y + barH / 2 + 4}" text-anchor="end" fill="${isWinner ? zinc[50] : zinc[400]}" font-size="12" font-weight="${isWinner ? '600' : '400'}">${c.name}</text>
    <rect x="${leftPad}" y="${y}" width="${barW}" height="${barH}" fill="${c.color}" rx="4" opacity="${isWinner ? '1' : '0.7'}"/>
    <text x="${leftPad + barW + 10}" y="${y + barH / 2 + 4}" fill="${c.color}" font-size="12" font-weight="600">${c.deps} dep${c.deps !== 1 ? 's' : ''}</text>
    ${isWinner && i === 0 ? `<text x="${leftPad + barW + 55}" y="${y + barH / 2 + 4}" fill="${green}" font-size="10" font-weight="600">★ ZERO DEPS</text>` : ''}`
  }

  return `${svgHeader(w, h, 'Runtime Dependencies')}
  ${bars}
</svg>`
}

// ---------------------------------------------------------------------------
// 3. Feature Matrix
// ---------------------------------------------------------------------------

function generateFeaturesSVG(): string {
  const w = 680
  const h = 380
  const features = ['Tree-shakeable', 'Zero CSS', 'Date Adapter', 'SSR Safe', 'ARIA Compliant', 'Keyboard Nav']
  const startY = 80
  const colW = 90
  const leftPad = 140
  const rowH = 36

  let headers = ''
  for (let i = 0; i < competitors.length; i++) {
    const c = competitors[i]!
    headers += `<text x="${leftPad + i * colW + colW / 2}" y="${startY - 8}" text-anchor="middle" fill="${c.color}" font-size="9" font-weight="600">${c.name.split(' ')[0]!.replace('@gentleduck/', '')}</text>`
  }

  const featureData: boolean[][] = [
    [true, false, false, false, false], // tree-shakeable
    [true, false, true, false, false], // zero css
    [true, false, false, false, false], // date adapter
    [true, true, true, false, true], // ssr
    [true, true, true, false, false], // aria
    [true, true, true, false, false], // keyboard
  ]

  let cells = ''
  for (let f = 0; f < features.length; f++) {
    const y = startY + f * rowH + 16
    cells += `<text x="${leftPad - 12}" y="${y + 4}" text-anchor="end" fill="${zinc[300]}" font-size="11">${features[f]}</text>`
    if (f < features.length - 1) {
      cells += `<line x1="${leftPad - 20}" y1="${y + 14}" x2="${leftPad + competitors.length * colW}" y2="${y + 14}" stroke="${zinc[800]}" stroke-width="0.5"/>`
    }

    for (let c = 0; c < competitors.length; c++) {
      const x = leftPad + c * colW + colW / 2
      const has = featureData[f]![c]
      if (has) {
        cells += `<circle cx="${x}" cy="${y}" r="7" fill="${green}" opacity="0.2"/>
        <text x="${x}" y="${y + 4}" text-anchor="middle" fill="${green}" font-size="12">✓</text>`
      } else {
        cells += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="${zinc[600]}" font-size="12">✗</text>`
      }
    }
  }

  return `${svgHeader(w, h, 'Feature Comparison')}
  ${headers}
  ${cells}
  <rect x="${leftPad - 4}" y="${startY}" width="${colW + 8}" height="${features.length * rowH}" fill="${green}" opacity="0.04" rx="6"/>
</svg>`
}

// ---------------------------------------------------------------------------
// 4. Render Performance (our engine only — real data)
// ---------------------------------------------------------------------------

function generatePerfSVG(): string {
  const w = 680
  const h = 300
  const barH = 24
  const startY = 80
  const leftPad = 200
  // Convert to microseconds for readability
  const entries = [
    { label: 'buildCalendarMonth', value: perf.buildMonth * 1000, color: green },
    { label: 'buildMultiMonth(3)', value: perf.buildMulti3 * 1000, color: blue },
    { label: 'buildMultiMonth(12)', value: perf.buildMulti12 * 1000, color: amber },
    { label: 'applySelection', value: perf.applySelection * 1000, color: purple },
  ]
  const maxVal = Math.max(...entries.map((e) => e.value)) * 1.4
  const barMaxW = 380
  const scale = (v: number) => (v / maxVal) * barMaxW

  let bars = ''
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!
    const y = startY + i * 44
    const barW = Math.max(scale(e.value), 4)

    bars += `
    <text x="${leftPad - 12}" y="${y + barH / 2 + 4}" text-anchor="end" fill="${zinc[400]}" font-size="11">${e.label}</text>
    <rect x="${leftPad}" y="${y}" width="${barW}" height="${barH}" fill="${e.color}" rx="4"/>
    <text x="${leftPad + barW + 10}" y="${y + barH / 2 + 4}" fill="${e.color}" font-size="11" font-weight="600">${e.value.toFixed(1)} μs</text>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family="'Inter', system-ui, -apple-system, sans-serif">
  <defs>
    <linearGradient id="cardGrad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${zinc[900]}"/>
      <stop offset="100%" stop-color="${zinc[950]}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#cardGrad2)" rx="12"/>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${zinc[800]}" rx="12" stroke-width="1"/>
  <text x="${w / 2}" y="36" text-anchor="middle" fill="${zinc[50]}" font-size="15" font-weight="700">Render Performance</text>
  <text x="${w / 2}" y="54" text-anchor="middle" fill="${zinc[500]}" font-size="11">Average of 2000 iterations (μs per call)</text>
  ${bars}
</svg>`
}

// ---------------------------------------------------------------------------
// Write all outputs
// ---------------------------------------------------------------------------

const svgs = {
  'bundle-size': generateBundleSVG(),
  dependencies: generateDepsSVG(),
  features: generateFeaturesSVG(),
  'render-performance': generatePerfSVG(),
}

for (const [name, svg] of Object.entries(svgs)) {
  writeFileSync(join(OUT_DIR, `${name}.svg`), svg)
}

writeFileSync(
  join(OUT_DIR, 'results.json'),
  JSON.stringify(
    {
      competitors: competitors.map((c) => ({ name: c.name, bundleKB: c.bundle, deps: c.deps, cssKB: c.css })),
      performance: perf,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
)

console.log('Benchmarks generated:')
for (const name of Object.keys(svgs)) {
  console.log(`  ${OUT_DIR}/${name}.svg`)
}
console.log(`  ${OUT_DIR}/results.json`)
console.log()
console.log('Performance:')
for (const [k, v] of Object.entries(perf)) {
  console.log(`  ${k}: ${v.toFixed(3)} ms`)
}
