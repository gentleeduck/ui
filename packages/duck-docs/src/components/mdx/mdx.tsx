'use client'

import * as React from 'react'
import { mdxComponents } from './mdx-components-registry'
import { type CompiledMdxBody, compileMdxBody } from './mdx-runtime'

interface IMdxProps {
  /**
   * SECURITY: A precompiled MDX body string. This is fed through
   * `new Function(body)` and must originate from a trusted server-side build
   * step. Callers MUST mint the brand explicitly via `compileMdxBody`
   * (validates shape) or `trustCompiledMdxBody` (explicit unsafe). The public
   * `<Mdx>` entry no longer auto-mints a raw string — the brand is the trust
   * boundary and silently casting at the entry would defeat it.
   *
   * Never pass user-authored MDX.
   */
  code: CompiledMdxBody
}

export function Mdx({ code }: IMdxProps) {
  const Component = React.useMemo(() => compileMdxBody(code), [code])

  return (
    <div className="mdx">
      <Component components={mdxComponents} />
    </div>
  )
}
