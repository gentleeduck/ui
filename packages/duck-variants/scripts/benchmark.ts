#!/usr/bin/env bun
/**
 * Benchmark script for @gentleduck/variants.
 * Measures bundle size and runtime performance vs competing CVA libraries.
 *
 * Output: public/benchmarks/results.json + docs public/data/benchmarks/variants.json
 * Usage: bun run benchmark
 *
 * Requires devDeps: class-variance-authority, tailwind-variants, clsx
 */

import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { cva } from '../src/variants'

const scriptStart = performance.now()

const PKG_DIR = join(import.meta.dirname, '..')
const OUT_DIR = join(PKG_DIR, 'public', 'benchmarks')
const DOCS_DIR = join(PKG_DIR, '..', '..', 'apps', 'duck-ui-docs', 'public', 'data', 'benchmarks')
mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(DOCS_DIR, { recursive: true })

function tryExec(cmd: string): string | null {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

const environment = {
  node: process.version,
  bun: typeof Bun !== 'undefined' ? Bun.version : null,
  platform: process.platform,
  arch: process.arch,
  cpu: os.cpus()[0]?.model ?? null,
  cpuCount: os.cpus().length,
  totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
  commit: tryExec('git rev-parse HEAD'),
  branch: tryExec('git rev-parse --abbrev-ref HEAD'),
}

type Stats = {
  meanNs: number
  medianNs: number
  p95Ns: number
  p99Ns: number
  minNs: number
  maxNs: number
  stddevNs: number
  rmeP: number
  samples: number
  opsPerSec: number
  durationMs: number
}

function summarize(samplesMs: number[], durationMs: number): Stats {
  const sorted = [...samplesMs].sort((a, b) => a - b)
  const n = sorted.length
  const mean = sorted.reduce((a, b) => a + b, 0) / n
  const variance = sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  const stddev = Math.sqrt(variance)
  const sem = stddev / Math.sqrt(n)
  const rme = (sem * 1.96) / mean

  const pick = (p: number) => sorted[Math.min(n - 1, Math.floor(n * p))]!
  const toNs = (ms: number) => +(ms * 1e6).toFixed(1)
  const medianNs = toNs(pick(0.5))

  return {
    meanNs: toNs(mean),
    medianNs,
    p95Ns: toNs(pick(0.95)),
    p99Ns: toNs(pick(0.99)),
    minNs: toNs(sorted[0]!),
    maxNs: toNs(sorted[n - 1]!),
    stddevNs: toNs(stddev),
    rmeP: +(rme * 100).toFixed(2),
    samples: n,
    opsPerSec: medianNs > 0 ? Math.round(1e9 / medianNs) : 0,
    durationMs: +durationMs.toFixed(2),
  }
}

type BenchOptions = { warmup?: number; samples?: number; innerIterations?: number }

function bench(fn: () => void, opts: BenchOptions = {}): Stats {
  const { warmup = 2000, samples = 50, innerIterations = 2000 } = opts

  const benchStart = performance.now()
  for (let i = 0; i < warmup; i++) fn()

  const perIterMs: number[] = new Array(samples)
  for (let s = 0; s < samples; s++) {
    const start = performance.now()
    for (let i = 0; i < innerIterations; i++) fn()
    perIterMs[s] = (performance.now() - start) / innerIterations
  }
  return summarize(perIterMs, performance.now() - benchStart)
}

type Column = { key: string; label: string; align?: 'left' | 'right' }

function printTable(title: string, columns: Column[], rows: Record<string, unknown>[]): void {
  const headers = columns.map((c) => c.label)
  const data = rows.map((r) => columns.map((c) => (r[c.key] == null ? '-' : String(r[c.key]))))

  const widths = columns.map((_, i) => Math.max(headers[i]!.length, ...data.map((r) => r[i]!.length)))

  const pad = (s: string, w: number, align: 'left' | 'right' = 'left') =>
    align === 'right' ? s.padStart(w) : s.padEnd(w)

  const line = (ch: '─' | '═', left: string, mid: string, right: string) =>
    left + widths.map((w) => ch.repeat(w + 2)).join(mid) + right

  const row = (cells: string[]) => '│ ' + cells.map((c, i) => pad(c, widths[i]!, columns[i]!.align)).join(' │ ') + ' │'

  console.log(`\n  ${title}`)
  console.log('  ' + line('─', '┌', '┬', '┐'))
  console.log('  ' + row(headers))
  console.log('  ' + line('═', '╞', '╪', '╡'))
  for (let i = 0; i < data.length; i++) {
    console.log('  ' + row(data[i]!))
    if (i < data.length - 1) console.log('  ' + line('─', '├', '┼', '┤'))
  }
  console.log('  ' + line('─', '└', '┴', '┘'))
}

type Libs = {
  cva?: typeof import('class-variance-authority').cva
  tv?: typeof import('tailwind-variants').tv
  clsx?: typeof import('clsx').clsx
}

async function loadLibs(): Promise<Libs> {
  const libs: Libs = {}
  try {
    libs.cva = (await import('class-variance-authority')).cva
  } catch {
    console.warn('skip: class-variance-authority not installed')
  }
  try {
    libs.tv = (await import('tailwind-variants')).tv
  } catch {
    console.warn('skip: tailwind-variants not installed')
  }
  try {
    libs.clsx = (await import('clsx')).clsx
  } catch {
    console.warn('skip: clsx not installed')
  }
  return libs
}

const libs = await loadLibs()

type BundleNumbers = {
  shippedBytes: number | null
  fullApiBytes: number | null
  realImportBytes: number | null
  errors: string[]
}

async function bundleSnippet(code: string, label: string): Promise<{ bytes: number | null; error?: string }> {
  const tmpFile = join(PKG_DIR, `.bench-${label}-${Date.now()}.ts`)
  writeFileSync(tmpFile, code)
  try {
    const result = await Bun.build({
      entrypoints: [tmpFile],
      minify: true,
      target: 'browser',
      format: 'esm',
      external: [],
    })
    if (!result.success) {
      return { bytes: null, error: result.logs.map((l) => String(l)).join('; ') }
    }
    const out = await result.outputs[0]!.text()
    return { bytes: gzipSync(out).length }
  } catch (e) {
    return { bytes: null, error: String(e) }
  } finally {
    try {
      unlinkSync(tmpFile)
    } catch {
      /* best effort */
    }
  }
}

async function measureShipped(packageName: string): Promise<{ bytes: number | null; error?: string }> {
  try {
    const entry = require.resolve(packageName, { paths: [PKG_DIR] })
    return { bytes: gzipSync(readFileSync(entry)).length }
  } catch (e) {
    return { bytes: null, error: `resolve failed: ${String(e)}` }
  }
}

type LibraryDescriptor = {
  name: string
  packageName: string
  mainExport: string // e.g. 'cva', 'tv', 'clsx'
}

const libraryDescriptors: LibraryDescriptor[] = [
  { name: '@gentleduck/variants', packageName: '@gentleduck/variants', mainExport: 'cva' },
  { name: 'class-variance-authority', packageName: 'class-variance-authority', mainExport: 'cva' },
  { name: 'tailwind-variants', packageName: 'tailwind-variants', mainExport: 'tv' },
  { name: 'clsx', packageName: 'clsx', mainExport: 'clsx' },
]

async function measureBundle(desc: LibraryDescriptor): Promise<BundleNumbers> {
  const errors: string[] = []

  const shipped = await measureShipped(desc.packageName)
  if (shipped.error) errors.push(`shipped: ${shipped.error}`)

  const fullApi = await bundleSnippet(
    `export * from '${desc.packageName}'\n`,
    `full-${desc.packageName.replace(/[@/]/g, '-')}`,
  )
  if (fullApi.error) errors.push(`fullApi: ${fullApi.error}`)

  // `globalThis.__sink` forces the import to be preserved through tree-shaking.
  const realImport = await bundleSnippet(
    `import { ${desc.mainExport} } from '${desc.packageName}'\n` + `;(globalThis as any).__sink = ${desc.mainExport}\n`,
    `real-${desc.packageName.replace(/[@/]/g, '-')}`,
  )
  if (realImport.error) errors.push(`realImport: ${realImport.error}`)

  return {
    shippedBytes: shipped.bytes,
    fullApiBytes: fullApi.bytes,
    realImportBytes: realImport.bytes,
    errors,
  }
}

const bundleSize = await Promise.all(
  libraryDescriptors.map(async (desc) => {
    const nums = await measureBundle(desc)
    if (nums.errors.length) console.warn(`${desc.name}: ${nums.errors.join(' | ')}`)
    return {
      name: desc.name,
      shippedBytes: nums.shippedBytes,
      shippedKB: nums.shippedBytes == null ? null : +(nums.shippedBytes / 1024).toFixed(2),
      fullApiBytes: nums.fullApiBytes,
      fullApiKB: nums.fullApiBytes == null ? null : +(nums.fullApiBytes / 1024).toFixed(2),
      realImportBytes: nums.realImportBytes,
      realImportKB: nums.realImportBytes == null ? null : +(nums.realImportBytes / 1024).toFixed(2),
    }
  }),
)

const baseClass = 'inline-flex items-center justify-center rounded-md font-medium text-sm'

const variantConfig = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
} as const

