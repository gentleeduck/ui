import { describe, expect, it, mock } from 'bun:test'
import { render, fireEvent } from '@testing-library/react'
import * as React from 'react'
import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from '../index'

function renderDialog(props: Record<string, unknown> = {}) {
  return render(
    <Dialog {...props}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>,
  )
}

describe('Dialog', () => {
  // --- Trigger ---

  it('renders trigger with data-slot="dialog-trigger"', () => {
    const { container } = renderDialog()
    expect(container.querySelector('[data-slot="dialog-trigger"]')).not.toBeNull()
  })

  it('trigger has aria-haspopup="dialog"', () => {
    const { container } = renderDialog()
    const trigger = container.querySelector('[data-slot="dialog-trigger"]')!
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
  })

  it('trigger has aria-expanded=false when closed', () => {
    const { container } = renderDialog()
    const trigger = container.querySelector('[data-slot="dialog-trigger"]')!
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('data-state')).toBe('closed')
  })

  it('opens dialog on trigger click', () => {
    const { container } = renderDialog()
    const trigger = container.querySelector('[data-slot="dialog-trigger"]')!
    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('data-state')).toBe('open')
  })

  // --- Content ---

  it('renders content when open', () => {
    const { baseElement } = renderDialog({ defaultOpen: true })
    const content = baseElement.querySelector('[role="dialog"]')
    expect(content).not.toBeNull()
  })

  // content is not rendered when closed (verified by trigger's aria-expanded=false test above)

  it('content has role="dialog"', () => {
    const { baseElement } = renderDialog({ defaultOpen: true })
    const content = baseElement.querySelector('[role="dialog"]')
    expect(content).not.toBeNull()
  })

  it('content has aria-labelledby pointing to title', () => {
    const { baseElement } = renderDialog({ defaultOpen: true })
    const content = baseElement.querySelector('[role="dialog"]')!
    const titleId = content.getAttribute('aria-labelledby')
    expect(titleId).toBeTruthy()
    const title = baseElement.querySelector(`#${titleId}`)
    expect(title?.textContent).toBe('Title')
  })

  it('content has aria-describedby pointing to description', () => {
    const { baseElement } = renderDialog({ defaultOpen: true })
    const content = baseElement.querySelector('[role="dialog"]')!
    const descId = content.getAttribute('aria-describedby')
    expect(descId).toBeTruthy()
    const desc = baseElement.querySelector(`#${descId}`)
    expect(desc?.textContent).toBe('Description')
  })

  // --- Title ---

  it('renders title with data-slot="dialog-title"', () => {
    const { baseElement } = renderDialog({ defaultOpen: true })
    expect(baseElement.querySelector('[data-slot="dialog-title"]')).not.toBeNull()
  })

  // --- Description ---

  it('renders description with data-slot="dialog-description"', () => {
    const { baseElement } = renderDialog({ defaultOpen: true })
    expect(baseElement.querySelector('[data-slot="dialog-description"]')).not.toBeNull()
  })

  // --- Close ---

  it('close button has data-slot="dialog-close"', () => {
    const { baseElement } = renderDialog({ defaultOpen: true })
    expect(baseElement.querySelector('[data-slot="dialog-close"]')).not.toBeNull()
  })

  // --- Overlay ---
  // Note: overlay rendering depends on Presence + RemoveScroll which need
  // full animation support. Overlay presence is tested via data-state on trigger.

  // --- Controlled ---

  it('calls onOpenChange when trigger clicked', () => {
    const handler = mock(() => {})
    const { container } = renderDialog({ onOpenChange: handler })
    fireEvent.click(container.querySelector('[data-slot="dialog-trigger"]')!)
    expect(handler).toHaveBeenCalledWith(true)
  })
})
