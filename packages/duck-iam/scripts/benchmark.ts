#!/usr/bin/env node
/**
 * Benchmark script for @gentleduck/iam.
 * Measures real performance and bundle sizes, outputs JSON data for docs.
 *
 * Output: public/benchmarks/results.json + apps/duck-iam-docs/public/data/benchmarks/iam.json
 * Usage: bun run benchmark
 */

import { execSync } from 'node:child_process'
import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { MemoryAdapter } from '../src/adapters/memory'
import { Engine } from '../src/core/engine/engine'
import { evaluate, evaluatePolicy } from '../src/core/evaluate'
import type { AccessRequest, Policy } from '../src/core/types'

const OUT_DIR = join(import.meta.dirname, '..', 'public', 'benchmarks')
const DOCS_DIR = join(import.meta.dirname, '..', '..', '..', 'apps', 'duck-iam-docs', 'public', 'data', 'benchmarks')
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

async function benchAsync(fn: () => Promise<void>, warmup = 100, iterations = 1000): Promise<number> {
  for (let i = 0; i < warmup; i++) await fn()
  const start = performance.now()
  for (let i = 0; i < iterations; i++) await fn()
  return (performance.now() - start) / iterations
}

// ---------------------------------------------------------------------------
// 1. Test fixtures
// ---------------------------------------------------------------------------

const simplePolicy: Policy = {
  id: 'simple',
  algorithm: 'deny-overrides',
  rules: [
    {
      id: 'allow-read',
      effect: 'allow',
      actions: ['read'],
      resources: ['post'],
      conditions: {},
      priority: 0,
    },
    {
      id: 'allow-write-admin',
      effect: 'allow',
      actions: ['write', 'delete'],
      resources: ['post'],
      conditions: {
        all: [{ field: 'subject.attributes.role', operator: 'eq', value: 'admin' }],
      },
      priority: 0,
    },
  ],
}

const targetedPolicy: Policy = {
  id: 'targeted',
  algorithm: 'deny-overrides',
  targets: { actions: ['read'], resources: ['post'] },
  rules: [
    {
      id: 'allow-read',
      effect: 'allow',
      actions: ['read'],
      resources: ['post'],
      conditions: {},
      priority: 0,
    },
  ],
}

const conditionPolicy: Policy = {
  id: 'condition',
  algorithm: 'deny-overrides',
  rules: [
    {
      id: 'owner-edit',
      effect: 'allow',
      actions: ['update'],
      resources: ['post'],
      conditions: {
        all: [
          { field: 'subject.id', operator: 'eq', value: '$resource.attributes.ownerId' },
          { field: 'resource.attributes.status', operator: 'in', value: ['draft', 'review'] },
        ],
      },
      priority: 0,
    },
  ],
}

const simpleRequest: AccessRequest = {
  subject: { id: 'user-1', roles: ['viewer'], attributes: {} },
  action: 'read',
  resource: { type: 'post', attributes: {} },
}

const conditionRequest: AccessRequest = {
  subject: { id: 'user-1', roles: ['editor'], attributes: { role: 'editor' } },
  action: 'update',
  resource: { type: 'post', id: 'post-1', attributes: { ownerId: 'user-1', status: 'draft' } },
}

const denyRequest: AccessRequest = {
  subject: { id: 'user-1', roles: ['viewer'], attributes: {} },
  action: 'delete',
  resource: { type: 'post', attributes: {} },
}

// ---------------------------------------------------------------------------
// 2. Core performance benchmarks
// ---------------------------------------------------------------------------

const corePerformance = {
  evaluatePolicySimple: {
    label: 'evaluatePolicy (simple rule)',
    us: +(bench(() => evaluatePolicy(simplePolicy, simpleRequest)) * 1000).toFixed(2),
  },
  evaluatePolicyCondition: {
    label: 'evaluatePolicy (conditions)',
    us: +(bench(() => evaluatePolicy(conditionPolicy, conditionRequest)) * 1000).toFixed(2),
  },
  evaluatePolicyTargetHit: {
    label: 'evaluatePolicy (target match)',
    us: +(bench(() => evaluatePolicy(targetedPolicy, simpleRequest)) * 1000).toFixed(2),
  },
  evaluatePolicyTargetSkip: {
    label: 'evaluatePolicy (target skip)',
    us: +(bench(() => evaluatePolicy(targetedPolicy, denyRequest)) * 1000).toFixed(2),
  },
  evaluateMultiPolicy: {
    label: 'evaluate (2 policies)',
    us: +(bench(() => evaluate([simplePolicy, conditionPolicy], simpleRequest)) * 1000).toFixed(2),
  },
  evaluateDeny: {
    label: 'evaluate (deny path)',
    us: +(bench(() => evaluate([simplePolicy], denyRequest)) * 1000).toFixed(2),
  },
}

