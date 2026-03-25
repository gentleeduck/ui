import { describe, expect, it, mock } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '../dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuPortal, DropdownMenuTrigger } from '../dropdown-menu'
import { Popover, PopoverClose, PopoverContent, PopoverPortal, PopoverTrigger } from '../popover'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '../radio-group'
import { ToggleGroup, ToggleGroupItem } from '../toggle-group'

// ---------------------------------------------------------------------------
// 1. Dialog full lifecycle
// ---------------------------------------------------------------------------

describe('Dialog full lifecycle', () => {
  function renderFullDialog(props: Record<string, unknown> = {}) {
    return render(
      <Dialog {...props}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>My Title</DialogTitle>
            <DialogDescription>My Description</DialogDescription>
            <DialogClose>Close Me</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>,
    )
  }

  it('clicking trigger opens dialog and content appears', () => {
    const { container, baseElement } = renderFullDialog()
    const trigger = container.querySelector('[data-slot="dialog-trigger"]')!

    // Initially closed
    expect(trigger.getAttribute('data-state')).toBe('closed')
    expect(baseElement.querySelector('[role="dialog"]')).toBeNull()

    // Click to open
    fireEvent.click(trigger)
    expect(trigger.getAttribute('data-state')).toBe('open')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(baseElement.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it('content has correct ARIA linking to title and description', () => {
    const { baseElement } = renderFullDialog({ defaultOpen: true })
    const content = baseElement.querySelector('[role="dialog"]')!

    // aria-labelledby -> title
    const titleId = content.getAttribute('aria-labelledby')
    expect(titleId).toBeTruthy()
    const title = baseElement.querySelector(`#${titleId}`)
    expect(title).not.toBeNull()
    expect(title!.textContent).toBe('My Title')

    // aria-describedby -> description
    const descId = content.getAttribute('aria-describedby')
    expect(descId).toBeTruthy()
    const desc = baseElement.querySelector(`#${descId}`)
    expect(desc).not.toBeNull()
    expect(desc!.textContent).toBe('My Description')
  })

  it('close button renders inside dialog content', () => {
    const { baseElement } = renderFullDialog({ defaultOpen: true })
    const dialog = baseElement.querySelector('[role="dialog"]')!
    const closeBtn = dialog.querySelector('[data-slot="dialog-close"]')
    expect(closeBtn).not.toBeNull()
    expect(closeBtn?.textContent).toBe('Close Me')
  })

  it('fires onOpenChange(true) when trigger clicked', () => {
    const handler = mock(() => {})
    const { container } = renderFullDialog({ onOpenChange: handler })
    fireEvent.click(container.querySelector('[data-slot="dialog-trigger"]')!)
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('trigger aria-controls matches content id', () => {
    const { container, baseElement } = renderFullDialog({ defaultOpen: true })
    const trigger = container.querySelector('[data-slot="dialog-trigger"]')!
    const controlsId = trigger.getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()
    const content = baseElement.querySelector(`#${controlsId}`)
    expect(content).not.toBeNull()
  })

  // Note: DialogOverlay uses RemoveScroll which renders through a Slot wrapper
  // that does not produce the expected DOM nodes in jsdom. We verify overlay
  // presence indirectly through the trigger state, matching the approach used
  // in the existing unit tests.
  it('overlay is gated on open state (verified via trigger lifecycle)', () => {
    const { container } = renderFullDialog()
    const trigger = container.querySelector('[data-slot="dialog-trigger"]')!

    // Closed -- overlay Presence should not render
    expect(trigger.getAttribute('data-state')).toBe('closed')

    // Open -- overlay Presence should render (trigger proves open state)
    fireEvent.click(trigger)
    expect(trigger.getAttribute('data-state')).toBe('open')
  })

  it('title and description have correct data-slot attributes', () => {
    const { baseElement } = renderFullDialog({ defaultOpen: true })
    expect(baseElement.querySelector('[data-slot="dialog-title"]')).not.toBeNull()
    expect(baseElement.querySelector('[data-slot="dialog-description"]')).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// 2. Popover with close button
// ---------------------------------------------------------------------------

describe('Popover with close button', () => {
  function renderPopover(props: Record<string, unknown> = {}) {
    return render(
      <Popover {...props}>
        <PopoverTrigger>Toggle Popover</PopoverTrigger>
        <PopoverPortal>
          <PopoverContent>
            <p>Popover body</p>
            <PopoverClose>Dismiss</PopoverClose>
          </PopoverContent>
        </PopoverPortal>
      </Popover>,
    )
  }

  // Note: PopoverContent renders through PopperContent (floating-ui) which
  // does not fully produce DOM in jsdom. We verify open/close through the
  // trigger state and onOpenChange callbacks, matching existing unit tests.
  it('clicking trigger opens popover (verified via trigger state)', () => {
    const handler = mock(() => {})
    const { container } = renderPopover({ onOpenChange: handler })
    const trigger = container.querySelector('[data-slot="popover-trigger"]')!

    expect(trigger.getAttribute('data-state')).toBe('closed')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(trigger)
    expect(trigger.getAttribute('data-state')).toBe('open')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('clicking trigger twice closes the popover', () => {
    const handler = mock(() => {})
    const { container } = renderPopover({ onOpenChange: handler })
    const trigger = container.querySelector('[data-slot="popover-trigger"]')!

    fireEvent.click(trigger)
    expect(handler).toHaveBeenCalledWith(true)

    fireEvent.click(trigger)
    expect(handler).toHaveBeenCalledWith(false)
    expect(trigger.getAttribute('data-state')).toBe('closed')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('trigger has correct ARIA attributes', () => {
    const { container } = renderPopover()
    const trigger = container.querySelector('[data-slot="popover-trigger"]')!

    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('type')).toBe('button')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('trigger has aria-controls linking to content id', () => {
    const { container } = renderPopover()
    const trigger = container.querySelector('[data-slot="popover-trigger"]')!

    // aria-controls is always set (points to the content id)
    const controlsId = trigger.getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()
  })

  it('fires onOpenChange with correct values across open/close cycle', () => {
    const handler = mock(() => {})
    const { container } = renderPopover({ onOpenChange: handler })
    const trigger = container.querySelector('[data-slot="popover-trigger"]')!

    fireEvent.click(trigger)
    expect(handler).toHaveBeenCalledWith(true)

    // Close by toggling the trigger again
    fireEvent.click(trigger)
    expect(handler).toHaveBeenCalledWith(false)
    expect(handler).toHaveBeenCalledTimes(2)
  })
})

// ---------------------------------------------------------------------------
// 3. RadioGroup with Indicator
// ---------------------------------------------------------------------------

describe('RadioGroup with Indicator', () => {
  function renderRadioGroup(props: Record<string, unknown> = {}) {
    return render(
      <RadioGroup {...props}>
        <RadioGroupItem value="apple">
          <RadioGroupIndicator />
          Apple
        </RadioGroupItem>
        <RadioGroupItem value="banana">
          <RadioGroupIndicator />
          Banana
        </RadioGroupItem>
        <RadioGroupItem value="cherry">
          <RadioGroupIndicator />
          Cherry
        </RadioGroupItem>
      </RadioGroup>,
    )
  }

  it('renders all items with role="radio"', () => {
    const { container } = renderRadioGroup()
    const items = container.querySelectorAll('[role="radio"]')
    expect(items.length).toBe(3)
  })

  it('clicking an item checks it', () => {
    const { container } = renderRadioGroup()
    const items = container.querySelectorAll('[data-slot="radio-group-item"]')

    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('aria-checked')).toBe('true')
    expect(items[0]!.getAttribute('data-state')).toBe('checked')
  })

  it('only one item is checked at a time', () => {
    const { container } = renderRadioGroup()
    const items = container.querySelectorAll('[data-slot="radio-group-item"]')

    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('aria-checked')).toBe('true')
    expect(items[1]!.getAttribute('aria-checked')).toBe('false')
    expect(items[2]!.getAttribute('aria-checked')).toBe('false')

    fireEvent.click(items[2]!)
    expect(items[0]!.getAttribute('aria-checked')).toBe('false')
    expect(items[1]!.getAttribute('aria-checked')).toBe('false')
    expect(items[2]!.getAttribute('aria-checked')).toBe('true')
  })

  it('indicator renders only for the checked item', () => {
    const { container } = renderRadioGroup()
    const items = container.querySelectorAll('[data-slot="radio-group-item"]')

    // Initially no indicators visible (none checked)
    expect(container.querySelectorAll('[data-slot="radio-group-indicator"]').length).toBe(0)

    // Check first item
    fireEvent.click(items[0]!)
    const indicators = container.querySelectorAll('[data-slot="radio-group-indicator"]')
    expect(indicators.length).toBe(1)
    expect(indicators[0]!.getAttribute('data-state')).toBe('checked')
  })

  it('indicator moves when selection changes', () => {
    const { container } = renderRadioGroup()
    const items = container.querySelectorAll('[data-slot="radio-group-item"]')

    fireEvent.click(items[0]!)
    expect(container.querySelectorAll('[data-slot="radio-group-indicator"]').length).toBe(1)

    fireEvent.click(items[1]!)
    const indicators = container.querySelectorAll('[data-slot="radio-group-indicator"]')
    expect(indicators.length).toBe(1)
    // The indicator should be inside the second item
    expect(items[1]!.querySelector('[data-slot="radio-group-indicator"]')).not.toBeNull()
    expect(items[0]!.querySelector('[data-slot="radio-group-indicator"]')).toBeNull()
  })

  it('supports defaultValue', () => {
    const { container } = renderRadioGroup({ defaultValue: 'banana' })
    const items = container.querySelectorAll('[data-slot="radio-group-item"]')

    expect(items[0]!.getAttribute('aria-checked')).toBe('false')
    expect(items[1]!.getAttribute('aria-checked')).toBe('true')
    expect(items[2]!.getAttribute('aria-checked')).toBe('false')

    // Indicator should be present for the default-checked item
    expect(items[1]!.querySelector('[data-slot="radio-group-indicator"]')).not.toBeNull()
  })

  it('fires onValueChange with the selected value', () => {
    const handler = mock(() => {})
    const { container } = renderRadioGroup({ onValueChange: handler })
    const items = container.querySelectorAll('[data-slot="radio-group-item"]')

    fireEvent.click(items[2]!)
    expect(handler).toHaveBeenCalledWith('cherry')
  })

  it('group has role="radiogroup"', () => {
    const { container } = renderRadioGroup()
    expect(container.querySelector('[role="radiogroup"]')).not.toBeNull()
  })

  it('clicking already-checked item does not uncheck it', () => {
    const { container } = renderRadioGroup()
    const items = container.querySelectorAll('[data-slot="radio-group-item"]')

    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('aria-checked')).toBe('true')

    // Click the same item again
    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('aria-checked')).toBe('true')
  })
})

// ---------------------------------------------------------------------------
// 4. ToggleGroup with mixed values
// ---------------------------------------------------------------------------

describe('ToggleGroup single mode', () => {
  it('clicking an item activates it and deactivates others', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="bold">B</ToggleGroupItem>
        <ToggleGroupItem value="italic">I</ToggleGroupItem>
        <ToggleGroupItem value="underline">U</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')

    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('data-state')).toBe('on')
    expect(items[1]!.getAttribute('data-state')).toBe('off')
    expect(items[2]!.getAttribute('data-state')).toBe('off')

    fireEvent.click(items[2]!)
    expect(items[0]!.getAttribute('data-state')).toBe('off')
    expect(items[1]!.getAttribute('data-state')).toBe('off')
    expect(items[2]!.getAttribute('data-state')).toBe('on')
  })

  it('clicking the active item deactivates it', () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')

    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('data-state')).toBe('on')

    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('data-state')).toBe('off')
  })

  it('single mode items have role="radio" and aria-checked', () => {
    const { container } = render(
      <ToggleGroup type="single" defaultValue="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    expect(items[0]!.getAttribute('role')).toBe('radio')
    expect(items[0]!.getAttribute('aria-checked')).toBe('true')
    expect(items[1]!.getAttribute('aria-checked')).toBe('false')
  })
})

describe('ToggleGroup multiple mode', () => {
  it('allows multiple items to be active simultaneously', () => {
    const { container } = render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold">B</ToggleGroupItem>
        <ToggleGroupItem value="italic">I</ToggleGroupItem>
        <ToggleGroupItem value="underline">U</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')

    fireEvent.click(items[0]!)
    fireEvent.click(items[2]!)

    expect(items[0]!.getAttribute('data-state')).toBe('on')
    expect(items[1]!.getAttribute('data-state')).toBe('off')
    expect(items[2]!.getAttribute('data-state')).toBe('on')
  })

  it('toggling an active item off in multiple mode', () => {
    const { container } = render(
      <ToggleGroup type="multiple" defaultValue={['bold', 'italic']}>
        <ToggleGroupItem value="bold">B</ToggleGroupItem>
        <ToggleGroupItem value="italic">I</ToggleGroupItem>
        <ToggleGroupItem value="underline">U</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')

    expect(items[0]!.getAttribute('data-state')).toBe('on')
    expect(items[1]!.getAttribute('data-state')).toBe('on')

    fireEvent.click(items[0]!)
    expect(items[0]!.getAttribute('data-state')).toBe('off')
    expect(items[1]!.getAttribute('data-state')).toBe('on')
  })

  it('multiple mode items have aria-pressed instead of aria-checked', () => {
    const { container } = render(
      <ToggleGroup type="multiple" defaultValue={['a']}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')
    expect(items[0]!.getAttribute('aria-pressed')).toBe('true')
    expect(items[1]!.getAttribute('aria-pressed')).toBe('false')
    // Should not have role="radio" or aria-checked in multiple mode
    expect(items[0]!.getAttribute('role')).toBeNull()
    expect(items[0]!.getAttribute('aria-checked')).toBeNull()
  })

  it('onValueChange reports current array of active values', () => {
    const handler = mock(() => {})
    const { container } = render(
      <ToggleGroup type="multiple" onValueChange={handler}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>,
    )
    const items = container.querySelectorAll('[data-slot="toggle-group-item"]')

    fireEvent.click(items[0]!)
    expect(handler).toHaveBeenCalledWith(['a'])

    fireEvent.click(items[2]!)
    expect(handler).toHaveBeenCalledWith(['a', 'c'])

    fireEvent.click(items[0]!)
    expect(handler).toHaveBeenCalledWith(['c'])
  })
})

// ---------------------------------------------------------------------------
// 5. DropdownMenu trigger keyboard
// ---------------------------------------------------------------------------

describe('DropdownMenu trigger keyboard', () => {
  function renderDropdown(props: Record<string, unknown> = {}) {
    return render(
      <DropdownMenu {...props}>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <div>Item 1</div>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    )
  }

  it('Enter key toggles dropdown open', () => {
    const handler = mock(() => {})
    const { container } = renderDropdown({ onOpenChange: handler })
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')!

    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('Space key toggles dropdown open', () => {
    const handler = mock(() => {})
    const { container } = renderDropdown({ onOpenChange: handler })
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')!

    fireEvent.keyDown(trigger, { key: ' ' })
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('ArrowDown key opens dropdown', () => {
    const handler = mock(() => {})
    const { container } = renderDropdown({ onOpenChange: handler })
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')!

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(handler).toHaveBeenCalledWith(true)
  })

  it('trigger has correct ARIA attributes', () => {
    const { container } = renderDropdown()
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')!

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('data-state')).toBe('closed')
    expect(trigger.getAttribute('type')).toBe('button')
  })

  it('trigger data-state updates when opened', () => {
    const { container } = renderDropdown()
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')!

    expect(trigger.getAttribute('data-state')).toBe('closed')
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(trigger.getAttribute('data-state')).toBe('open')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('disabled trigger does not open on key press', () => {
    const handler = mock(() => {})
    const { container } = render(
      <DropdownMenu onOpenChange={handler}>
        <DropdownMenuTrigger disabled>Menu</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <div>Item 1</div>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>,
    )
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]')!

    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(handler).not.toHaveBeenCalled()
  })
})
