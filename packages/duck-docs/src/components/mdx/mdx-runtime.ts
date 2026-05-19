import type { ComponentType } from 'react'
import runtime from 'react/jsx-runtime'
import type { MdxComponentMap } from './mdx-component-registry.types'

export type CompiledMdxComponent = ComponentType<{ components: MdxComponentMap }>

/**
 * Compile the dmc-emitted MDX body and turn it into a React component.
 *
 * The body matches `@mdx-js/mdx`'s shape: it returns an object with a
 * `default` factory that accepts `{ components }` props and renders the
 * tree (routing through `components.wrapper` when supplied). We invoke
 * the body once with the jsx-runtime to recover the factory, then wrap
 * the factory so each `<Mdx code={...} />` invocation passes its own
 * component map through.
 */
export const useMDXComponent = (code: string): CompiledMdxComponent => {
  const fn = new Function(code) as (arg: unknown) => { default: CompiledMdxComponent }
  const { default: MDXContent } = fn(runtime)
  return MDXContent
}
