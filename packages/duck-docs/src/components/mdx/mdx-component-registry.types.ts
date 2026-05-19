import type * as React from 'react'

// MDX can route arbitrary serialized props into registered components, so the
// registry boundary must accept the concrete component prop signatures.
export type MdxComponent = React.ElementType

export type MdxComponentMap = Record<string, MdxComponent>
