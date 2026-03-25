import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../index'

function renderTooltip(props: Record<string, unknown> = {}, triggerProps: Record<string, unknown> = {}) {
  return render(
    <TooltipProvider delayDuration={0}>
      <Tooltip {...props}>
        <TooltipTrigger {...triggerProps}>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )
}

describe('Tooltip', () => {
  // --- Trigger ---

  it('renders trigger with data-slot="tooltip-trigger"', () => {
    const { container } = renderTooltip()
    expect(container.querySelector('[data-slot="tooltip-trigger"]')).not.toBeNull()
  })

  it('trigger has data-state="closed" when closed', () => {
    const { container } = renderTooltip()
    const trigger = container.querySelector('[data-slot="tooltip-trigger"]')!
    expect(trigger.getAttribute('data-state')).toBe('closed')
  })

  it('trigger does not have aria-describedby when closed', () => {
    const { container } = renderTooltip()
    const trigger = container.querySelector('[data-slot="tooltip-trigger"]')!
    expect(trigger.getAttribute('aria-describedby')).toBeNull()
  })

  // --- Open/Close ---

  it('opens on focus', () => {
    const onOpenChange = mock(() => {})
    const { container } = renderTooltip({ onOpenChange })
    const trigger = container.querySelector('[data-slot="tooltip-trigger"]')!
    fireEvent.focus(trigger)
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('closes on blur', () => {
    const { container } = renderTooltip({ defaultOpen: true })
    const trigger = container.querySelector('[data-slot="tooltip-trigger"]')!
    fireEvent.blur(trigger)
    // After blur, state should transition to closed
    expect(trigger.getAttribute('data-state')).toBe('closed')
  })

  // --- Controlled ---

  it('respects open prop (controlled)', () => {
    const { container } = renderTooltip({ open: true })
    const trigger = container.querySelector('[data-slot="tooltip-trigger"]')!
    expect(trigger.getAttribute('aria-describedby')).toBeTruthy()
  })

  // --- disableCloseOnClick ---

  it('trigger with disableCloseOnClick uses data-tooltip-state instead of data-slot="tooltip-trigger"', () => {
    const { container } = renderTooltip({}, { disableCloseOnClick: true })
    expect(container.querySelector('[data-slot="tooltip-trigger"]')).toBeNull()
    expect(container.querySelector('[data-tooltip-state]')).not.toBeNull()
  })

  // --- Provider ---

  it('TooltipProvider renders children', () => {
    const { container } = render(
      <TooltipProvider>
        <span data-testid="child">content</span>
      </TooltipProvider>,
    )
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull()
  })
})
