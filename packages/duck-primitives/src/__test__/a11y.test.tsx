import { beforeEach, describe, expect, it } from 'bun:test'
import { fireEvent, render } from '@testing-library/react'
import axe from 'axe-core'
import * as React from 'react'

import { Toggle } from '../toggle'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '../radio-group'
import { Progress, ProgressIndicator } from '../progress'
import { Slider, SliderRange, SliderThumb, SliderTrack } from '../slider'
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
import { Pagination, PaginationContent, PaginationItem } from '../pagination'

// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------
describe('Toggle a11y - axe automated checks', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('unpressed toggle has no axe violations', async () => {
    const { container } = render(<Toggle aria-label="Bold">B</Toggle>)
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('pressed toggle has no axe violations', async () => {
    const { container } = render(
      <Toggle aria-label="Bold" defaultPressed>
        B
      </Toggle>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('disabled toggle has no axe violations', async () => {
    const { container } = render(
      <Toggle aria-label="Bold" disabled>
        B
      </Toggle>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------
describe('RadioGroup a11y - axe automated checks', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  function ThreeItemRadioGroup(props: { defaultValue?: string; disabled?: boolean }) {
    return (
      <RadioGroup aria-label="Favorite color" defaultValue={props.defaultValue} disabled={props.disabled}>
        <RadioGroupItem value="red" aria-label="Red">
          <RadioGroupIndicator />
        </RadioGroupItem>
        <RadioGroupItem value="green" aria-label="Green">
          <RadioGroupIndicator />
        </RadioGroupItem>
        <RadioGroupItem value="blue" aria-label="Blue">
          <RadioGroupIndicator />
        </RadioGroupItem>
      </RadioGroup>
    )
  }

  it('radio group with no selection has no axe violations', async () => {
    const { container } = render(<ThreeItemRadioGroup />)
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('radio group with selection has no axe violations', async () => {
    const { container } = render(<ThreeItemRadioGroup defaultValue="green" />)
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('disabled radio group has no axe violations', async () => {
    const { container } = render(<ThreeItemRadioGroup disabled />)
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
describe('Progress a11y - axe automated checks', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('progress with value has no axe violations', async () => {
    const { container } = render(
      <Progress value={66} aria-label="Loading">
        <ProgressIndicator />
      </Progress>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('indeterminate progress has no axe violations', async () => {
    const { container } = render(
      <Progress value={null} aria-label="Loading">
        <ProgressIndicator />
      </Progress>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('completed progress has no axe violations', async () => {
    const { container } = render(
      <Progress value={100} aria-label="Upload complete">
        <ProgressIndicator />
      </Progress>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------
describe('Slider a11y - axe automated checks', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('single thumb slider has no axe violations', async () => {
    const { container } = render(
      <Slider defaultValue={[50]} aria-label="Volume">
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label="Volume" />
      </Slider>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('range slider with two thumbs has no axe violations', async () => {
    const { container } = render(
      <Slider defaultValue={[25, 75]} aria-label="Price range">
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label="Minimum price" />
        <SliderThumb aria-label="Maximum price" />
      </Slider>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('disabled slider has no axe violations', async () => {
    const { container } = render(
      <Slider defaultValue={[50]} disabled aria-label="Volume">
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb aria-label="Volume" />
      </Slider>,
    )
    // Disabled slider thumbs have no tabindex, so axe may flag nested-interactive
    // or missing focusable element. The component intentionally removes tabindex
    // when disabled; exclude that rule for this edge case in jsdom.
    const results = await axe.run(container, {
      rules: {
        'nested-interactive': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Dialog (open)
// ---------------------------------------------------------------------------
describe('Dialog a11y - axe automated checks', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('open dialog with title and description has no axe violations', async () => {
    const { baseElement } = render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here.</DialogDescription>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>,
    )
    // Dialog content is portalled to document.body, so scan baseElement
    // (which includes the portal target) rather than container.
    // Disable aria-hidden rule: the modal dialog uses aria-hidden on
    // siblings via `aria-hidden` package, which can confuse axe in jsdom
    // when the trigger itself gets hidden.
    const results = await axe.run(baseElement, {
      rules: {
        'aria-hidden-focus': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('closed dialog (trigger only) has no axe violations', async () => {
    const { container } = render(
      <Dialog>
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
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
describe('Pagination a11y - axe automated checks', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('pagination nav with items has no axe violations', async () => {
    const { container } = render(
      <Pagination aria-label="Page navigation">
        <PaginationContent>
          <PaginationItem>
            <button type="button">Previous</button>
          </PaginationItem>
          <PaginationItem>
            <button type="button" aria-current="page">
              1
            </button>
          </PaginationItem>
          <PaginationItem>
            <button type="button">2</button>
          </PaginationItem>
          <PaginationItem>
            <button type="button">3</button>
          </PaginationItem>
          <PaginationItem>
            <button type="button">Next</button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('empty pagination has no axe violations', async () => {
    const { container } = render(
      <Pagination aria-label="Page navigation">
        <PaginationContent />
      </Pagination>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })
})
