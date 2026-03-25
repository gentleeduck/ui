import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { DismissableLayer } from '../dismissable-layer'

describe('DismissableLayer', () => {
  it('renders children', () => {
    const { container } = render(
      <DismissableLayer>
        <span>inside layer</span>
      </DismissableLayer>,
    )
    expect(container.textContent).toBe('inside layer')
  })

  it('renders as a div', () => {
    const { container } = render(
      <DismissableLayer>
        <span>content</span>
      </DismissableLayer>,
    )
    expect(container.querySelector('div')).not.toBeNull()
  })

  it('calls onEscapeKeyDown when Escape is pressed', () => {
    const handler = mock(() => {})
    render(
      <DismissableLayer onEscapeKeyDown={handler}>
        <span>content</span>
      </DismissableLayer>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('calls onDismiss when Escape is pressed', () => {
    const handler = mock(() => {})
    render(
      <DismissableLayer onDismiss={handler}>
        <span>content</span>
      </DismissableLayer>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <DismissableLayer ref={ref}>
        <span>ref test</span>
      </DismissableLayer>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
