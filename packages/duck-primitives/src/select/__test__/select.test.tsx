import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { Select, SelectContent, SelectItem, SelectPortal, SelectTrigger, SelectValue } from '../index'

function renderSelect(props: Record<string, unknown> = {}) {
  return render(
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Choose" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </SelectPortal>
    </Select>,
  )
}

describe('Select', () => {
  it('renders trigger with data-slot="select-trigger"', () => {
    const { container } = renderSelect()
    expect(container.querySelector('[data-slot="select-trigger"]')).not.toBeNull()
  })

  it('trigger has role="combobox"', () => {
    const { container } = renderSelect()
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('role')).toBe('combobox')
  })

  it('trigger has type="button"', () => {
    const { container } = renderSelect()
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('type')).toBe('button')
  })

  it('trigger has aria-expanded=false when closed', () => {
    const { container } = renderSelect()
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('aria-expanded')).toBe('false')
  })

  it('trigger has data-state="closed"', () => {
    const { container } = renderSelect()
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('data-state')).toBe('closed')
  })

  it('trigger has aria-autocomplete="none"', () => {
    const { container } = renderSelect()
    expect(container.querySelector('[data-slot="select-trigger"]')?.getAttribute('aria-autocomplete')).toBe('none')
  })

  it('shows placeholder text', () => {
    const { container } = renderSelect()
    expect(container.querySelector('[data-slot="select-value"]')?.textContent).toBe('Choose')
  })

  it('shows data-placeholder when no value selected', () => {
    const { container } = renderSelect()
    expect(container.querySelector('[data-slot="select-trigger"]')?.hasAttribute('data-placeholder')).toBe(true)
  })

  it('disabled trigger has disabled attr', () => {
    const { container } = renderSelect({ disabled: true })
    const trigger = container.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    expect(trigger.disabled).toBe(true)
    expect(trigger.getAttribute('data-disabled')).toBe('')
  })

  it('forwards ref to trigger', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Select>
        <SelectTrigger ref={ref}>
          <SelectValue />
        </SelectTrigger>
      </Select>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('calls onOpenChange on trigger keyboard events', () => {
    const handler = mock(() => {})
    const { container } = renderSelect({ onOpenChange: handler })
    fireEvent.keyDown(container.querySelector('[data-slot="select-trigger"]')!, { key: 'ArrowDown' })
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('opens on Enter key', () => {
    const handler = mock(() => {})
    const { container } = renderSelect({ onOpenChange: handler })
    fireEvent.keyDown(container.querySelector('[data-slot="select-trigger"]')!, { key: 'Enter' })
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('opens on Space key', () => {
    const handler = mock(() => {})
    const { container } = renderSelect({ onOpenChange: handler })
    fireEvent.keyDown(container.querySelector('[data-slot="select-trigger"]')!, { key: ' ' })
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('shows selected value instead of placeholder', () => {
    const { container } = renderSelect({ defaultValue: 'banana' })
    expect(container.querySelector('[data-slot="select-trigger"]')?.hasAttribute('data-placeholder')).toBe(false)
  })
})
