import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { PrimitiveSpanProps, ScopedProps } from './slider'
import { useSliderContext } from './slider'

const TRACK_NAME = 'SliderTrack'

type SliderTrackElement = React.ComponentRef<typeof Primitive.span>
interface SliderTrackProps extends PrimitiveSpanProps {}

const SliderTrack = React.forwardRef<SliderTrackElement, SliderTrackProps>(
  (props: ScopedProps<SliderTrackProps>, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props
    const context = useSliderContext(TRACK_NAME, __scopeSlider)
    return (
      <Primitive.span
        data-slot="slider-track"
        data-disabled={context.disabled ? '' : undefined}
        data-orientation={context.orientation}
        dir={context.dir}
        {...trackProps}
        ref={forwardedRef}
      />
    )
  },
)

SliderTrack.displayName = TRACK_NAME

export type { SliderTrackProps }
export { SliderTrack }
