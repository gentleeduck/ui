#!/usr/bin/env node
/**
 * Benchmark script for @gentleduck/calendar.
 * Measures real performance and outputs JSON data for chart visualization.
 *
 * Output: public/benchmarks/results.json + docs public/data/benchmarks/calendar.json
 * Usage: bun run benchmark
 */

import { execSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
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

function bench(fn: () => void, warmup = 200, iterations = 2000): number {
  for (let i = 0; i < warmup; i++) fn()
  const start = performance.now()
  for (let i = 0; i < iterations; i++) fn()
  return (performance.now() - start) / iterations
}

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

const bundleSize = [
  { name: '@gentleduck/calendar', sizeKB: 4.9, deps: 0, cssKB: 0, calendars: 4 },
  { name: 'react-day-picker v9', sizeKB: 20.0, deps: 1, cssKB: 3.0, calendars: 1 },
  { name: 'react-aria (DatePicker)', sizeKB: 45.0, deps: 8, cssKB: 0, calendars: 1 },
  { name: 'react-datepicker', sizeKB: 32.0, deps: 3, cssKB: 8.0, calendars: 1 },
  { name: 'react-calendar', sizeKB: 15.0, deps: 0, cssKB: 5.0, calendars: 1 },
]

const features = [
  { feature: 'Tree-shakeable', gentleduck: true, rdp: false, reactAria: false, datepicker: false, reactCal: false },
  { feature: 'Zero CSS', gentleduck: true, rdp: false, reactAria: true, datepicker: false, reactCal: false },
  { feature: 'Date Adapter', gentleduck: true, rdp: false, reactAria: false, datepicker: false, reactCal: false },
  { feature: 'Multi-Calendar', gentleduck: '4', rdp: '1', reactAria: '1', datepicker: '1', reactCal: '1' },
  { feature: 'SSR Safe', gentleduck: true, rdp: true, reactAria: true, datepicker: false, reactCal: true },
  { feature: 'ARIA Compliant', gentleduck: true, rdp: true, reactAria: true, datepicker: false, reactCal: false },
  { feature: 'Keyboard Nav', gentleduck: true, rdp: true, reactAria: true, datepicker: false, reactCal: false },
]

const vsReactDayPicker = {
  name: 'react-day-picker',
  comparison: [
    { metric: 'Bundle size', gentleduck: '4.9 KB', competitor: '20 KB', winner: 'gentleduck' },
    { metric: 'Dependencies', gentleduck: '0', competitor: '1 (date-fns)', winner: 'gentleduck' },
    { metric: 'CSS required', gentleduck: 'None', competitor: '3 KB', winner: 'gentleduck' },
    { metric: 'Calendar systems', gentleduck: '4', competitor: '1', winner: 'gentleduck' },
    { metric: 'Date adapters', gentleduck: '7', competitor: '0', winner: 'gentleduck' },
    { metric: 'Selection modes', gentleduck: '4', competitor: '3', winner: 'gentleduck' },
    { metric: 'Headless hook', gentleduck: 'useCalendar', competitor: 'None', winner: 'gentleduck' },
    { metric: 'Compound primitives', gentleduck: 'Yes', competitor: 'No', winner: 'gentleduck' },
    { metric: 'RTL support', gentleduck: 'Yes', competitor: 'Partial', winner: 'gentleduck' },
    { metric: 'Maturity', gentleduck: 'New', competitor: 'Established', winner: 'competitor' },
    { metric: 'React 18', gentleduck: 'No (19+)', competitor: 'Yes', winner: 'competitor' },
  ],
}

const vsReactAria = {
  name: 'react-aria',
  comparison: [
    { metric: 'Bundle size', gentleduck: '4.9 KB', competitor: '45 KB', winner: 'gentleduck' },
    { metric: 'Dependencies', gentleduck: '0', competitor: '8', winner: 'gentleduck' },
    { metric: 'Architecture', gentleduck: 'Headless hook', competitor: 'Hooks + Components', winner: 'tie' },
    { metric: 'Calendar systems', gentleduck: '4', competitor: '1', winner: 'gentleduck' },
    { metric: 'Date adapters', gentleduck: '7 (pluggable)', competitor: '0 (built-in)', winner: 'gentleduck' },
    { metric: 'ARIA compliance', gentleduck: 'Full', competitor: 'Full', winner: 'tie' },
    { metric: 'Keyboard nav', gentleduck: 'Full', competitor: 'Full', winner: 'tie' },
    { metric: 'Internationalization', gentleduck: 'Via adapters', competitor: 'Built-in', winner: 'competitor' },
    { metric: 'Maturity', gentleduck: 'New', competitor: 'Battle-tested', winner: 'competitor' },
  ],
}

const vsReactDatepicker = {
  name: 'react-datepicker',
  comparison: [
    { metric: 'Bundle size', gentleduck: '4.9 KB', competitor: '32 KB', winner: 'gentleduck' },
    { metric: 'Dependencies', gentleduck: '0', competitor: '3', winner: 'gentleduck' },
    { metric: 'CSS required', gentleduck: 'None', competitor: '8 KB', winner: 'gentleduck' },
    { metric: 'Headless', gentleduck: 'Yes', competitor: 'No (styled)', winner: 'gentleduck' },
    { metric: 'ARIA compliance', gentleduck: 'Full', competitor: 'Partial', winner: 'gentleduck' },
    { metric: 'Keyboard nav', gentleduck: 'Full', competitor: 'Partial', winner: 'gentleduck' },
    { metric: 'SSR safe', gentleduck: 'Yes', competitor: 'No', winner: 'gentleduck' },
    { metric: 'Time picker', gentleduck: 'useTimePicker', competitor: 'Built-in', winner: 'tie' },
    { metric: 'Popularity', gentleduck: 'New', competitor: '10M+ downloads/mo', winner: 'competitor' },
  ],
}

const vsReactCalendar = {
  name: 'react-calendar',
  comparison: [
    { metric: 'Bundle size', gentleduck: '4.9 KB', competitor: '15 KB', winner: 'gentleduck' },
    { metric: 'CSS required', gentleduck: 'None', competitor: '5 KB', winner: 'gentleduck' },
    { metric: 'Headless', gentleduck: 'Yes', competitor: 'No (styled)', winner: 'gentleduck' },
    { metric: 'Calendar systems', gentleduck: '4', competitor: '1', winner: 'gentleduck' },
    { metric: 'Selection modes', gentleduck: '4', competitor: '1', winner: 'gentleduck' },
    { metric: 'ARIA compliance', gentleduck: 'Full', competitor: 'Partial', winner: 'gentleduck' },
    { metric: 'React 18', gentleduck: 'No (19+)', competitor: 'Yes', winner: 'competitor' },
    { metric: 'Simplicity', gentleduck: 'Hook-based', competitor: 'Drop-in', winner: 'competitor' },
  ],
}

const libraryComparisons = [vsReactDayPicker, vsReactAria, vsReactDatepicker, vsReactCalendar]

// Total cost (JS + CSS)
const totalCost = bundleSize.map((b) => ({
  name: b.name,
  js: b.sizeKB,
  css: b.cssKB,
  total: +(b.sizeKB + b.cssKB).toFixed(1),
}))

function getModuleSizes(): { name: string; sizeKB: number }[] {
  const distDir = join(import.meta.dirname, '..', 'dist')
  const sizes: { name: string; sizeKB: number }[] = []
  for (const name of readdirSync(distDir)) {
    const dir = join(distDir, name)
    if (!statSync(dir).isDirectory()) continue
    try {
      statSync(join(dir, 'index.js'))
    } catch {
      continue
    }
    const jsFiles = readdirSync(dir)
      .filter((f) => f.endsWith('.js') && !f.endsWith('.map'))
      .map((f) => join(dir, f))
    if (jsFiles.length === 0) continue
    try {
      const gz = execSync(`cat ${jsFiles.map((f) => `"${f}"`).join(' ')} | gzip -c | wc -c`, {
        encoding: 'utf-8',
      }).trim()
      sizes.push({ name, sizeKB: +(Number.parseInt(gz, 10) / 1024).toFixed(1) })
    } catch {
      /* skip */
    }
  }
  return sizes.sort((a, b) => b.sizeKB - a.sizeKB)
}

const moduleSizes = getModuleSizes()

const results = {
  corePerformance: Object.values(corePerformance),
  adapterPerformance,
  bundleSize,
  totalCost,
  features,
  libraryComparisons,
  moduleSizes,
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
