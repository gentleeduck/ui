import type { RegistryBuildContentRewrite } from '../types'

export function applyContentRewrites(content: string, rewrites: RegistryBuildContentRewrite[]) {
  return rewrites.reduce((current, rewrite) => current.replaceAll(new RegExp(rewrite.pattern, 'g'), rewrite.replacement), content)
}

