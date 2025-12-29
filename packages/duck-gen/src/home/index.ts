import type { Ora } from 'ora'
import type { DuckGenExtensionsConfig } from '../core/types'

type DuckGenHomeInfo = {
  configFileFound: boolean
  extensions: DuckGenExtensionsConfig
}

/** 🦆
 * 🦆 Prints a compact Duck Gen home block (Next.js-style).
 */
export function build_registry_home(spinner: Ora, info: DuckGenHomeInfo): void {
  spinner.stop()
  console.log(buildHomeBlock(info))
}

function buildHomeBlock(info: DuckGenHomeInfo): string {
  const extensionLines = buildExtensionsLines(info.extensions)
  return ['🦆 DUCK GEN', '  - Features:', ...extensionLines].join('\n')
}

function buildExtensionsLines(extensions: DuckGenExtensionsConfig): string[] {
  const lines: string[] = []
  if (extensions.apiRoutes.enabled) lines.push('    ✓ apiRoutes')
  if (extensions.messages.enabled) lines.push('    ✓ messages')
  if (!lines.length) lines.push('    - none enabled')
  return lines
}
