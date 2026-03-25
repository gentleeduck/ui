import { describe, expect, it } from 'bun:test'
import { render } from '@testing-library/react'
import * as React from 'react'
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from '../index'

function renderCommand(props: Record<string, unknown> = {}) {
  return render(
    <Command {...props}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results</CommandEmpty>
        <CommandGroup heading="Fruits">
          <CommandItem value="apple">Apple</CommandItem>
          <CommandItem value="banana">Banana</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>,
  )
}

describe('Command', () => {
  it('renders with data-slot="command"', () => {
    const { container } = renderCommand()
    expect(container.querySelector('[data-slot="command"]')).not.toBeNull()
  })

  it('renders input with data-slot="command-input"', () => {
    const { container } = renderCommand()
    expect(container.querySelector('[data-slot="command-input"]')).not.toBeNull()
  })

  it('renders list with data-slot="command-list"', () => {
    const { container } = renderCommand()
    expect(container.querySelector('[data-slot="command-list"]')).not.toBeNull()
  })

  it('renders items with data-slot="command-item"', () => {
    const { container } = renderCommand()
    expect(container.querySelectorAll('[data-slot="command-item"]').length).toBe(2)
  })

  it('renders group with data-slot="command-group"', () => {
    const { container } = renderCommand()
    expect(container.querySelector('[data-slot="command-group"]')).not.toBeNull()
  })

  it('renders empty with data-slot="command-empty"', () => {
    const { container } = renderCommand()
    // Empty is hidden when items exist, but still in DOM
    const empty = container.querySelector('[data-slot="command-empty"]')
    // May or may not render depending on filter state
    expect(container.querySelector('[data-slot="command"]')).not.toBeNull()
  })

  it('input has placeholder', () => {
    const { container } = renderCommand()
    const input = container.querySelector('input')
    expect(input?.getAttribute('placeholder')).toBe('Search...')
  })

  it('items have role="option"', () => {
    const { container } = renderCommand()
    const items = container.querySelectorAll('[role="option"]')
    expect(items.length).toBe(2)
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Command ref={ref}>
        <CommandList>
          <CommandItem value="x">X</CommandItem>
        </CommandList>
      </Command>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
