import { describe, expect, it } from 'bun:test'
import { render } from '@testing-library/react'
import * as React from 'react'
import { Popper, PopperAnchor, PopperContent } from '../index'

describe('Popper', () => {
  it('renders children', () => {
    const { container } = render(
      <Popper>
        <span data-testid="child">inside popper</span>
      </Popper>,
    )
    expect(container.querySelector('[data-testid="child"]')?.textContent).toBe('inside popper')
  })

  it('renders anchor with data-slot="popper-anchor"', () => {
    const { container } = render(
      <Popper>
        <PopperAnchor>
          <button>Anchor</button>
        </PopperAnchor>
      </Popper>,
    )
    expect(container.querySelector('[data-slot="popper-anchor"]')).not.toBeNull()
  })

  it('renders anchor as a div by default', () => {
    const { container } = render(
      <Popper>
        <PopperAnchor>anchor content</PopperAnchor>
      </Popper>,
    )
    expect(container.querySelector('div[data-slot="popper-anchor"]')).not.toBeNull()
  })

  it('anchor supports asChild', () => {
    const { container } = render(
      <Popper>
        <PopperAnchor asChild>
          <button>Anchor button</button>
        </PopperAnchor>
      </Popper>,
    )
    expect(container.querySelector('button')?.textContent).toBe('Anchor button')
  })

  it('anchor forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Popper>
        <PopperAnchor ref={ref}>anchor</PopperAnchor>
      </Popper>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
