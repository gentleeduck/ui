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
    messages: path.join(outDir, OUTPUT_MESSAGES),
    index: path.join(outDir, OUTPUT_INDEX),
  }
}

export function getGeneratedIndexPath(): string {
  return path.join(GENERATED_ROOT, OUTPUT_INDEX)
}