// ---------------------------------------------------------------------------
// 3. Engine benchmarks (async, with caching)
// ---------------------------------------------------------------------------

const adapter = new MemoryAdapter({
  policies: [simplePolicy, conditionPolicy],
  roles: [
    {
      id: 'viewer',
      name: 'Viewer',
      permissions: [{ action: 'read', resource: 'post' }],
    },
    {
      id: 'editor',
      name: 'Editor',
      inherits: ['viewer'],
      permissions: [{ action: 'update', resource: 'post' }],
    },
    {
      id: 'admin',
      name: 'Admin',
      inherits: ['editor'],
      permissions: [
        { action: 'write', resource: 'post' },
        { action: 'delete', resource: 'post' },
        { action: 'create', resource: 'post' },
      ],
    },
  ],
  assignments: {
    'user-1': ['viewer'],
    'editor-1': ['editor'],
    'admin-1': ['admin'],
  },
  attributes: {
    'user-1': { role: 'viewer' },
    'editor-1': { role: 'editor' },
    'admin-1': { role: 'admin' },
  },
})

const engine = new Engine({ adapter, defaultEffect: 'deny' })

// Warmup cache
await engine.can('user-1', 'read', { type: 'post', attributes: {} })
await engine.can('admin-1', 'delete', { type: 'post', attributes: {} })

const enginePerformance = {
  canCached: {
    label: 'engine.can() (cached)',
    us: +(
      (await benchAsync(async () => {
        await engine.can('user-1', 'read', { type: 'post', attributes: {} })
      })) * 1000
    ).toFixed(2),
  },
  checkCached: {
    label: 'engine.check() (cached)',
    us: +(
      (await benchAsync(async () => {
        await engine.check('user-1', 'read', { type: 'post', attributes: {} })
      })) * 1000
    ).toFixed(2),
  },
  permissionsBatch20: {
    label: 'engine.permissions() (20 checks)',
    us: +(
      (await benchAsync(async () => {
        await engine.permissions(
          'user-1',
          Array.from({ length: 20 }, (_, i) => ({
            action: i % 4 === 0 ? 'read' : i % 4 === 1 ? 'write' : i % 4 === 2 ? 'update' : 'delete',
            resource: 'post' as const,
          })),
        )
      })) * 1000
    ).toFixed(2),
  },
  explain: {
    label: 'engine.explain()',
    us: +(
      (await benchAsync(async () => {
        await engine.explain('user-1', 'read', { type: 'post', attributes: {} })
      })) * 1000
    ).toFixed(2),
  },
}

// ---------------------------------------------------------------------------
// 4. Bundle size measurements
// ---------------------------------------------------------------------------

function measureExportSize(entryPath: string): number {
  const distDir = join(import.meta.dirname, '..', 'dist')
  const fullPath = join(distDir, entryPath)

  try {
    statSync(fullPath)
  } catch {
    return 0
  }

  // For entry files, also include shared chunks they import
  try {
    const gz = execSync(`cat "${fullPath}" | gzip -c | wc -c`, { encoding: 'utf-8' }).trim()
    return Number.parseInt(gz, 10)
  } catch {
    return 0
  }
}

function measureEntryWithDeps(entryFile: string): number {
  const distDir = join(import.meta.dirname, '..', 'dist')
  const fullPath = join(distDir, entryFile)

  try {
    statSync(fullPath)
  } catch {
    return 0
  }

  try {
    // Read the entry file to find shared chunk imports
    const content = execSync(`cat "${fullPath}"`, { encoding: 'utf-8' })
    const importMatches = content.match(/from\s+['"]\.\/([^'"]+)['"]/g) || []
    const files = [fullPath]

    for (const imp of importMatches) {
      const match = imp.match(/from\s+['"]\.\/([^'"]+)['"]/)
      if (match?.[1]) {
        const depPath = join(distDir, match[1])
        try {
          statSync(depPath)
          files.push(depPath)
        } catch {
          // skip missing files
        }
      }
    }

    const gz = execSync(`cat ${files.map((f) => `"${f}"`).join(' ')} | gzip -c | wc -c`, {
      encoding: 'utf-8',
    }).trim()
    return Number.parseInt(gz, 10)
  } catch {
    return 0
  }
}

