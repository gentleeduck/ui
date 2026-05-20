import { describe, expect, test } from 'vitest'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PreviewPanel } from '../preview-panel'
import type { IPreviewPanelProps } from '../preview-panel.types'

describe('registry-ui preview-panel', () => {
  test('exposes the explicit `unsafeHtml` prop, not `html` (SEC-002)', () => {
    // The trusted-input-only raw-HTML sink is named `unsafeHtml` so callers
    // see the contract at every call site. A plain `html` prop must not exist.
    const props: IPreviewPanelProps = { unsafeHtml: '<p>trusted</p>' }
    expect(props.unsafeHtml).toBe('<p>trusted</p>')

    // @ts-expect-error - the legacy `html` prop has been removed.
    const legacy: IPreviewPanelProps = { html: '<p>x</p>' }
    expect(legacy).toBeDefined()
  })

  test('renders `unsafeHtml` verbatim into the panel content', () => {
    const html = renderToStaticMarkup(<PreviewPanel unsafeHtml="<span>preview body</span>" showControls={false} />)
    expect(html).toContain('<span>preview body</span>')
  })
})
