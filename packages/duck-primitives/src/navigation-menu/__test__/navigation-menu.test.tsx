import { describe, expect, it } from 'bun:test'
import { render } from '@testing-library/react'
import * as React from 'react'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '../index'

describe('NavigationMenu', () => {
  it('renders with data-slot="navigation-menu"', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    expect(container.querySelector('[data-slot="navigation-menu"]')).not.toBeNull()
  })

  it('renders as a nav element', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    expect(container.querySelector('nav')).not.toBeNull()
  })

  it('renders list with data-slot="navigation-menu-list"', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    expect(container.querySelector('[data-slot="navigation-menu-list"]')).not.toBeNull()
  })

  it('renders link with data-slot="navigation-menu-link"', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">About</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    const link = container.querySelector('[data-slot="navigation-menu-link"]')
    expect(link).not.toBeNull()
    expect(link?.textContent).toBe('About')
  })

  it('link sets data-active when active', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" active>
              Current
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    const link = container.querySelector('[data-slot="navigation-menu-link"]')!
    expect(link.getAttribute('data-active')).toBe('')
  })

  it('forwards ref to nav', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <NavigationMenu ref={ref}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    expect(ref.current?.tagName).toBe('NAV')
  })
})