const moduleSizes = [
  { name: 'Core (full)', entry: 'index.js', sizeBytes: measureEntryWithDeps('index.js') },
  { name: 'Core only', entry: 'core/index.js', sizeBytes: measureExportSize('core/index.js') },
  {
    name: 'Adapter: Memory',
    entry: 'adapters/memory/index.js',
    sizeBytes: measureExportSize('adapters/memory/index.js'),
  },
  {
    name: 'Adapter: Prisma',
    entry: 'adapters/prisma/index.js',
    sizeBytes: measureExportSize('adapters/prisma/index.js'),
  },
  {
    name: 'Adapter: Drizzle',
    entry: 'adapters/drizzle/index.js',
    sizeBytes: measureExportSize('adapters/drizzle/index.js'),
  },
  {
    name: 'Adapter: HTTP',
    entry: 'adapters/http/index.js',
    sizeBytes: measureExportSize('adapters/http/index.js'),
  },
  {
    name: 'Server: Express',
    entry: 'server/express/index.js',
    sizeBytes: measureExportSize('server/express/index.js'),
  },
  {
    name: 'Server: Next.js',
    entry: 'server/next/index.js',
    sizeBytes: measureExportSize('server/next/index.js'),
  },
  {
    name: 'Server: Hono',
    entry: 'server/hono/index.js',
    sizeBytes: measureExportSize('server/hono/index.js'),
  },
  {
    name: 'Server: NestJS',
    entry: 'server/nest/index.js',
    sizeBytes: measureExportSize('server/nest/index.js'),
  },
  {
    name: 'Server: Generic',
    entry: 'server/generic/index.js',
    sizeBytes: measureExportSize('server/generic/index.js'),
  },
  {
    name: 'Client: React',
    entry: 'client/react/index.js',
    sizeBytes: measureExportSize('client/react/index.js'),
  },
  {
    name: 'Client: Vue',
    entry: 'client/vue/index.js',
    sizeBytes: measureExportSize('client/vue/index.js'),
  },
  {
    name: 'Client: Vanilla',
    entry: 'client/vanilla/index.js',
    sizeBytes: measureExportSize('client/vanilla/index.js'),
  },
].map((m) => ({ ...m, sizeKB: +(m.sizeBytes / 1024).toFixed(1) }))

const coreSizeBytes = moduleSizes.find((m) => m.name === 'Core (full)')?.sizeBytes ?? 0

// ---------------------------------------------------------------------------
// 5. Bundle size comparison (verified via bundlephobia API 2026-03-30)
// ---------------------------------------------------------------------------

const bundleComparison = [
  {
    name: '@gentleduck/iam (full)',
    sizeKB: +(coreSizeBytes / 1024).toFixed(1),
    deps: 0,
    treeshakeable: true,
    note: 'Full package (engine + evaluate + explain + builder + conditions + rbac + config + validate)',
  },
  {
    name: '@casl/ability',
    sizeKB: 6.0,
    deps: 0,
    treeshakeable: true,
    note: 'bundlephobia 2026-03-30',
  },
  {
    name: 'accesscontrol',
    sizeKB: 8.2,
    deps: 1,
    treeshakeable: false,
    note: 'bundlephobia 2026-03-30',
  },
  {
    name: 'casbin (node-casbin)',
    sizeKB: 30.0,
    deps: 5,
    treeshakeable: false,
    note: 'bundlephobia 2026-03-30',
  },
]

// ---------------------------------------------------------------------------
// 6. Feature comparison
// ---------------------------------------------------------------------------

