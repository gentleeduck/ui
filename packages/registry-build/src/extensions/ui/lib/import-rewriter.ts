import type { IRegistryBuildContentRewrite } from '../ui.config.types'

export function applyContentRewrites(content: string, rewrites: IRegistryBuildContentRewrite[]) {
  return rewrites.reduce(
    (current, rewrite) => current.replaceAll(new RegExp(rewrite.pattern, 'g'), rewrite.replacement),
    content,
  )
}
