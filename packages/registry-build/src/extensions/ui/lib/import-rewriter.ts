import type { RegistryBuildContentRewrite } from '../ui.config.types'

export function applyContentRewrites(content: string, rewrites: RegistryBuildContentRewrite[]) {
  return rewrites.reduce(
    (current, rewrite) => current.replaceAll(new RegExp(rewrite.pattern, 'g'), rewrite.replacement),
    content,
  )
}