const features = [
  { feature: 'RBAC', gentleduck: true, casl: true, casbin: true, accesscontrol: true },
  { feature: 'ABAC (conditions)', gentleduck: true, casl: true, casbin: true, accesscontrol: false },
  { feature: 'Policy-based engine', gentleduck: true, casl: false, casbin: true, accesscontrol: false },
  { feature: 'Deny-overrides', gentleduck: true, casl: false, casbin: true, accesscontrol: false },
  { feature: 'Multiple algorithms', gentleduck: '4', casl: '1', casbin: 'custom', accesscontrol: '1' },
  { feature: 'Scoped roles (multi-tenant)', gentleduck: true, casl: false, casbin: false, accesscontrol: false },
  { feature: 'Explain / debug trace', gentleduck: true, casl: false, casbin: false, accesscontrol: false },
  { feature: 'Lifecycle hooks', gentleduck: true, casl: false, casbin: false, accesscontrol: false },
  { feature: 'LRU caching built-in', gentleduck: true, casl: false, casbin: false, accesscontrol: false },
  { feature: 'Database adapters', gentleduck: '4', casl: '3', casbin: '20+', accesscontrol: '0' },
  { feature: 'Server middleware', gentleduck: '5', casl: '0', casbin: '2', accesscontrol: '0' },
  { feature: 'React integration', gentleduck: true, casl: true, casbin: false, accesscontrol: false },
  { feature: 'Vue integration', gentleduck: true, casl: true, casbin: false, accesscontrol: false },
  { feature: 'Type-safe config', gentleduck: true, casl: true, casbin: false, accesscontrol: true },
  { feature: 'Zero runtime deps', gentleduck: true, casl: true, casbin: false, accesscontrol: false },
  { feature: 'Framework-agnostic', gentleduck: true, casl: true, casbin: true, accesscontrol: true },
  { feature: 'Batch permissions', gentleduck: true, casl: false, casbin: false, accesscontrol: false },
  { feature: 'Resource hierarchy', gentleduck: true, casl: false, casbin: true, accesscontrol: true },
  { feature: 'Wildcard patterns', gentleduck: true, casl: true, casbin: true, accesscontrol: true },
]

// ---------------------------------------------------------------------------
// 7. Per-library comparisons
// ---------------------------------------------------------------------------

const vsCasl = {
  name: '@casl/ability',
  comparison: [
    {
      metric: 'Bundle size',
      gentleduck: `${+(coreSizeBytes / 1024).toFixed(1)} KB`,
      competitor: '6.0 KB',
      winner: coreSizeBytes / 1024 < 6.0 ? 'gentleduck' : 'competitor',
    },
    { metric: 'Runtime deps', gentleduck: '0', competitor: '0', winner: 'tie' },
    {
      metric: 'Authorization model',
      gentleduck: 'Policy engine (ABAC+RBAC)',
      competitor: 'Ability-based (ABAC)',
      winner: 'gentleduck',
    },
    { metric: 'Scoped roles', gentleduck: 'Built-in', competitor: 'Manual', winner: 'gentleduck' },
    { metric: 'Explain / debug', gentleduck: 'Full trace', competitor: 'None', winner: 'gentleduck' },
    { metric: 'Server middleware', gentleduck: '5 frameworks', competitor: 'None built-in', winner: 'gentleduck' },
    {
      metric: 'Database adapters',
      gentleduck: '4 (Memory, Prisma, Drizzle, HTTP)',
      competitor: '3 (Prisma, Mongoose, TypeORM)',
      winner: 'tie',
    },
    { metric: 'React hooks', gentleduck: 'useCan, usePermissions', competitor: 'Can component', winner: 'tie' },
    { metric: 'Maturity', gentleduck: 'New', competitor: 'Established (2017)', winner: 'competitor' },
    { metric: 'Weekly downloads', gentleduck: 'Growing', competitor: '~900K/week', winner: 'competitor' },
    { metric: 'TypeScript', gentleduck: 'Full', competitor: 'Full', winner: 'tie' },
  ],
}