const defaults = { variant: 'default', size: 'default' } as const

const gentleBtn = cva(baseClass, { variants: variantConfig, defaultVariants: defaults })
const cvaBtn = libs.cva?.(baseClass, { variants: variantConfig, defaultVariants: defaults })
const tvBtn = libs.tv?.({ base: baseClass, variants: variantConfig, defaultVariants: defaults })

// clsx has no variant concept — skipped in runtime comparison.

type Scenario = { id: string; label: string; props: Record<string, string> }

const scenarios: Scenario[] = [
  { id: 'defaults', label: 'defaults only', props: {} },
  { id: 'variant', label: 'one variant', props: { variant: 'destructive' } },
  { id: 'variant_size', label: 'variant + size', props: { variant: 'outline', size: 'sm' } },
  {
    id: 'class_merge',
    label: 'with className merge',
    props: { variant: 'ghost', size: 'lg', className: 'custom-class' },
  },
]

type Runner = (props: Record<string, unknown>) => string

const runners: Array<{ name: string; run: Runner }> = [
  { name: '@gentleduck/variants', run: (p) => gentleBtn(p as never) },
  ...(cvaBtn ? [{ name: 'class-variance-authority', run: ((p) => cvaBtn(p as never)) as Runner }] : []),
  ...(tvBtn ? [{ name: 'tailwind-variants', run: ((p) => tvBtn(p as never)) as Runner }] : []),
]

