#!/usr/bin/env bun
/**
 * Strip `workspace:*` and `catalog:` references from devDependencies of every
 * public package before `changeset publish` runs. npm/bun publish the file
 * verbatim, so these protocol tokens leak into the registry and break strict
 * resolvers (bun, deno).
 *
 * Run before publish:  bun run scripts/clean-publish.ts
 * Restore source:       git checkout packages/*\/package.json apps/*\/package.json
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = process.cwd()

async function listWorkspacePackageJsons(): Promise<string[]> {
  const roots = ['packages', 'apps', 'tooling']
  const out: string[] = []
  for (const root of roots) {
    let entries: string[] = []
    try {
      entries = await readdir(join(ROOT, root))
    } catch {
      continue
    }
    for (const name of entries) {
      out.push(join(ROOT, root, name, 'package.json'))
    }
  }
  return out
}

function isProtocolValue(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return value.startsWith('workspace:') || value.startsWith('catalog:')
}

async function clean(file: string) {
  let raw: string
  try {
    raw = await readFile(file, 'utf8')
  } catch {
    return
  }
  let pkg: Record<string, unknown>
  try {
    pkg = JSON.parse(raw)
  } catch {
    return
  }

  if (pkg.private === true) return
  if (!pkg.name || typeof pkg.name !== 'string') return

  let changed = false

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'] as const) {
    const block = pkg[field] as Record<string, string> | undefined
    if (!block) continue
    for (const [dep, version] of Object.entries(block)) {
      if (isProtocolValue(version)) {
        delete block[dep]
        changed = true
      }
    }
    if (Object.keys(block).length === 0) delete pkg[field]
  }

  if (changed) {
    await writeFile(file, `${JSON.stringify(pkg, null, 2)}\n`)
    console.log(`cleaned: ${file.replace(`${ROOT}/`, '')}`)
  }
}

async function main() {
  const files = await listWorkspacePackageJsons()
  for (const file of files) await clean(file)
}

await main()
