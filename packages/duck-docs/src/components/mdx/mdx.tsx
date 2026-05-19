'use client'

import { mdxComponents } from './mdx-components-registry'
import { useMDXComponent } from './mdx-runtime'

interface IMdxProps {
  code: string
}

export function Mdx({ code }: IMdxProps) {
  const Component = useMDXComponent(code)

  return (
    <div className="mdx">
      <Component components={mdxComponents} />
    </div>
  )
}