// warm: same props every call — best case, favors memoizing libs
// cold: unique className per call — defeats memoization, reflects dynamic usage
function benchScenario(run: Runner, props: Record<string, string>) {
  const warm = bench(() => void run(props))

  let counter = 0
  const cold = bench(() => {
    counter++
    run({ ...props, className: `k-${counter}` })
  })

  return { warm, cold }
}

const runtimePerformance = scenarios.map((scenario) => ({
  scenario: scenario.id,
  label: scenario.label,
  warmNote: 'same props object reused each call',
  coldNote: 'unique className per call, defeats memoization; includes object alloc cost',
  results: runners.map(({ name, run }) => ({
    library: name,
    ...benchScenario(run, scenario.props),
  })),
}))

const features = {
  selfReported: true,
  rows: [
    { feature: 'TypeScript types', gentleduck: true, cva: true, tv: true, clsx: false },
    { feature: 'Default variants', gentleduck: true, cva: true, tv: true, clsx: false },
    { feature: 'Compound variants', gentleduck: true, cva: true, tv: true, clsx: false },
    { feature: 'Responsive variants', gentleduck: false, cva: false, tv: true, clsx: false },
    { feature: 'Slots', gentleduck: false, cva: false, tv: true, clsx: false },
    { feature: 'Zero dependencies', gentleduck: true, cva: true, tv: false, clsx: true },
    { feature: 'VariantProps extraction', gentleduck: true, cva: true, tv: true, clsx: false },
    { feature: 'className merge', gentleduck: true, cva: true, tv: true, clsx: true },
    { feature: 'Memoized output', gentleduck: true, cva: false, tv: false, clsx: false },
  ],
}

const totalDurationMs = +(performance.now() - scriptStart).toFixed(2)

