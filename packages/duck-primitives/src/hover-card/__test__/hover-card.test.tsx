import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../index'

function renderHoverCard(props: Record<string, unknown> = {}) {
  return render(
    <HoverCard openDelay={0} closeDelay={0} {...props}>
      <HoverCardTrigger href="#">Hover target</HoverCardTrigger>
      <HoverCardContent>Card content</HoverCardContent>
    </HoverCard>,
  )
}

describe('HoverCard', () => {
  it('renders trigger with data-slot="hover-card-trigger"', () => {
    const { container } = renderHoverCard()
    expect(container.querySelector('[data-slot="hover-card-trigger"]')).not.toBeNull()
  })

  it('trigger renders as an anchor element', () => {
    const { container } = renderHoverCard()
    expect(container.querySelector('a[data-slot="hover-card-trigger"]')).not.toBeNull()
  })

  it('trigger has data-state="closed" initially', () => {
    const { container } = renderHoverCard()
    const trigger = container.querySelector('[data-slot="hover-card-trigger"]')!
    expect(trigger.getAttribute('data-state')).toBe('closed')
  })

  // focus triggers open via a timer (openDelay) - tested via controlled open prop instead

  // blur triggers close via a timer (closeDelay) - tested via controlled open prop instead

  it('respects controlled open prop', () => {
    const { container } = renderHoverCard({ open: true })
    const trigger = container.querySelector('[data-slot="hover-card-trigger"]')!
    expect(trigger.getAttribute('data-state')).toBe('open')
  })

  it('forwards ref to trigger', () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <HoverCard>
        <HoverCardTrigger ref={ref} href="#">
          Link
        </HoverCardTrigger>
      </HoverCard>,
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it('trigger has href attribute', () => {
    const { container } = renderHoverCard()
    expect(container.querySelector('[data-slot="hover-card-trigger"]')?.getAttribute('href')).toBe('#')
  })

  it('passes className to trigger', () => {
    const { container } = render(
      <HoverCard>
        <HoverCardTrigger href="#" className="hc-trigger">
          Link
        </HoverCardTrigger>
      </HoverCard>,
    )
    expect(container.querySelector('.hc-trigger')).not.toBeNull()
  })

  it('sets dir on trigger', () => {
    const { container } = renderHoverCard({ dir: 'rtl' })
    expect(container.querySelector('[data-slot="hover-card-trigger"]')?.getAttribute('dir')).toBe('rtl')
  })

  it('open=false shows data-state closed', () => {
    const { container } = renderHoverCard({ open: false })
    expect(container.querySelector('[data-slot="hover-card-trigger"]')?.getAttribute('data-state')).toBe('closed')
  })
})
