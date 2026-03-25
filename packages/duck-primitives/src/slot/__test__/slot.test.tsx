import { describe, expect, it, mock } from 'bun:test'
import { render } from '@testing-library/react'
import * as React from 'react'
import { Slot, Slottable } from '../slot'

describe('Slot', () => {
  it('renders children directly when no asChild', () => {
    const { container } = render(<Slot><span>hello</span></Slot>)
    expect(container.querySelector('span')?.textContent).toBe('hello')
  })

  it('merges className from slot and child', () => {
    const { container } = render(
      <Slot className="slot-class">
        <span className="child-class">text</span>
      </Slot>,
    )
    const span = container.querySelector('span')!
    expect(span.className).toContain('slot-class')
    expect(span.className).toContain('child-class')
  })

  it('composes event handlers from slot and child', () => {
    const slotClick = mock(() => {})
    const childClick = mock(() => {})
    const { container } = render(
      <Slot onClick={slotClick}>
        <button onClick={childClick}>click me</button>
      </Slot>,
    )
    container.querySelector('button')!.click()
    expect(childClick).toHaveBeenCalledTimes(1)
    expect(slotClick).toHaveBeenCalledTimes(1)
  })

  it('merges style objects', () => {
    const { container } = render(
      <Slot style={{ color: 'red' }}>
        <div style={{ fontSize: '14px' }}>styled</div>
      </Slot>,
    )
    const div = container.querySelector('div')!
    expect(div.style.color).toBe('red')
    expect(div.style.fontSize).toBe('14px')
  })

  it('forwards ref to the child element', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Slot ref={ref}>
        <button>ref target</button>
      </Slot>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toBe('ref target')
  })
})

describe('Slottable', () => {
  it('renders Slottable children through the Slot', () => {
    const { container } = render(
      <Slot>
        <Slottable>
          <a href="/test">link</a>
        </Slottable>
      </Slot>,
    )
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/test')
  })
})
