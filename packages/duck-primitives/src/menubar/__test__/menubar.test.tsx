import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarPortal, MenubarTrigger } from '../index'

function renderMenubar() {
  return render(
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarPortal>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>,
  )
}

describe('Menubar', () => {
  it('renders with data-slot="menubar"', () => {
    const { container } = renderMenubar()
    expect(container.querySelector('[data-slot="menubar"]')).not.toBeNull()
  })

  it('renders triggers with data-slot="menubar-trigger"', () => {
    const { container } = renderMenubar()
    expect(container.querySelectorAll('[data-slot="menubar-trigger"]').length).toBe(2)
  })

  it('triggers have role="menuitem"', () => {
    const { container } = renderMenubar()
    const triggers = container.querySelectorAll('[data-slot="menubar-trigger"]')
    for (const t of triggers) {
      expect(t.getAttribute('role')).toBe('menuitem')
    }
  })

  it('triggers have aria-haspopup="menu"', () => {
    const { container } = renderMenubar()
    const trigger = container.querySelector('[data-slot="menubar-trigger"]')!
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
  })

  it('triggers start closed', () => {
    const { container } = renderMenubar()
    const triggers = container.querySelectorAll('[data-slot="menubar-trigger"]')
    for (const t of triggers) {
      expect(t.getAttribute('data-state')).toBe('closed')
      expect(t.getAttribute('aria-expanded')).toBe('false')
    }
  })

  it('triggers have type="button"', () => {
    const { container } = renderMenubar()
    const trigger = container.querySelector('[data-slot="menubar-trigger"]')!
    expect(trigger.getAttribute('type')).toBe('button')
  })

  it('opens on Enter key', () => {
    const { container } = renderMenubar()
    const trigger = container.querySelector('[data-slot="menubar-trigger"]')!
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(trigger.getAttribute('data-state')).toBe('open')
  })

  it('opens on Space key', () => {
    const { container } = renderMenubar()
    const trigger = container.querySelector('[data-slot="menubar-trigger"]')!
    fireEvent.keyDown(trigger, { key: ' ' })
    expect(trigger.getAttribute('data-state')).toBe('open')
  })

  it('opens on ArrowDown key', () => {
    const { container } = renderMenubar()
    const trigger = container.querySelector('[data-slot="menubar-trigger"]')!
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(trigger.getAttribute('data-state')).toBe('open')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Menubar ref={ref}>
        <MenubarMenu value="f">
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
      </Menubar>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
