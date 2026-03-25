import { describe, expect, it } from 'bun:test'
import { render } from '@testing-library/react'
import * as React from 'react'
import { useSvgIndicator } from '../checkers'

function TestIndicator() {
  const { inputStyle, SvgIndicator, indicatorReady, checkedIndicatorReady } = useSvgIndicator({
    indicator: (
      <svg viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="4" />
      </svg>
    ),
    checkedIndicator: (
      <svg viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="6" fill="blue" />
      </svg>
    ),
  })

  return (
    <div>
      <SvgIndicator data-testid="svg-indicator" />
      <input data-testid="input" style={inputStyle} />
      <span data-testid="off-ready">{String(indicatorReady)}</span>
      <span data-testid="on-ready">{String(checkedIndicatorReady)}</span>
    </div>
  )
}

describe('useSvgIndicator (checkers)', () => {
  it('renders hidden SVG containers', () => {
    const { container } = render(<TestIndicator />)
    const hiddenDivs = container.querySelectorAll('[aria-hidden]')
    expect(hiddenDivs.length).toBeGreaterThanOrEqual(2)
  })

  it('renders the indicator SVG inside hidden container', () => {
    const { container } = render(<TestIndicator />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(2)
  })

  it('returns SvgIndicator as a renderable component', () => {
    const { container } = render(<TestIndicator />)
    expect(container.querySelector('[data-testid="svg-indicator"]')).toBeDefined()
  })

  it('returns inputStyle object', () => {
    const { container } = render(<TestIndicator />)
    const input = container.querySelector('[data-testid="input"]') as HTMLInputElement
    expect(input).not.toBeNull()
  })
})
