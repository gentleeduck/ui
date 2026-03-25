import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuTrigger } from '../index'

function renderDropdown(props: Record<string, unknown> = {}) {
  return render(
    <DropdownMenu {...props}>
      <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>,
  )
}

describe('DropdownMenu', () => {
  it('renders trigger with data-slot="dropdown-menu-trigger"', () => {
    const { container } = renderDropdown()
    expect(container.querySelector('[data-slot="dropdown-menu-trigger"]')).not.toBeNull()
  })

  it('trigger has type="button"', () => {
    const { container } = renderDropdown()
    expect(container.querySelector('[data-slot="dropdown-menu-trigger"]')?.getAttribute('type')).toBe('button')
  })

  it('trigger has aria-haspopup="menu"', () => {
    const { container } = renderDropdown()
    expect(container.querySelector('[data-slot="dropdown-menu-trigger"]')?.getAttribute('aria-haspopup')).toBe('menu')
  })

  it('trigger starts closed', () => {
    const { container } = renderDropdown()
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')!
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('data-state')).toBe('closed')
  })

  it('trigger opens on Enter key', () => {
    const handler = mock(() => {})
    const { container } = renderDropdown({ onOpenChange: handler })
    fireEvent.keyDown(container.querySelector('[data-slot="dropdown-menu-trigger"]')!, { key: 'Enter' })
    expect(handler).toHaveBeenCalled()
  })

  it('trigger opens on Space key', () => {
    const handler = mock(() => {})
    const { container } = renderDropdown({ onOpenChange: handler })
    fireEvent.keyDown(container.querySelector('[data-slot="dropdown-menu-trigger"]')!, { key: ' ' })
    expect(handler).toHaveBeenCalled()
  })

  it('trigger opens on ArrowDown key', () => {
    const handler = mock(() => {})
    const { container } = renderDropdown({ onOpenChange: handler })
    fireEvent.keyDown(container.querySelector('[data-slot="dropdown-menu-trigger"]')!, { key: 'ArrowDown' })
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('disabled trigger has data-disabled and disabled attr', () => {
    const { container } = render(
      <DropdownMenu>
        <DropdownMenuTrigger disabled>Menu</DropdownMenuTrigger>
      </DropdownMenu>,
    )
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')!
    expect(trigger.getAttribute('data-disabled')).toBe('')
    expect((trigger as HTMLButtonElement).disabled).toBe(true)
  })

  it('calls onOpenChange', () => {
    const handler = mock(() => {})
    const { container } = renderDropdown({ onOpenChange: handler })
    fireEvent.keyDown(container.querySelector('[data-slot="dropdown-menu-trigger"]')!, { key: 'Enter' })
    expect(handler).toHaveBeenCalled()
  })

  it('forwards ref to trigger', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger ref={ref}>Menu</DropdownMenuTrigger>
      </DropdownMenu>,
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
