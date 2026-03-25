import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '../index'

function renderRadioGroup(props: Record<string, unknown> = {}) {
  return render(
    <RadioGroup {...props}>
      <RadioGroupItem value="a">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <RadioGroupItem value="b">
        <RadioGroupIndicator />
      </RadioGroupItem>
      <RadioGroupItem value="c">
        <RadioGroupIndicator />
      </RadioGroupItem>
    </RadioGroup>,
  )
}

describe('RadioGroup', () => {
  it('renders with data-slot="radio-group"', () => {
    const { container } = renderRadioGroup()
    expect(container.querySelector('[data-slot="radio-group"]')).not.toBeNull()
  })

  it('has role="radiogroup"', () => {
    const { container } = renderRadioGroup()
    expect(container.querySelector('[role="radiogroup"]')).not.toBeNull()
  })

  it('renders items with role="radio"', () => {
    const { container } = renderRadioGroup()
    expect(container.querySelectorAll('[role="radio"]').length).toBe(3)
  })

  it('no item is checked by default', () => {
    const { container } = renderRadioGroup()
    const radios = container.querySelectorAll('[role="radio"]')
    for (const radio of radios) {
      expect(radio.getAttribute('aria-checked')).toBe('false')
    }
  })

  it('selects item on click', () => {
    const { container } = renderRadioGroup()
    const radios = container.querySelectorAll('[role="radio"]')
    fireEvent.click(radios[1]!)
    expect(radios[1]!.getAttribute('aria-checked')).toBe('true')
    expect(radios[0]!.getAttribute('aria-checked')).toBe('false')
    expect(radios[2]!.getAttribute('aria-checked')).toBe('false')
  })

  it('supports defaultValue', () => {
    const { container } = renderRadioGroup({ defaultValue: 'b' })
    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios[0]!.getAttribute('aria-checked')).toBe('false')
    expect(radios[1]!.getAttribute('aria-checked')).toBe('true')
    expect(radios[2]!.getAttribute('aria-checked')).toBe('false')
  })

  it('calls onValueChange on selection', () => {
    const handler = mock(() => {})
    const { container } = renderRadioGroup({ onValueChange: handler })
    fireEvent.click(container.querySelectorAll('[role="radio"]')[0]!)
    expect(handler).toHaveBeenCalledWith('a')
  })

  it('items have data-state on/off', () => {
    const { container } = renderRadioGroup({ defaultValue: 'a' })
    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios[0]!.getAttribute('data-state')).toBe('checked')
    expect(radios[1]!.getAttribute('data-state')).toBe('unchecked')
  })

  it('disabled group disables all items', () => {
    const { container } = renderRadioGroup({ disabled: true })
    const radios = container.querySelectorAll('[role="radio"]')
    for (const radio of radios) {
      expect(radio.getAttribute('data-disabled')).toBe('')
    }
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <RadioGroup ref={ref}>
        <RadioGroupItem value="a">
          <RadioGroupIndicator />
        </RadioGroupItem>
      </RadioGroup>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('only one item can be checked at a time', () => {
    const { container } = renderRadioGroup()
    const radios = container.querySelectorAll('[role="radio"]')
    fireEvent.click(radios[0]!)
    fireEvent.click(radios[2]!)
    const checked = Array.from(radios).filter((r) => r.getAttribute('aria-checked') === 'true')
    expect(checked.length).toBe(1)
    expect(radios[2]!.getAttribute('aria-checked')).toBe('true')
  })

  it('clicking same item does not uncheck it', () => {
    const { container } = renderRadioGroup()
    const radios = container.querySelectorAll('[role="radio"]')
    fireEvent.click(radios[0]!)
    fireEvent.click(radios[0]!)
    expect(radios[0]!.getAttribute('aria-checked')).toBe('true')
  })

  it('works as controlled component', () => {
    const { container, rerender } = render(
      <RadioGroup value="a">
        <RadioGroupItem value="a">
          <RadioGroupIndicator />
        </RadioGroupItem>
        <RadioGroupItem value="b">
          <RadioGroupIndicator />
        </RadioGroupItem>
      </RadioGroup>,
    )
    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios[0]!.getAttribute('aria-checked')).toBe('true')
    rerender(
      <RadioGroup value="b">
        <RadioGroupItem value="a">
          <RadioGroupIndicator />
        </RadioGroupItem>
        <RadioGroupItem value="b">
          <RadioGroupIndicator />
        </RadioGroupItem>
      </RadioGroup>,
    )
    expect(radios[0]!.getAttribute('aria-checked')).toBe('false')
    expect(radios[1]!.getAttribute('aria-checked')).toBe('true')
  })

  it('required group sets aria-required', () => {
    const { container } = renderRadioGroup({ required: true })
    expect(container.querySelector('[role="radiogroup"]')?.getAttribute('aria-required')).toBe('true')
  })

  it('passes className', () => {
    const { container } = render(
      <RadioGroup className="custom-radio">
        <RadioGroupItem value="a">
          <RadioGroupIndicator />
        </RadioGroupItem>
      </RadioGroup>,
    )
    expect(container.querySelector('.custom-radio')).not.toBeNull()
  })

  it('sets dir attribute', () => {
    const { container } = renderRadioGroup({ dir: 'rtl' })
    expect(container.querySelector('[role="radiogroup"]')?.getAttribute('dir')).toBe('rtl')
  })
})
