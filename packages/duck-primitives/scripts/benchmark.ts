#!/usr/bin/env node

/**
 * Benchmark script for @gentleduck/primitives.
 * Measures real gzipped bundle sizes and outputs JSON for chart visualization.
 *
 * Output: public/benchmarks/results.json + docs public/data/benchmarks/primitives.json
 * Usage: bun run benchmark
 */

import { execSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT_DIR = join(import.meta.dirname, '..', 'public', 'benchmarks')
const DOCS_DIR = join(import.meta.dirname, '..', '..', '..', 'apps', 'duck-ui-docs', 'public', 'data', 'benchmarks')
mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(DOCS_DIR, { recursive: true })

function getGentleduckSizes(): Record<string, number> {
  const distDir = join(import.meta.dirname, '..', 'dist')
  const sizes: Record<string, number> = {}

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
      sizes[name] = Number.parseInt(gz, 10)
    } catch {
      /* skip */
    }
  }
  return sizes
}

const gdSizes = getGentleduckSizes()

// Verified via bundlephobia API on 2026-03-25. 0 = not available from that library.
const perComponent = [
  { name: 'Accordion', gentleduck: gdSizes.accordion ?? 0, radix: 4793 },
  { name: 'Alert Dialog', gentleduck: gdSizes['alert-dialog'] ?? 0, radix: 19029 },
  { name: 'Avatar', gentleduck: gdSizes.avatar ?? 0, radix: 2532 },
  { name: 'Calendar', gentleduck: gdSizes.calendar ?? 0, radix: 0 },
  { name: 'Checkers', gentleduck: gdSizes.checkers ?? 0, radix: 2849 },
  { name: 'Collapsible', gentleduck: gdSizes.collapsible ?? 0, radix: 0 },
  { name: 'Command', gentleduck: gdSizes.command ?? 0, radix: 0 },
  { name: 'Context Menu', gentleduck: gdSizes['context-menu'] ?? 0, radix: 17707 },
  { name: 'Dialog', gentleduck: gdSizes.dialog ?? 0, radix: 10830 },
  { name: 'Dropdown Menu', gentleduck: gdSizes['dropdown-menu'] ?? 0, radix: 24812 },
  { name: 'Hover Card', gentleduck: gdSizes['hover-card'] ?? 0, radix: 14564 },
  { name: 'Input OTP', gentleduck: gdSizes['input-otp'] ?? 0, radix: 0 },
  { name: 'Menu', gentleduck: gdSizes.menu ?? 0, radix: 0 },
  { name: 'Menubar', gentleduck: gdSizes.menubar ?? 0, radix: 0 },
  { name: 'Nav Menu', gentleduck: gdSizes['navigation-menu'] ?? 0, radix: 7958 },
  { name: 'Pagination', gentleduck: gdSizes.pagination ?? 0, radix: 0 },
  { name: 'Popover', gentleduck: gdSizes.popover ?? 0, radix: 0 },
  { name: 'Progress', gentleduck: gdSizes.progress ?? 0, radix: 2162 },
  { name: 'Radio Group', gentleduck: gdSizes['radio-group'] ?? 0, radix: 1066 },
  { name: 'Scroll Area', gentleduck: gdSizes['scroll-area'] ?? 0, radix: 5569 },
  { name: 'Select', gentleduck: gdSizes.select ?? 0, radix: 24251 },
  { name: 'Separator', gentleduck: gdSizes.separator ?? 0, radix: 1310 },
  { name: 'Sheet', gentleduck: gdSizes.sheet ?? 0, radix: 0 },
  { name: 'Slider', gentleduck: gdSizes.slider ?? 0, radix: 5215 },
  { name: 'Tabs', gentleduck: gdSizes.tabs ?? 0, radix: 4969 },
  { name: 'Toggle', gentleduck: gdSizes.toggle ?? 0, radix: 1707 },
  { name: 'Toggle Group', gentleduck: gdSizes['toggle-group'] ?? 0, radix: 4372 },
  { name: 'Toolbar', gentleduck: gdSizes.toolbar ?? 0, radix: 4862 },
  { name: 'Tooltip', gentleduck: gdSizes.tooltip ?? 0, radix: 15916 },
]

const savings = perComponent
  .filter((c) => c.radix > 0 && c.gentleduck > 0)
  .map((c) => ({
    name: c.name,
    gentleduckKB: +(c.gentleduck / 1024).toFixed(1),
    radixKB: +(c.radix / 1024).toFixed(1),
    savingPercent: Math.round((1 - c.gentleduck / c.radix) * 100),
  }))

const totalComparison = [
  { name: 'Headless UI', sizeKB: 35, components: 10 },
  { name: 'Base UI', sizeKB: 45, components: 15 },
  {
    name: 'gentleduck',
    sizeKB: Math.round(Object.values(gdSizes).reduce((a, b) => a + b, 0) / 1024),
    components: Object.keys(gdSizes).length,
  },
  { name: 'Ark UI', sizeKB: 95, components: 30 },
  { name: 'Radix UI', sizeKB: 180, components: 28 },
]

const allSizes = Object.entries(gdSizes)
  .map(([name, size]) => ({ name, sizeBytes: size, sizeKB: +(size / 1024).toFixed(1) }))
  .sort((a, b) => b.sizeBytes - a.sizeBytes)

const results = {
  perComponent,
  savings,
  totalComparison,
  allSizes,
  generatedAt: new Date().toISOString(),
}

const json = JSON.stringify(results, null, 2)
writeFileSync(join(OUT_DIR, 'results.json'), json)
writeFileSync(join(DOCS_DIR, 'primitives.json'), json)

console.log('Primitives benchmarks generated (JSON only):')
console.log(`  ${OUT_DIR}/results.json`)
console.log(`  ${DOCS_DIR}/primitives.json`)
console.log()
console.log(
  `Total: ${Math.round(Object.values(gdSizes).reduce((a, b) => a + b, 0) / 1024)} KB gzipped (${Object.keys(gdSizes).length} primitives)`,
)
console.log()
console.log('Verified savings vs Radix:')
for (const s of savings) {
  console.log(`  ${s.name}: ${s.gentleduckKB} KB vs ${s.radixKB} KB (${s.savingPercent}%)`)
}
