import type { ComponentType } from 'react'
import runtime from 'react/jsx-runtime'
import type { MdxComponentMap } from './mdx-component-registry.types'

export type CompiledMdxComponent = ComponentType<{ components: MdxComponentMap }>

export const useMDXComponent = (code: string): CompiledMdxComponent => {
  const fn = new Function(code)
  return fn({ ...runtime }).default as CompiledMdxComponent
}
