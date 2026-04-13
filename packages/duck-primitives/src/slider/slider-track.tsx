import * as React from 'react'
import { Primitive } from '../primitive-elements'
import type { PrimitiveSpanProps, ScopedProps } from './slider'
import { useSliderContext } from './slider'

const TRACK_NAME = 'SliderTrack'

type SliderTrackElement = React.ComponentRef<typeof Primitive.span>
interface ISliderTrackProps extends PrimitiveSpanProps {}

const SliderTrack = React.forwardRef<SliderTrackElement, ISliderTrackProps>(
  (props: ScopedProps<ISliderTrackProps>, forwardedRef) => {
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

export type { ISliderTrackProps }
export { SliderTrack }
