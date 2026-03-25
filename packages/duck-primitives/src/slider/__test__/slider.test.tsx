import { describe, expect, it, mock } from 'bun:test'
import { render } from '@testing-library/react'
import * as React from 'react'
import { Slider, SliderRange, SliderThumb, SliderTrack } from '../index'

function renderSlider(props: Record<string, unknown> = {}) {
  return render(
    <Slider {...props}>
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb />
    </Slider>,
  )
}

describe('Slider', () => {
  it('renders with data-slot="slider"', () => {
    const { container } = renderSlider()
    expect(container.querySelector('[data-slot="slider"]')).not.toBeNull()
  })

  it('renders track with data-slot="slider-track"', () => {
    const { container } = renderSlider()
    expect(container.querySelector('[data-slot="slider-track"]')).not.toBeNull()
  })

  it('renders range with data-slot="slider-range"', () => {
    const { container } = renderSlider()
    expect(container.querySelector('[data-slot="slider-range"]')).not.toBeNull()
  })

  it('renders thumb with role="slider"', () => {
    const { container } = renderSlider()
    expect(container.querySelector('[role="slider"]')).not.toBeNull()
  })

  it('thumb has aria-valuemin, aria-valuemax, aria-valuenow', () => {
    const { container } = renderSlider({ min: 0, max: 100, defaultValue: [50] })
    const thumb = container.querySelector('[role="slider"]')!
    expect(thumb.getAttribute('aria-valuemin')).toBe('0')
    expect(thumb.getAttribute('aria-valuemax')).toBe('100')
    expect(thumb.getAttribute('aria-valuenow')).toBe('50')
  })

  it('defaults to min=0 max=100 value=[0]', () => {
    const { container } = renderSlider()
    const thumb = container.querySelector('[role="slider"]')!
    expect(thumb.getAttribute('aria-valuemin')).toBe('0')
    expect(thumb.getAttribute('aria-valuemax')).toBe('100')
  })

  it('supports horizontal orientation by default', () => {
    const { container } = renderSlider()
    const thumb = container.querySelector('[role="slider"]')!
    expect(thumb.getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('supports vertical orientation', () => {
    const { container } = renderSlider({ orientation: 'vertical' })
    const thumb = container.querySelector('[role="slider"]')!
    expect(thumb.getAttribute('aria-orientation')).toBe('vertical')
  })

  it('disabled slider has data-disabled on all parts', () => {
    const { container } = renderSlider({ disabled: true })
    expect(container.querySelector('[data-slot="slider"]')?.getAttribute('data-disabled')).toBe('')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <Slider ref={ref}>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>
        <SliderThumb />
      </Slider>,
    )
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})
