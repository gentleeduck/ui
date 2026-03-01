'use client'

import { mdxComponents } from './mdx-components-registry'
import { useMDXComponent } from './mdx-runtime'

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)

  return (
    <div className="mdx">
      <Component components={mdxComponents} />
    </div>
  )
}
