import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { DuckGenOutputPaths } from './types'

const PACKAGE_ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const GENERATED_ROOT = path.join(PACKAGE_ROOT, 'generated')
export const SUPPORTED_FRAMEWORKS = ['nestjs'] as const
const OUTPUT_API_ROUTES = 'duck-gen-api-routes.d.ts'
const OUTPUT_MESSAGES = 'duck-gen-messages.d.ts'
const OUTPUT_INDEX = 'index.d.ts'

export function resolveFrameworkKey(framework: string | undefined): string {
  return framework && SUPPORTED_FRAMEWORKS.includes(framework as (typeof SUPPORTED_FRAMEWORKS)[number])
    ? framework
    : 'nestjs'
}

export function getFrameworkOutputDir(framework: string | undefined): string {
  return path.join(GENERATED_ROOT, resolveFrameworkKey(framework))
}

export function getFrameworkOutputPaths(framework: string | undefined): DuckGenOutputPaths {
  const outDir = getFrameworkOutputDir(framework)
  return {
    apiRoutes: path.join(outDir, OUTPUT_API_ROUTES),
    index: path.join(outDir, OUTPUT_INDEX),
    messages: path.join(outDir, OUTPUT_MESSAGES),
  }
}

export function getGeneratedIndexPath(): string {
  return path.join(GENERATED_ROOT, OUTPUT_INDEX)
}

export function emitFrameworkIndex(outputPaths: { apiRoutes: string; messages: string; index: string }): void {
  const dir = path.dirname(outputPaths.index)
  const exports: string[] = []

  const candidates = [outputPaths.apiRoutes, outputPaths.messages]
  for (const entry of candidates) {
    if (!fs.existsSync(entry)) continue
    exports.push(`export * from './${path.basename(entry, '.d.ts')}'`)
  }

  if (!exports.length) exports.push('export {}')

  const out = ['// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.', '', ...exports, ''].join('\n')
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(outputPaths.index, out, 'utf8')
}

export function emitGeneratedIndex(): void {
  const outPath = getGeneratedIndexPath()
  const exports: string[] = []

  for (const framework of SUPPORTED_FRAMEWORKS) {
    const frameworkIndex = getFrameworkOutputPaths(framework).index
    if (!fs.existsSync(frameworkIndex)) continue
    exports.push(`export * from './${framework}'`)
  }

  if (!exports.length) exports.push('export {}')

  const out = ['// 🦆 THIS FILE IS AUTO-GENERATED. DO NOT EDIT.', '', ...exports, ''].join('\n')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, out, 'utf8')
}