const vsCasbin = {
  name: 'casbin (node-casbin)',
  comparison: [
    {
      metric: 'Bundle size',
      gentleduck: `${+(coreSizeBytes / 1024).toFixed(1)} KB`,
      competitor: '30 KB',
      winner: 'gentleduck',
    },
    { metric: 'Runtime deps', gentleduck: '0', competitor: '5', winner: 'gentleduck' },
    {
      metric: 'Authorization model',
      gentleduck: 'Policy engine (TypeScript)',
      competitor: 'Model file (PERM DSL)',
      winner: 'tie',
    },
    { metric: 'Database adapters', gentleduck: '4', competitor: '20+', winner: 'competitor' },
    { metric: 'Language support', gentleduck: 'JS/TS only', competitor: '15+ languages', winner: 'competitor' },
    { metric: 'Type safety', gentleduck: 'Full generics', competitor: 'String-based', winner: 'gentleduck' },
    { metric: 'Explain / debug', gentleduck: 'Full trace', competitor: 'None', winner: 'gentleduck' },
    { metric: 'Scoped roles', gentleduck: 'Built-in', competitor: 'Via domains', winner: 'tie' },
    { metric: 'Server middleware', gentleduck: '5 frameworks', competitor: 'Express, Koa', winner: 'gentleduck' },
    { metric: 'Client libraries', gentleduck: 'React, Vue, Vanilla', competitor: 'None', winner: 'gentleduck' },
    { metric: 'Maturity', gentleduck: 'New', competitor: 'Battle-tested (2018)', winner: 'competitor' },
    { metric: 'Ecosystem', gentleduck: 'Focused', competitor: 'Multi-language, admin UI', winner: 'competitor' },
  ],
}

const vsAccesscontrol = {
  name: 'accesscontrol',
  comparison: [
    {
      metric: 'Bundle size',
      gentleduck: `${+(coreSizeBytes / 1024).toFixed(1)} KB`,
      competitor: '8.2 KB',
      winner: coreSizeBytes / 1024 < 8.2 ? 'gentleduck' : 'competitor',
    },
    {
      metric: 'Authorization model',
      gentleduck: 'ABAC + RBAC + policies',
      competitor: 'RBAC only',
      winner: 'gentleduck',
    },
    { metric: 'Conditions (ABAC)', gentleduck: '18 operators', competitor: 'None', winner: 'gentleduck' },
    { metric: 'Scoped roles', gentleduck: 'Built-in', competitor: 'None', winner: 'gentleduck' },
    { metric: 'Explain / debug', gentleduck: 'Full trace', competitor: 'None', winner: 'gentleduck' },
    { metric: 'Database adapters', gentleduck: '4', competitor: '0 (in-memory only)', winner: 'gentleduck' },
    { metric: 'Server middleware', gentleduck: '5 frameworks', competitor: 'None', winner: 'gentleduck' },
    { metric: 'API style', gentleduck: 'Engine + policies', competitor: 'Fluent grants', winner: 'tie' },
    { metric: 'Maturity', gentleduck: 'New', competitor: 'Established (2016)', winner: 'competitor' },
    { metric: 'Simplicity', gentleduck: 'Policy-based', competitor: 'Very simple API', winner: 'competitor' },
    { metric: 'Maintenance', gentleduck: 'Active', competitor: 'Unmaintained since 2020', winner: 'gentleduck' },
  ],
}

const libraryComparisons = [vsCasl, vsCasbin, vsAccesscontrol]

// ---------------------------------------------------------------------------
// Write JSON output
// ---------------------------------------------------------------------------

const results = {
  corePerformance: Object.values(corePerformance),
  enginePerformance: Object.values(enginePerformance),
  moduleSizes: moduleSizes.filter((m) => m.sizeBytes > 0),
  bundleComparison,
  features,
  libraryComparisons,
  generatedAt: new Date().toISOString(),
}

const json = JSON.stringify(results, null, 2)
writeFileSync(join(OUT_DIR, 'results.json'), json)
writeFileSync(join(DOCS_DIR, 'iam.json'), json)

// ---------------------------------------------------------------------------
// Console output
// ---------------------------------------------------------------------------

console.log('IAM benchmarks generated:')
console.log(`  ${OUT_DIR}/results.json`)
console.log(`  ${DOCS_DIR}/iam.json`)
console.log()

console.log('Core Performance (pure evaluation, no I/O):')
for (const p of Object.values(corePerformance)) {
  console.log(`  ${p.label}: ${p.us} us`)
}
console.log()

console.log('Engine Performance (with caching):')
for (const p of Object.values(enginePerformance)) {
  console.log(`  ${p.label}: ${p.us} us`)
}
console.log()

console.log('Module Sizes (gzipped):')
for (const m of moduleSizes.filter((m) => m.sizeBytes > 0)) {
  console.log(`  ${m.name}: ${m.sizeKB} KB`)
}
console.log()

console.log('Bundle Comparison:')
for (const b of bundleComparison) {
  console.log(`  ${b.name}: ${b.sizeKB} KB (${b.deps} deps)`)
}
