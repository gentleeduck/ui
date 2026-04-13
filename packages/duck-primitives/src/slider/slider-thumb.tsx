import * as React from 'react'
import { useSize } from '../hooks/use-size'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import type { PrimitiveSpanProps, ScopedProps, SliderThumbElement } from './slider'
import { Collection, useCollection, useSliderContext, useSliderOrientationContext } from './slider'
import { convertValueToPercentage, getLabel, getThumbInBoundsOffset } from './slider.libs'
import { BubbleInput } from './slider-input'

const THUMB_NAME = 'SliderThumb'

interface ISliderThumbProps extends Omit<ISliderThumbImplProps, 'index'> {}

const SliderThumb = React.forwardRef<SliderThumbElement, ISliderThumbProps>(
  (props: ScopedProps<ISliderThumbProps>, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider)
    const [thumb, setThumb] = React.useState<SliderThumbImplElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node))
    const index = React.useMemo(
      () => (thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1),
      [getItems, thumb],
    )
    return <SliderThumbImpl {...props} ref={composedRefs} index={index} />
  },
)

type SliderThumbImplElement = React.ComponentRef<typeof Primitive.span>
interface ISliderThumbImplProps extends PrimitiveSpanProps {
  index: number
  name?: string
}

const SliderThumbImpl = React.forwardRef<SliderThumbImplElement, ISliderThumbImplProps>(
  (props: ScopedProps<ISliderThumbImplProps>, forwardedRef) => {
    const { __scopeSlider, index, name, ...thumbProps } = props
    const context = useSliderContext(THUMB_NAME, __scopeSlider)
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider)
    const [thumb, setThumb] = React.useState<HTMLSpanElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node))
    const isFormControl = thumb ? context.form || !!thumb.closest('form') : true
    const size = useSize(thumb)
    const value = context.values[index] as number | undefined
    const percent = value === undefined ? 0 : convertValueToPercentage(value, context.min, context.max)
    const label = getLabel(index, context.values.length)
    const orientationSize = size?.[orientation.size]
    const thumbInBoundsOffset = orientationSize
      ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction)
      : 0

    React.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb)
        return () => {
          context.thumbs.delete(thumb)
        }
      }
    }, [thumb, context.thumbs])

    return (
      <span
        dir={context.dir}
        style={{
          transform: 'var(--gentleduck-slider-thumb-transform)',
          position: 'absolute',
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`,
        }}>
        <Collection.ItemSlot scope={props.__scopeSlider}>
          <Primitive.span
            data-slot="slider-thumb"
            dir={context.dir}
            role="slider"
            aria-label={props['aria-label'] || label}
            aria-valuemin={context.min}
            aria-valuenow={value}
            aria-valuemax={context.max}
            aria-orientation={context.orientation}
            data-orientation={context.orientation}
            data-disabled={context.disabled ? '' : undefined}
            tabIndex={context.disabled ? undefined : 0}
            {...thumbProps}
            ref={composedRefs}
            style={value === undefined ? { display: 'none' } : props.style}
            onFocus={composeEventHandlers(props.onFocus, () => {
              context.valueIndexToChangeRef.current = index
            })}
          />
        </Collection.ItemSlot>

        {isFormControl && (
          <BubbleInput
            key={index}
            name={name ?? (context.name ? context.name + (context.values.length > 1 ? '[]' : '') : undefined)}
            form={context.form}
            value={value}
          />
        )}
      </span>
    )
  },
)

SliderThumbImpl.displayName = 'SliderThumbImpl'

SliderThumb.displayName = THUMB_NAME

export type { ISliderThumbProps }
export { SliderThumb }
