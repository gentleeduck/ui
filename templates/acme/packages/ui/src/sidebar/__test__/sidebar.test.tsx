import { describe, expect, test } from 'vitest'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SidebarTrigger } from '../sidebar'
import { SidebarContext } from '../sidebar.hooks'

const sidebarContextValue = {
  state: 'expanded' as const,
  open: true,
  setOpen: () => {},
  openMobile: false,
  setOpenMobile: () => {},
  isMobile: false,
  toggleSidebar: () => {},
  dir: 'ltr' as const,
}

describe('registry-ui sidebar', () => {
  test('SidebarTrigger prefers a provided icon over the default panel icon', () => {
    const html = renderToStaticMarkup(
      <SidebarContext.Provider value={sidebarContextValue}>
        <SidebarTrigger icon={<span data-icon="custom">C</span>} />
      </SidebarContext.Provider>,
    )

    expect(html).toContain('data-icon="custom"')
    expect(html).not.toContain('lucide-panel-left')
  })

  test('SidebarTrigger still renders the default panel icon when no icon is provided', () => {
    const html = renderToStaticMarkup(
      <SidebarContext.Provider value={sidebarContextValue}>
        <SidebarTrigger />
      </SidebarContext.Provider>,
    )

    expect(html).toContain('lucide-panel-left')
  })
})
