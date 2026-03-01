import type { MdxComponentMap } from './mdx-component-registry.types'
import { mdxBaseComponents } from './mdx-components-base'
import { mdxUiComponents } from './mdx-components-ui'

export const mdxComponents = {
  ...mdxBaseComponents,
  ...mdxUiComponents,
} satisfies MdxComponentMap
