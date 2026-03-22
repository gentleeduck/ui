#!/usr/bin/env node
/**
 * Benchmark script for @gentleduck/calendar.
 * Measures real performance and outputs JSON data for chart visualization.
 *
 * Output: public/benchmarks/results.json + docs public/data/benchmarks/calendar.json
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
const DOCS_DIR = join(import.meta.dirname, '..', '..', '..', 'apps', 'duck-ui-docs', 'public', 'data', 'benchmarks')
mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(DOCS_DIR, { recursive: true })

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

const corePerformance = {
  buildMonth: {
    label: 'buildCalendarMonth',
    us: +(bench(() => buildCalendarMonth(native, march2026, gridConfig)) * 1000).toFixed(1),
  },
  buildMulti3: {
    label: 'buildMultiMonth(3)',
    us: +(bench(() => buildMultiMonth(native, march2026, 3, gridConfig)) * 1000).toFixed(1),
  },
  buildMulti12: {
    label: 'buildMultiMonth(12)',
    us: +(bench(() => buildMultiMonth(native, march2026, 12, gridConfig)) * 1000).toFixed(1),
  },
  applySelection: {
    label: 'applySelection (single)',
    us: +(
      bench(() => {
        const raw = buildCalendarMonth(native, march2026, gridConfig)
        applySelection(raw.weeks, native, 'single', new Date(2026, 2, 15), {})
      }) * 1000
    ).toFixed(1),
  },
  applySelectionRange: {
    label: 'applySelection (range)',
    us: +(
      bench(() => {
        const raw = buildCalendarMonth(native, march2026, gridConfig)
        applySelection(raw.weeks, native, 'range', { from: new Date(2026, 2, 10), to: new Date(2026, 2, 20) }, {})
      }) * 1000
    ).toFixed(1),
  },
}

// ---------------------------------------------------------------------------
// 2. Adapter benchmarks
// ---------------------------------------------------------------------------

const islamic = new IslamicAdapter()
const persian = new PersianAdapter()
const hebrew = new HebrewAdapter()

const adapterList = [
  { name: 'Native (Gregorian)', adapter: native },
  { name: 'Islamic (Hijri)', adapter: islamic },
  { name: 'Persian (Jalali)', adapter: persian },
  { name: 'Hebrew', adapter: hebrew },
]

const adapterPerformance = adapterList.map(({ name, adapter }) => {
  const today = adapter.today()
  const startOfMonth = adapter.startOfMonth(today)
  return {
    name,
    buildMonth: +(bench(() => buildCalendarMonth(adapter, startOfMonth, gridConfig)) * 1000).toFixed(1),
    getYear: +(bench(() => adapter.getYear(today), 500, 5000) * 1000).toFixed(2),
    create: +(
      bench(() => adapter.create(adapter.getYear(today), adapter.getMonth(today), 1), 500, 5000) * 1000
    ).toFixed(2),
    addMonths: +(bench(() => adapter.addMonths(today, 3), 500, 5000) * 1000).toFixed(2),
    format: +(bench(() => adapter.format(today, { month: 'long', year: 'numeric' }), 200, 1000) * 1000).toFixed(1),
  }
})

// ---------------------------------------------------------------------------
// 3. Bundle size comparison (competitor data from bundlephobia/npm)
// ---------------------------------------------------------------------------

const bundleSize = [
  { name: '@gentleduck/calendar', sizeKB: 4.9, deps: 0, cssKB: 0, calendars: 4 },
  { name: 'react-day-picker v9', sizeKB: 20.0, deps: 1, cssKB: 3.0, calendars: 1 },
  { name: 'react-aria (DatePicker)', sizeKB: 45.0, deps: 8, cssKB: 0, calendars: 1 },
  { name: 'react-datepicker', sizeKB: 32.0, deps: 3, cssKB: 8.0, calendars: 1 },
  { name: 'react-calendar', sizeKB: 15.0, deps: 0, cssKB: 5.0, calendars: 1 },
]

// ---------------------------------------------------------------------------
// 4. Feature comparison
// ---------------------------------------------------------------------------

const features = [
  { feature: 'Tree-shakeable', gentleduck: true, rdp: false, reactAria: false, datepicker: false, reactCal: false },
  { feature: 'Zero CSS', gentleduck: true, rdp: false, reactAria: true, datepicker: false, reactCal: false },
  { feature: 'Date Adapter', gentleduck: true, rdp: false, reactAria: false, datepicker: false, reactCal: false },
  { feature: 'Multi-Calendar', gentleduck: '4', rdp: '1', reactAria: '1', datepicker: '1', reactCal: '1' },
  { feature: 'SSR Safe', gentleduck: true, rdp: true, reactAria: true, datepicker: false, reactCal: true },
  { feature: 'ARIA Compliant', gentleduck: true, rdp: true, reactAria: true, datepicker: false, reactCal: false },
  { feature: 'Keyboard Nav', gentleduck: true, rdp: true, reactAria: true, datepicker: false, reactCal: false },
]

// ---------------------------------------------------------------------------
// Write JSON output
// ---------------------------------------------------------------------------

const results = {
  corePerformance: Object.values(corePerformance),
  adapterPerformance,
  bundleSize,
  features,
  generatedAt: new Date().toISOString(),
}

const json = JSON.stringify(results, null, 2)
writeFileSync(join(OUT_DIR, 'results.json'), json)
writeFileSync(join(DOCS_DIR, 'calendar.json'), json)

console.log('Calendar benchmarks generated (JSON only):')
console.log(`  ${OUT_DIR}/results.json`)
console.log(`  ${DOCS_DIR}/calendar.json`)
console.log()
console.log('Core Performance:')
for (const p of Object.values(corePerformance)) {
  console.log(`  ${p.label}: ${p.us} us`)
}
console.log()
console.log('Adapter Performance (buildCalendarMonth):')
for (const a of adapterPerformance) {
  console.log(`  ${a.name}: ${a.buildMonth} us`)
}
