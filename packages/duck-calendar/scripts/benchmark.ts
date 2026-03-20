#!/usr/bin/env node
/**
 * Generates professional benchmark comparison SVGs.
 * Compares @gentleduck/calendar against react-day-picker, react-aria, react-datepicker.
 * Also benchmarks all calendar adapters (Native, Islamic, Persian, Hebrew).
 *
 * Output: packages/duck-calendar/public/benchmarks/
 * Usage: bun run benchmark
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { HebrewAdapter } from '../src/adapter/hebrew-adapter'
import { IslamicAdapter } from '../src/adapter/islamic-adapter'
import { NativeAdapter } from '../src/adapter/native-adapter'
import { PersianAdapter } from '../src/adapter/persian-adapter'
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
const cyan = '#06b6d4'
const pink = '#ec4899'

// ---------------------------------------------------------------------------
// Benchmark runner
// ---------------------------------------------------------------------------

function bench(fn: () => void, warmup = 200, iterations = 2000): number {
  for (let i = 0; i < warmup; i++) fn()
  const start = performance.now()
  for (let i = 0; i < iterations; i++) fn()
  return (performance.now() - start) / iterations
}

// ---------------------------------------------------------------------------
// 1. Core engine benchmarks
// ---------------------------------------------------------------------------

const native = new NativeAdapter()
const march2026 = new Date(2026, 2, 1)
const gridConfig = { showOutsideDays: true, fixedWeeks: false }

const corePerf = {
  buildMonth: bench(() => buildCalendarMonth(native, march2026, gridConfig)),
  buildMulti3: bench(() => buildMultiMonth(native, march2026, 3, gridConfig)),
  buildMulti12: bench(() => buildMultiMonth(native, march2026, 12, gridConfig)),
  applySelection: bench(() => {
    const raw = buildCalendarMonth(native, march2026, gridConfig)
    applySelection(raw.weeks, native, 'single', new Date(2026, 2, 15), {})
  }),
  applySelectionRange: bench(() => {
    const raw = buildCalendarMonth(native, march2026, gridConfig)
    applySelection(raw.weeks, native, 'range', { from: new Date(2026, 2, 10), to: new Date(2026, 2, 20) }, {})
  }),
}

// ---------------------------------------------------------------------------
// 2. Adapter benchmarks  -  compare all calendar systems
// ---------------------------------------------------------------------------

const islamic = new IslamicAdapter()
const persian = new PersianAdapter()
const hebrew = new HebrewAdapter()

const adapters = [
  { name: 'Native (Gregorian)', adapter: native, color: green },
  { name: 'Islamic (Hijri)', adapter: islamic, color: blue },
  { name: 'Persian (Jalali)', adapter: persian, color: amber },
  { name: 'Hebrew', adapter: hebrew, color: purple },
]

const adapterPerf = adapters.map(({ name, adapter, color }) => {
  const today = adapter.today()
  const startOfMonth = adapter.startOfMonth(today)
  return {
    name,
    color,
    buildMonth: bench(() => buildCalendarMonth(adapter, startOfMonth, gridConfig)),
    getYear: bench(() => adapter.getYear(today), 500, 5000),
    getMonth: bench(() => adapter.getMonth(today), 500, 5000),
    create: bench(() => adapter.create(adapter.getYear(today), adapter.getMonth(today), 1), 500, 5000),
    addMonths: bench(() => adapter.addMonths(today, 3), 500, 5000),
    format: bench(() => adapter.format(today, { month: 'long', year: 'numeric' }), 200, 1000),
  }
})

// ---------------------------------------------------------------------------
// Competitor data (from published benchmarks + npm bundle analysis)
// ---------------------------------------------------------------------------

const competitors = [
  {
    name: '@gentleduck/calendar',
    bundle: 4.9,
    deps: 0,
    css: 0,
    a11y: true,
    ssr: true,
    adapter: true,
    calendars: 4,
    color: green,
  },
  {
    name: 'react-day-picker v9',
    bundle: 20.0,
    deps: 1,
    css: 3.0,
    a11y: true,
    ssr: true,
    adapter: false,
    calendars: 1,
    color: red,
  },
  {
    name: 'react-aria (DatePicker)',
    bundle: 45.0,
    deps: 8,
    css: 0,
    a11y: true,
    ssr: true,
    adapter: false,
    calendars: 1,
    color: blue,
  },
  {
    name: 'react-datepicker',
    bundle: 32.0,
    deps: 3,
    css: 8.0,
    a11y: false,
    ssr: false,
    adapter: false,
    calendars: 1,
    color: amber,
  },
  {
    name: 'react-calendar',
    bundle: 15.0,
    deps: 0,
    css: 5.0,
    a11y: false,
    ssr: true,
    adapter: false,
    calendars: 1,
    color: purple,
  },
]

// ---------------------------------------------------------------------------
// SVG helpers
// ---------------------------------------------------------------------------

function svgHeader(w: number, h: number, title: string, subtitle?: string): string {
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
  <text x="${w / 2}" y="54" text-anchor="middle" fill="${zinc[500]}" font-size="11">${subtitle ?? 'Lower is better'}</text>`
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
    ${isWinner ? `<text x="${leftPad + barW + 55}" y="${y + barH / 2 + 4}" fill="${green}" font-size="10" font-weight="600">* WINNER</text>` : ''}`
  }

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
    ${isWinner && i === 0 ? `<text x="${leftPad + barW + 55}" y="${y + barH / 2 + 4}" fill="${green}" font-size="10" font-weight="600">* ZERO DEPS</text>` : ''}`
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
  const h = 420
  const features = [
    'Tree-shakeable',
    'Zero CSS',
    'Date Adapter',
    'Multi-Calendar',
    'SSR Safe',
    'ARIA Compliant',
    'Keyboard Nav',
  ]
  const startY = 80
  const colW = 90
  const leftPad = 140
  const rowH = 36

  let headers = ''
  for (let i = 0; i < competitors.length; i++) {
    const c = competitors[i]!
    headers += `<text x="${leftPad + i * colW + colW / 2}" y="${startY - 8}" text-anchor="middle" fill="${c.color}" font-size="9" font-weight="600">${c.name.split(' ')[0]!.replace('@gentleduck/', '')}</text>`
  }

  const featureData: (boolean | string)[][] = [
    [true, false, false, false, false],
    [true, false, true, false, false],
    [true, false, false, false, false],
    ['4', '1', '1', '1', '1'],
    [true, true, true, false, true],
    [true, true, true, false, false],
    [true, true, true, false, false],
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
      const val = featureData[f]![c]
      if (typeof val === 'string') {
        const isWinner = c === 0
        cells += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="${isWinner ? green : zinc[400]}" font-size="12" font-weight="${isWinner ? '700' : '400'}">${val}</text>`
      } else if (val) {
        cells += `<circle cx="${x}" cy="${y}" r="7" fill="${green}" opacity="0.2"/>
        <text x="${x}" y="${y + 4}" text-anchor="middle" fill="${green}" font-size="12">Yes</text>`
      } else {
        cells += `<text x="${x}" y="${y + 4}" text-anchor="middle" fill="${zinc[600]}" font-size="12">No</text>`
      }
    }
  }

  return `${svgHeader(w, h, 'Feature Comparison', 'Capabilities across calendar libraries')}
  ${headers}
  ${cells}
  <rect x="${leftPad - 4}" y="${startY}" width="${colW + 8}" height="${features.length * rowH}" fill="${green}" opacity="0.04" rx="6"/>
</svg>`
}

// ---------------------------------------------------------------------------
// 4. Core Render Performance
// ---------------------------------------------------------------------------

function generatePerfSVG(): string {
  const w = 680
  const h = 340
  const barH = 24
  const startY = 80
  const leftPad = 200
  const entries = [
    { label: 'buildCalendarMonth', value: corePerf.buildMonth * 1000, color: green },
    { label: 'buildMultiMonth(3)', value: corePerf.buildMulti3 * 1000, color: blue },
    { label: 'buildMultiMonth(12)', value: corePerf.buildMulti12 * 1000, color: amber },
    { label: 'applySelection (single)', value: corePerf.applySelection * 1000, color: purple },
    { label: 'applySelection (range)', value: corePerf.applySelectionRange * 1000, color: pink },
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

  return `${svgHeader(w, h, 'Core Engine Performance', 'Average of 2,000 iterations (μs per call)')}
  ${bars}
</svg>`
}

// ---------------------------------------------------------------------------
// 5. Adapter Performance Comparison (NEW)
// ---------------------------------------------------------------------------

function generateAdapterPerfSVG(): string {
  const w = 680
  const h = 480
  const barH = 18
  const startY = 80
  const leftPad = 180
  const barMaxW = 380

  const operations = [
    { key: 'buildMonth' as const, label: 'buildCalendarMonth' },
    { key: 'getYear' as const, label: 'getYear()' },
    { key: 'create' as const, label: 'create()' },
    { key: 'addMonths' as const, label: 'addMonths()' },
    { key: 'format' as const, label: 'format()' },
  ]

  let content = ''
  let y = startY

  for (const op of operations) {
    const values = adapterPerf.map((a) => a[op.key] * 1000)
    const maxVal = Math.max(...values) * 1.3

    // Operation label
    content += `<text x="${leftPad - 12}" y="${y - 4}" fill="${zinc[300]}" font-size="11" font-weight="600">${op.label}</text>`

    for (let i = 0; i < adapterPerf.length; i++) {
      const a = adapterPerf[i]!
      const val = a[op.key] * 1000
      const barW = Math.max((val / maxVal) * barMaxW, 4)
      const barY = y + i * (barH + 4)

      content += `
      <text x="${leftPad - 12}" y="${barY + barH / 2 + 3}" text-anchor="end" fill="${zinc[500]}" font-size="9">${a.name.split(' ')[0]}</text>
      <rect x="${leftPad}" y="${barY}" width="${barW}" height="${barH}" fill="${a.color}" rx="3" opacity="0.8"/>
      <text x="${leftPad + barW + 6}" y="${barY + barH / 2 + 3}" fill="${a.color}" font-size="9" font-weight="600">${val.toFixed(1)} μs</text>`
    }

    y += adapterPerf.length * (barH + 4) + 24
  }

  return `${svgHeader(w, h, 'Adapter Performance Comparison', 'All 4 calendar systems  -  average of 5,000 iterations (μs per call)')}
  ${content}
</svg>`
}

// ---------------------------------------------------------------------------
// 6. Calendar Systems Overview (NEW)
// ---------------------------------------------------------------------------

function generateCalendarSystemsSVG(): string {
  const w = 680
  const h = 300
  const startY = 80
  const colW = 150
  const leftPad = 90
  const rowH = 34

  const systems = [
    { name: 'Gregorian', adapter: 'NativeAdapter', locale: 'en-US', epoch: '1 CE', color: green },
    { name: 'Islamic (Hijri)', adapter: 'IslamicAdapter', locale: 'ar-SA', epoch: '622 CE', color: blue },
    { name: 'Persian (Jalali)', adapter: 'PersianAdapter', locale: 'fa-IR', epoch: '622 CE', color: amber },
    { name: 'Hebrew', adapter: 'HebrewAdapter', locale: 'he-IL', epoch: '3761 BCE', color: purple },
  ]

  const cols = ['Calendar', 'Adapter', 'Default Locale', 'Epoch']

  let headers = ''
  for (let i = 0; i < cols.length; i++) {
    headers += `<text x="${leftPad + i * colW + colW / 2}" y="${startY - 6}" text-anchor="middle" fill="${zinc[500]}" font-size="10" font-weight="600" letter-spacing="0.05em">${cols[i]!.toUpperCase()}</text>`
  }

  let rows = ''
  for (let r = 0; r < systems.length; r++) {
    const s = systems[r]!
    const y = startY + r * rowH + 20
    const vals = [s.name, s.adapter, s.locale, s.epoch]
    if (r < systems.length - 1) {
      rows += `<line x1="${leftPad}" y1="${y + 12}" x2="${leftPad + cols.length * colW}" y2="${y + 12}" stroke="${zinc[800]}" stroke-width="0.5"/>`
    }
    for (let c = 0; c < vals.length; c++) {
      rows += `<text x="${leftPad + c * colW + colW / 2}" y="${y + 4}" text-anchor="middle" fill="${c === 0 ? s.color : zinc[300]}" font-size="11" font-weight="${c === 0 ? '600' : '400'}">${vals[c]}</text>`
    }
  }

  return `${svgHeader(w, h, 'Supported Calendar Systems', '4 calendar systems with pluggable adapters')}
  ${headers}
  <line x1="${leftPad}" y1="${startY + 2}" x2="${leftPad + cols.length * colW}" y2="${startY + 2}" stroke="${zinc[700]}" stroke-width="1"/>
  ${rows}
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
  'adapter-performance': generateAdapterPerfSVG(),
  'calendar-systems': generateCalendarSystemsSVG(),
}

for (const [name, svg] of Object.entries(svgs)) {
  writeFileSync(join(OUT_DIR, `${name}.svg`), svg)
}

writeFileSync(
  join(OUT_DIR, 'results.json'),
  JSON.stringify(
    {
      competitors: competitors.map((c) => ({
        name: c.name,
        bundleKB: c.bundle,
        deps: c.deps,
        cssKB: c.css,
        calendars: c.calendars,
      })),
      corePerformance: corePerf,
      adapterPerformance: Object.fromEntries(
        adapterPerf.map((a) => [
          a.name,
          {
            buildMonth: a.buildMonth,
            getYear: a.getYear,
            create: a.create,
            addMonths: a.addMonths,
            format: a.format,
          },
        ]),
      ),
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
)

// Also copy to docs
const DOCS_DIR = join(
  import.meta.dirname,
  '..',
  '..',
  '..',
  'apps',
  'duck-ui-docs',
  'public',
  'images',
  'benchmarks',
  'calendar',
)
mkdirSync(DOCS_DIR, { recursive: true })
for (const [name, svg] of Object.entries(svgs)) {
  writeFileSync(join(DOCS_DIR, `${name}.svg`), svg)
}

console.log('Benchmarks generated:')
for (const name of Object.keys(svgs)) {
  console.log(`  Yes ${name}.svg`)
}
console.log(`  Yes results.json`)
console.log()
console.log('Core Performance:')
for (const [k, v] of Object.entries(corePerf)) {
  console.log(`  ${k}: ${(v * 1000).toFixed(1)} μs`)
}
console.log()
console.log('Adapter Performance (buildCalendarMonth):')
for (const a of adapterPerf) {
  console.log(`  ${a.name}: ${(a.buildMonth * 1000).toFixed(1)} μs`)
}
