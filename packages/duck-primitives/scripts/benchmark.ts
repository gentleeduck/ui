#!/usr/bin/env node

/**
 * Benchmark script for @gentleduck/primitives.
 * Measures real gzipped bundle sizes and outputs JSON for chart visualization.
 *
 * gentleduck sizes come from the built dist/ output. Radix UI and Base UI sizes
 * come from bundling each installed package in isolation with esbuild (minified,
 * react/react-dom externalized) and gzipping the result — the same approach
 * bundlephobia uses, so numbers are comparable across libraries that ship
 * unbundled source instead of a prebuilt per-component dist.
 *
 * Output: public/benchmarks/results.json + docs public/data/benchmarks/primitives.json
 * Usage: bun run benchmark
 */

import { execSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import * as esbuild from 'esbuild'

const OUT_DIR = join(import.meta.dirname, '..', 'public', 'benchmarks')
const DOCS_DIR = join(import.meta.dirname, '..', '..', '..', 'apps', 'duck', 'public', 'data', 'benchmarks')
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

/**
 * Bundles a package/subpath in isolation (via esbuild stdin + resolveDir, so no
 * temp files are needed and node_modules resolution stays anchored to this
 * package) and returns its gzipped size.
 */
async function measureExternalPackage(specifier: string, resolveDir: string): Promise<number | null> {
  try {
    const result = await esbuild.build({
      stdin: { contents: `export * from '${specifier}'\n`, resolveDir, loader: 'ts' },
      bundle: true,
      minify: true,
      format: 'esm',
      platform: 'browser',
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      write: false,
      logLevel: 'silent',
    })
    return gzipSync(Buffer.from(result.outputFiles[0].contents)).length
  } catch {
    return null
  }
}

async function measureAll(map: Record<string, string>, resolveDir: string): Promise<Record<string, number>> {
  const sizes: Record<string, number> = {}
  for (const [name, specifier] of Object.entries(map)) {
    const size = await measureExternalPackage(specifier, resolveDir)
    if (size != null) sizes[name] = size
  }
  return sizes
}

// Component name -> package specifier. Omitted = library ships no equivalent primitive.
const radixPackages: Record<string, string> = {
  Accordion: '@radix-ui/react-accordion',
  'Alert Dialog': '@radix-ui/react-alert-dialog',
  Avatar: '@radix-ui/react-avatar',
  Checkers: '@radix-ui/react-checkbox',
  Collapsible: '@radix-ui/react-collapsible',
  'Context Menu': '@radix-ui/react-context-menu',
  Dialog: '@radix-ui/react-dialog',
  'Dropdown Menu': '@radix-ui/react-dropdown-menu',
  'Hover Card': '@radix-ui/react-hover-card',
  'Nav Menu': '@radix-ui/react-navigation-menu',
  Popover: '@radix-ui/react-popover',
  Progress: '@radix-ui/react-progress',
  'Radio Group': '@radix-ui/react-radio-group',
  'Scroll Area': '@radix-ui/react-scroll-area',
  Select: '@radix-ui/react-select',
  Separator: '@radix-ui/react-separator',
  Slider: '@radix-ui/react-slider',
  Tabs: '@radix-ui/react-tabs',
  Toggle: '@radix-ui/react-toggle',
  'Toggle Group': '@radix-ui/react-toggle-group',
  Toolbar: '@radix-ui/react-toolbar',
  Tooltip: '@radix-ui/react-tooltip',
}

const baseuiPackages: Record<string, string> = {
  Accordion: '@base-ui-components/react/accordion',
  'Alert Dialog': '@base-ui-components/react/alert-dialog',
  Avatar: '@base-ui-components/react/avatar',
  Checkers: '@base-ui-components/react/checkbox',
  Collapsible: '@base-ui-components/react/collapsible',
  'Context Menu': '@base-ui-components/react/context-menu',
  Dialog: '@base-ui-components/react/dialog',
  'Dropdown Menu': '@base-ui-components/react/menu',
  'Hover Card': '@base-ui-components/react/preview-card',
  Menubar: '@base-ui-components/react/menubar',
  'Nav Menu': '@base-ui-components/react/navigation-menu',
  Popover: '@base-ui-components/react/popover',
  Progress: '@base-ui-components/react/progress',
  'Radio Group': '@base-ui-components/react/radio-group',
  'Scroll Area': '@base-ui-components/react/scroll-area',
  Select: '@base-ui-components/react/select',
  Separator: '@base-ui-components/react/separator',
  Slider: '@base-ui-components/react/slider',
  Tabs: '@base-ui-components/react/tabs',
  Toggle: '@base-ui-components/react/toggle',
  'Toggle Group': '@base-ui-components/react/toggle-group',
  Toolbar: '@base-ui-components/react/toolbar',
  Tooltip: '@base-ui-components/react/tooltip',
}

const gdKeyByComponent: Record<string, string> = {
  Accordion: 'accordion',
  'Alert Dialog': 'alert-dialog',
  Avatar: 'avatar',
  Calendar: 'calendar',
  Checkers: 'checkers',
  Collapsible: 'collapsible',
  Command: 'command',
  'Context Menu': 'context-menu',
  Dialog: 'dialog',
  'Dropdown Menu': 'dropdown-menu',
  'Hover Card': 'hover-card',
  'Input OTP': 'input-otp',
  Menu: 'menu',
  Menubar: 'menubar',
  'Nav Menu': 'navigation-menu',
  Pagination: 'pagination',
  Popover: 'popover',
  Progress: 'progress',
  'Radio Group': 'radio-group',
  'Scroll Area': 'scroll-area',
  Select: 'select',
  Separator: 'separator',
  Sheet: 'sheet',
  Slider: 'slider',
  Tabs: 'tabs',
  Toggle: 'toggle',
  'Toggle Group': 'toggle-group',
  Toolbar: 'toolbar',
  Tooltip: 'tooltip',
}

const gdSizes = getGentleduckSizes()

const resolveDir = join(import.meta.dirname, '..')
const radixSizes = await measureAll(radixPackages, resolveDir)
const baseuiSizes = await measureAll(baseuiPackages, resolveDir)

const perComponent = Object.keys(gdKeyByComponent).map((name) => ({
  name,
  gentleduck: gdSizes[gdKeyByComponent[name]] ?? 0,
  radix: radixSizes[name] ?? 0,
  baseui: baseuiSizes[name] ?? 0,
}))

function savingsVs(key: 'radix' | 'baseui') {
  return perComponent
    .filter((c) => c[key] > 0 && c.gentleduck > 0)
    .map((c) => ({
      name: c.name,
      gentleduckKB: +(c.gentleduck / 1024).toFixed(1),
      competitorKB: +(c[key] / 1024).toFixed(1),
      savingPercent: Math.round((1 - c.gentleduck / c[key]) * 100),
    }))
}

const savingsVsRadix = savingsVs('radix')
const savingsVsBaseui = savingsVs('baseui')

const gdTotalKB = Math.round(Object.values(gdSizes).reduce((a, b) => a + b, 0) / 1024)
const radixTotalKB = Math.round(Object.values(radixSizes).reduce((a, b) => a + b, 0) / 1024)
const baseuiTotalKB = Math.round(Object.values(baseuiSizes).reduce((a, b) => a + b, 0) / 1024)

const totalComparison = [
  { name: 'Headless UI', sizeKB: 35, components: 10, verified: false },
  { name: 'Base UI', sizeKB: baseuiTotalKB, components: Object.keys(baseuiSizes).length, verified: true },
  { name: 'gentleduck', sizeKB: gdTotalKB, components: Object.keys(gdSizes).length, verified: true },
  { name: 'Ark UI', sizeKB: 95, components: 30, verified: false },
  { name: 'Radix UI', sizeKB: radixTotalKB, components: Object.keys(radixSizes).length, verified: true },
]

const allSizes = Object.entries(gdSizes)
  .map(([name, size]) => ({ name, sizeBytes: size, sizeKB: +(size / 1024).toFixed(1) }))
  .sort((a, b) => b.sizeBytes - a.sizeBytes)

const results = {
  perComponent,
  savingsVsRadix,
  savingsVsBaseui,
  totalComparison,
  allSizes,
  methodology:
    'gentleduck: gzipped dist/ output as shipped. Radix UI / Base UI: each package/subpath bundled in isolation with esbuild (bundled, minified, react+react-dom externalized), then gzipped — matches bundlephobia methodology. "verified: false" entries in totalComparison are rough published estimates, not measured by this script.',
  generatedAt: new Date().toISOString(),
}

const json = JSON.stringify(results, null, 2)
writeFileSync(join(OUT_DIR, 'results.json'), json)
writeFileSync(join(DOCS_DIR, 'primitives.json'), json)

console.log('Primitives benchmarks generated:')
console.log(`  ${OUT_DIR}/results.json`)
console.log(`  ${DOCS_DIR}/primitives.json`)
console.log()
console.log(`gentleduck: ${gdTotalKB} KB gzipped (${Object.keys(gdSizes).length} modules)`)
console.log(`Radix UI:   ${radixTotalKB} KB gzipped (${Object.keys(radixSizes).length} components, measured)`)
console.log(`Base UI:    ${baseuiTotalKB} KB gzipped (${Object.keys(baseuiSizes).length} components, measured)`)
console.log()
console.log('Verified savings vs Radix:')
for (const s of savingsVsRadix) {
  console.log(`  ${s.name}: ${s.gentleduckKB} KB vs ${s.competitorKB} KB (${s.savingPercent}%)`)
}
console.log()
console.log('Verified savings vs Base UI:')
for (const s of savingsVsBaseui) {
  console.log(`  ${s.name}: ${s.gentleduckKB} KB vs ${s.competitorKB} KB (${s.savingPercent}%)`)
}
