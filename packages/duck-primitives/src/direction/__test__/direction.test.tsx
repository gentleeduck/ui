import { describe, expect, it } from 'bun:test'
import { render } from '@testing-library/react'
import * as React from 'react'
import { DirectionProvider, useDirection } from '../direction'

function DirectionDisplay({ localDir }: { localDir?: 'ltr' | 'rtl' }) {
  const dir = useDirection(localDir)
  return <span data-testid="dir">{dir}</span>
}

describe('IDirection.Kind', () => {
  it('defaults to ltr when no provider or local dir', () => {
    const { container } = render(<DirectionDisplay />)
    expect(container.querySelector('[data-testid="dir"]')?.textContent).toBe('ltr')
  })

  it('uses local dir over provider', () => {
    const { container } = render(
      <DirectionProvider dir="rtl">
        <DirectionDisplay localDir="ltr" />
      </DirectionProvider>,
    )
    expect(container.querySelector('[data-testid="dir"]')?.textContent).toBe('ltr')
  })

  it('uses provider dir when no local dir', () => {
    const { container } = render(
      <DirectionProvider dir="rtl">
        <DirectionDisplay />
      </DirectionProvider>,
    )
    expect(container.querySelector('[data-testid="dir"]')?.textContent).toBe('rtl')
  })

  it('DirectionProvider renders a wrapper div with dir attribute', () => {
    const { container } = render(
      <DirectionProvider dir="rtl">
        <span>content</span>
      </DirectionProvider>,
    )
    const wrapper = container.querySelector('div[dir="rtl"]')
    expect(wrapper).not.toBeNull()
    expect(wrapper?.style.direction).toBe('rtl')
  })
})
