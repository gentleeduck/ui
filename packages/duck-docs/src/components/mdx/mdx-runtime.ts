import type { ComponentType } from 'react'
import runtime from 'react/jsx-runtime'
import type { MdxComponentMap } from './mdx-component-registry.types'

export type CompiledMdxComponent = ComponentType<{ components: MdxComponentMap }>

declare const __mdxBodyBrand__: unique symbol

/**
 * A precompiled MDX body string produced by a trusted build pipeline.
 *
 * SECURITY: This brand is the trust boundary for the `new Function(body)` call
 * in `compileMdxBody`. The brand is a phantom type — callers cannot construct
 * one from a raw `string`; they MUST pass through `trustCompiledMdxBody`,
 * which makes the trust decision explicit and grep-able.
 *
 * Never call `trustCompiledMdxBody` on a value that originated from user
 * input, request bodies, search params, or any runtime source. The only
 * legitimate callers are build-time tools (e.g. `@gentleduck/md`) that have
 * compiled MDX themselves on the server.
 */
export type CompiledMdxBody = string & { readonly [__mdxBodyBrand__]: 'CompiledMdxBody' }

/**
 * Tags a string as trusted MDX body output from a build pipeline.
 *
 * SECURITY: Calling this on attacker-controlled input is arbitrary code
 * execution — `compileMdxBody` runs the body through `new Function`. Only
 * call this from server-side build code that produced the string itself.
 */
export function trustCompiledMdxBody(body: string): CompiledMdxBody {
  return body as CompiledMdxBody
}

/**
 * Compiles a precompiled MDX body string back to a React component.
 *
 * SECURITY: equivalent to `eval()`. Only accepts a `CompiledMdxBody`, which
 * the caller must have minted via `trustCompiledMdxBody`. The runtime check
 * below validates the shape `@mdx-js/mdx` emits; it runs AFTER `new Function(body)`
 * has already executed — so a hostile body that throws at top-level, mutates
 * globals, or starts side-effecting timers wins before any check fires. The
 * brand is the ONLY defence; the shape validation guards the return contract,
 * not the side-effects of evaluation. Keep `trustCompiledMdxBody` callers
 * grep-able and pinned to build-time origins.
 */
export function compileMdxBody(body: CompiledMdxBody): CompiledMdxComponent {
  const fn = new Function(body) as (arg: unknown) => unknown
  // SECURITY: side-effects from `body` have already executed here.
  const result = fn(runtime)

  if (!result || typeof result !== 'object' || !('default' in result)) {
    throw new Error('compileMdxBody: compiled body did not export a `default` factory.')
  }

  const factory = (result as { default: unknown }).default
  if (typeof factory !== 'function') {
    throw new Error('compileMdxBody: compiled body `default` export is not a component.')
  }

  return factory as CompiledMdxComponent
}

/**
 * @deprecated Use `compileMdxBody` with a `CompiledMdxBody` brand minted via
 * `trustCompiledMdxBody` instead. This shim auto-casts a raw `string` to the
 * brand, which silently bypasses the trust gate — that's the entire reason
 * the brand exists. Kept only for migration; will be removed in a future
 * major. Do not introduce new callers.
 */
export const useMDXComponent = (code: string): CompiledMdxComponent => compileMdxBody(code as CompiledMdxBody)
