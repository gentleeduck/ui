import type * as React from 'react'

// Unknown MDX intrinsics still need to fall back to `ElementType` — there is
// no compile-time list of every tag/component an MDX author may name. The
// registry instances pin known components with `satisfies`, so concrete
// callers still get their real prop signatures at construction time.
export type MdxComponent = React.ElementType

export type MdxComponentMap = Record<string, MdxComponent>