const results = {
  environment,
  bundleSize: {
    methodology: {
      shipped: 'gzip of the exact file resolved from node_modules (what npm ships)',
      fullApi: "bundle `export * from '<pkg>'`, minify with Bun, gzip (full surface-area cost)",
      realImport:
        'bundle importing only the main export with a side-effect sink, minify, gzip (typical per-import cost)',
    },
    results: bundleSize,
  },
  runtimePerformance,
  features,
  generatedAt: new Date().toISOString(),
  totalDurationMs,
  reproCommand: `cd packages/duck-variants && bun run benchmark${environment.commit ? ` # at ${environment.commit.slice(0, 7)}` : ''}`,
}

const json = JSON.stringify(results, null, 2)
writeFileSync(join(OUT_DIR, 'results.json'), json)
writeFileSync(join(DOCS_DIR, 'variants.json'), json)

console.log('')
console.log('  Variants benchmark')
console.log(
  `  ${environment.platform}/${environment.arch} · ${environment.cpu ?? 'unknown CPU'} · ${environment.cpuCount} cores`,
)
console.log(`  node ${environment.node}${environment.bun ? ` · bun ${environment.bun}` : ''}`)
if (environment.commit) console.log(`  commit ${environment.commit.slice(0, 7)} (${environment.branch})`)

// 1. Bundle size — three columns, same methodology for every row
printTable(
  'Bundle size (gzipped bytes)',
  [
    { key: 'name', label: 'library', align: 'left' },
    { key: 'shipped', label: 'shipped', align: 'right' },
    { key: 'fullApi', label: 'full API', align: 'right' },
    { key: 'realImport', label: 'real import', align: 'right' },
  ],
  bundleSize.map((b) => ({
    name: b.name,
    shipped: b.shippedBytes ?? 'n/a',
    fullApi: b.fullApiBytes ?? 'n/a',
    realImport: b.realImportBytes ?? 'n/a',
  })),
)

console.log('')
console.log('  shipped     = gzip of the raw file npm ships')
console.log('  full API    = bundle `export *`, minify, gzip')
console.log('  real import = bundle `import { main }`, minify, gzip (what an app actually pays)')

// 2. Runtime — one table per scenario
for (const s of runtimePerformance) {
  const rows = s.results.flatMap((r) => [
    {
      library: r.library,
      mode: 'warm',
      median: r.warm.medianNs,
      mean: r.warm.meanNs,
      p95: r.warm.p95Ns,
      p99: r.warm.p99Ns,
      stddev: r.warm.stddevNs,
      'rme%': r.warm.rmeP,
    },
    {
      library: '',
      mode: 'cold',
      median: r.cold.medianNs,
      mean: r.cold.meanNs,
      p95: r.cold.p95Ns,
      p99: r.cold.p99Ns,
      stddev: r.cold.stddevNs,
      'rme%': r.cold.rmeP,
    },
  ])

  printTable(
    `Runtime · ${s.label} (ns/op)`,
    [
      { key: 'library', label: 'library', align: 'left' },
      { key: 'mode', label: 'mode', align: 'left' },
      { key: 'median', label: 'median', align: 'right' },
      { key: 'mean', label: 'mean', align: 'right' },
      { key: 'p95', label: 'p95', align: 'right' },
      { key: 'p99', label: 'p99', align: 'right' },
      { key: 'stddev', label: 'stddev', align: 'right' },
      { key: 'rme%', label: 'rme%', align: 'right' },
    ],
    rows,
  )
}

// 3. Features
const tick = (v: boolean) => (v ? '✓' : '·')
printTable(
  'Features (self-reported)',
  [
    { key: 'feature', label: 'feature', align: 'left' },
    { key: 'gentleduck', label: 'gentleduck', align: 'left' },
    { key: 'cva', label: 'cva', align: 'left' },
    { key: 'tv', label: 'tv', align: 'left' },
    { key: 'clsx', label: 'clsx', align: 'left' },
  ],
  features.rows.map((r) => ({
    feature: r.feature,
    gentleduck: tick(r.gentleduck),
    cva: tick(r.cva),
    tv: tick(r.tv),
    clsx: tick(r.clsx),
  })),
)

console.log('')
console.log(`  JSON written to:`)
console.log(`    ${OUT_DIR}/results.json`)
console.log(`    ${DOCS_DIR}/variants.json`)
console.log('')
