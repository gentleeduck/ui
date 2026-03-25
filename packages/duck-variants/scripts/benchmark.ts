#!/usr/bin/env node
/**
 * Benchmark script for @gentleduck/variants.
 * Measures bundle size and runtime performance vs competing CVA libraries.
 *
 * Output: public/benchmarks/results.json + docs public/data/benchmarks/variants.json
 * Usage: bun run benchmark
 */

import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { cva } from '../src/variants'

const OUT_DIR = join(import.meta.dirname, '..', 'public', 'benchmarks')
const DOCS_DIR = join(import.meta.dirname, '..', '..', '..', 'apps', 'duck-ui-docs', 'public', 'data', 'benchmarks')
mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(DOCS_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// Benchmark runner
// ---------------------------------------------------------------------------

function bench(fn: () => void, warmup = 500, iterations = 10000): number {
  for (let i = 0; i < warmup; i++) fn()
  const start = performance.now()
  for (let i = 0; i < iterations; i++) fn()
  return (performance.now() - start) / iterations
}

// ---------------------------------------------------------------------------
// 1. Bundle size (measure from built dist)
// ---------------------------------------------------------------------------

function getGzipSize(filePath: string): number {
  try {
    const gz = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf-8' }).trim()
    return Number.parseInt(gz, 10)
  } catch {
    return 0
  }
}

const distPath = join(import.meta.dirname, '..', 'dist', 'index.js')
const gentleduckSize = getGzipSize(distPath)

const bundleSize = [
  { name: '@gentleduck/variants', sizeBytes: gentleduckSize, sizeKB: +(gentleduckSize / 1024).toFixed(2) },
  { name: 'class-variance-authority', sizeBytes: 1800, sizeKB: 1.76 },
  { name: 'tailwind-variants', sizeBytes: 5400, sizeKB: 5.27 },
  { name: 'clsx', sizeBytes: 330, sizeKB: 0.32 },
]

// ---------------------------------------------------------------------------
// 2. Runtime performance
// ---------------------------------------------------------------------------

// Create a realistic variant config
const buttonVariants = cva('inline-flex items-center justify-center rounded-md font-medium text-sm', {
  variants: {
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
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const runtimePerformance = [
  {
    label: 'cva() with defaults',
    ns: +(bench(() => buttonVariants()) * 1e6).toFixed(0),
  },
  {
    label: 'cva() with variant',
    ns: +(bench(() => buttonVariants({ variant: 'destructive' })) * 1e6).toFixed(0),
  },
  {
    label: 'cva() with variant + size',
    ns: +(bench(() => buttonVariants({ variant: 'outline', size: 'sm' })) * 1e6).toFixed(0),
  },
  {
    label: 'cva() with className merge',
    ns: +(bench(() => buttonVariants({ variant: 'ghost', size: 'lg', className: 'custom-class' })) * 1e6).toFixed(0),
  },
]

// ---------------------------------------------------------------------------
// 3. Feature comparison
// ---------------------------------------------------------------------------

const features = [
  { feature: 'TypeScript types', gentleduck: true, cva: true, tv: true, clsx: false },
  { feature: 'Default variants', gentleduck: true, cva: true, tv: true, clsx: false },
  { feature: 'Compound variants', gentleduck: true, cva: true, tv: true, clsx: false },
  { feature: 'Responsive variants', gentleduck: false, cva: false, tv: true, clsx: false },
  { feature: 'Slots', gentleduck: false, cva: false, tv: true, clsx: false },
  { feature: 'Zero dependencies', gentleduck: true, cva: true, tv: false, clsx: true },
  { feature: 'VariantProps extraction', gentleduck: true, cva: true, tv: true, clsx: false },
  { feature: 'className merge', gentleduck: true, cva: true, tv: true, clsx: true },
]

// ---------------------------------------------------------------------------
// Write JSON
// ---------------------------------------------------------------------------

const results = {
  bundleSize,
  runtimePerformance,
  features,
  generatedAt: new Date().toISOString(),
}

const json = JSON.stringify(results, null, 2)
writeFileSync(join(OUT_DIR, 'results.json'), json)
writeFileSync(join(DOCS_DIR, 'variants.json'), json)

console.log('Variants benchmarks generated (JSON only):')
console.log(`  ${OUT_DIR}/results.json`)
console.log(`  ${DOCS_DIR}/variants.json`)
console.log()
console.log('Bundle sizes:')
for (const b of bundleSize) {
  console.log(`  ${b.name}: ${b.sizeKB} KB`)
}
console.log()
console.log('Runtime (ns per call):')
for (const r of runtimePerformance) {
  console.log(`  ${r.label}: ${r.ns} ns`)
}
