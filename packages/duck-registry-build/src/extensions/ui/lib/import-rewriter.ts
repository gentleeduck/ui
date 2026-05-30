import type { IRegistryBuildContentRewrite } from '../ui.config.types'

interface ICompiledContentRewrite {
  pattern: RegExp
  replacement: string
}

// Pre-compiled rewrites keyed by pattern source. Avoids reconstructing the RegExp
// for every file × rewrite during a build (N files × M rewrites → N×M compilations).
const compiledRewritesCache = new Map<string, RegExp>()

function compileRewrite(rewrite: IRegistryBuildContentRewrite): ICompiledContentRewrite {
  const cached = compiledRewritesCache.get(rewrite.pattern)
  if (cached) {
    return { pattern: cached, replacement: rewrite.replacement }
  }

  let pattern: RegExp
  try {
    pattern = new RegExp(rewrite.pattern, 'g')
  } catch (error) {
    throw new Error(
      `Invalid contentRewrite pattern ${JSON.stringify(rewrite.pattern)}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  compiledRewritesCache.set(rewrite.pattern, pattern)
  return { pattern, replacement: rewrite.replacement }
}

function isCompiledRewrite(
  value: IRegistryBuildContentRewrite | ICompiledContentRewrite,
): value is ICompiledContentRewrite {
  return value.pattern instanceof RegExp
}

/** Pre-compile a rewrite list once so phase callers can reuse it per file. */
export function compileContentRewrites(rewrites: IRegistryBuildContentRewrite[]): ICompiledContentRewrite[] {
  return rewrites.map(compileRewrite)
}

export function applyContentRewrites(
  content: string,
  rewrites: Array<IRegistryBuildContentRewrite | ICompiledContentRewrite>,
) {
  return rewrites.reduce<string>((current, rewrite) => {
    const compiled = isCompiledRewrite(rewrite) ? rewrite : compileRewrite(rewrite)
    return current.replaceAll(compiled.pattern, compiled.replacement)
  }, content)
}

export type { ICompiledContentRewrite }
