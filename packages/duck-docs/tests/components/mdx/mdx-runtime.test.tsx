import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { MdxComponentMap } from '../../../src/components/mdx/mdx-component-registry.types'
import { useMDXComponent } from '../../../src/components/mdx/mdx-runtime'

describe('useMDXComponent', () => {
  it('compiles and renders runtime MDX code with a provided component map', () => {
    const code = `
return {
  default: function MDXContent({ components }) {
    const P = components.p
    return P ? P({ children: 'runtime ok' }) : null
  }
}
`

    const Compiled = useMDXComponent(code)
    const components: MdxComponentMap = {
      p: (props) => React.createElement('p', props),
    }

    const html = renderToStaticMarkup(React.createElement(Compiled, { components }))
    expect(html).toContain('<p>runtime ok</p>')
  })
})
