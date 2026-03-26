import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '../index'

describe('ToggleGroup (single)', () => {
  it('renders with data-slot="toggle-group"', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(container.querySelector('[data-slot="toggle-group"]')).not.toBeNull()
  })

  it('renders items with data-slot="toggle-group-item"', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(container.querySelectorAll('[data-slot="toggle-group-item"]').length).toBe(2)
  })

  it('selects an item on click', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('data-state')).toBe('on')
    expect(items[1]!.getAttribute('data-state')).toBe('off')
  })

  it('deselects previous when selecting another in single mode', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    fireEvent.click(items[0]!)
    fireEvent.click(items[1]!)
    expect(items[0]!.getAttribute('data-state')).toBe('off')
    expect(items[1]!.getAttribute('data-state')).toBe('on')
  })

  it('calls onValueChange with selected value', () => {
    const handler = mock(() => {})
    const { container } = render(
      <ToggleGroup type="single" onValueChange={handler}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    fireEvent.click(container.querySelector('[data-slot="toggle-group-item"]')!)
    expect(handler).toHaveBeenCalledWith('a')
  })

  it('supports defaultValue', () => {
    const { container } = render(
      <ToggleGroup type="single" defaultValue="b">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    expect(items[0]!.getAttribute('data-state')).toBe('off')
    expect(items[1]!.getAttribute('data-state')).toBe('on')
  })

  it('has role="group"', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(container.querySelector('[role="group"]')).not.toBeNull()
  })
})

describe('ToggleGroup (multiple)', () => {
  it('allows multiple items to be on', () => {
    const { container } = render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    fireEvent.click(items[0]!)
    fireEvent.click(items[1]!)
    expect(items[0]!.getAttribute('data-state')).toBe('on')
    expect(items[1]!.getAttribute('data-state')).toBe('on')
  })

  it('calls onValueChange with array of values', () => {
    const handler = mock(() => {})
    const { container } = render(
      <ToggleGroup type="multiple" onValueChange={handler}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    fireEvent.click(items[0]!)
    expect(handler).toHaveBeenCalledWith(['a'])
    fireEvent.click(items[1]!)
    expect(handler).toHaveBeenCalledWith(['a', 'b'])
  })

  it('toggles item off when clicking again', () => {
    const handler = mock(() => {})
    const { container } = render(
      <ToggleGroup type="multiple" onValueChange={handler}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    fireEvent.click(items[0]!)
    fireEvent.click(items[0]!)
    expect(handler).toHaveBeenCalledWith([])
  })

  it('supports defaultValue as array', () => {
    const { container } = render(
      <ToggleGroup type="multiple" defaultValue={['a', 'b']}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    expect(items[0]!.getAttribute('data-state')).toBe('on')
    expect(items[1]!.getAttribute('data-state')).toBe('on')
    expect(items[2]!.getAttribute('data-state')).toBe('off')
  })
})

describe('ToggleGroup (shared)', () => {
  it('disabled group disables all items', () => {
    const { container } = render(
      <ToggleGroup type="single" disabled>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    for (const item of items) {
      expect(item.getAttribute('data-disabled')).toBe('')
    }
  })

  it('items have data-state on/off', () => {
    const { container } = render(
      <ToggleGroup type="single" defaultValue="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    expect(items[0]!.getAttribute('data-state')).toBe('on')
    expect(items[1]!.getAttribute('data-state')).toBe('off')
  })

  it('passes className to group', () => {
    const { container } = render(
      <ToggleGroup type="single" className="my-group">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(container.querySelector('.my-group')).not.toBeNull()
  })

  it('sets dir attribute', () => {
    const { container } = render(
      <ToggleGroup type="single" dir="rtl">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(container.querySelector('[data-slot="toggle-group"]')?.getAttribute('dir')).toBe('rtl')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <ToggleGroup type="single" ref={ref}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
