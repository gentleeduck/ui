import * as React from 'react'
import { useDirection } from '../direction'
import { useControllableState } from '../hooks/use-controllable-state'
import { clamp } from '../libs/clamp'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { useComposedRefs } from '../libs/compose-ref'
import { createCollection } from '../libs/create-collection'
import { createContextScope } from '../libs/create-context'
import { Primitive } from '../primitive-elements'
import {
  getClosestValueIndex,
  getDecimalCount,
  getNextSortedValues,
  hasMinStepsBetweenValues,
  linearScale,
  roundValue,
} from './slider.libs'
import type { ISlider } from './slider.types'

const PAGE_KEYS = ['PageUp', 'PageDown']
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

const BACK_KEYS: Record<ISlider.SlideDirection, string[]> = {
  'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
  'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
}

const SLIDER_NAME = 'Slider'

const [Collection, useCollection, createCollectionScope] = createCollection<ISlider.IThumbElement>(SLIDER_NAME)

const [createSliderContext, createSliderScope] = createContextScope(SLIDER_NAME, [createCollectionScope])

const [SliderProvider, useSliderContext] = createSliderContext<ISlider.IContext>(SLIDER_NAME)

type SliderElement = SliderHorizontalElement | SliderVerticalElement

const Slider = React.forwardRef<SliderElement, ISlider.IProps>(
  (props: ISlider.IScoped<ISlider.IProps>, forwardedRef) => {
  const {
    name,
    min = 0,
    max = 100,
    step = 1,
    orientation = 'horizontal',
    disabled = false,
    minStepsBetweenThumbs = 0,
    defaultValue = [min],
    value,
    onValueChange = () => {},
    onValueCommit = () => {},
    inverted = false,
    dir,
    form,
    ...sliderProps
  } = props
  const direction = useDirection(dir)
  const thumbRefs = React.useRef<ISlider.IContext['thumbs']>(new Set())
  const valueIndexToChangeRef = React.useRef<number>(0)
  const isHorizontal = orientation === 'horizontal'
  const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical

  const [values = [], setValues] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: (value) => {
      const thumbs = Array.from(thumbRefs.current)
      thumbs[valueIndexToChangeRef.current]?.focus()
      onValueChange(value)
    },
    caller: SLIDER_NAME,
  })
  const valuesBeforeSlideStartRef = React.useRef(values)

  function handleSlideStart(value: number) {
    const closestIndex = getClosestValueIndex(values, value)
    updateValues(value, closestIndex)
  }

  function handleSlideMove(value: number) {
    updateValues(value, valueIndexToChangeRef.current)
  }

  function handleSlideEnd() {
    const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current]
    const nextValue = values[valueIndexToChangeRef.current]
    const hasChanged = nextValue !== prevValue
    if (hasChanged) onValueCommit(values)
  }

  function updateValues(value: number, atIndex: number, { commit } = { commit: false }) {
    const decimalCount = getDecimalCount(step)
    const snapToStep = roundValue(Math.round((value - min) / step) * step + min, decimalCount)
    const nextValue = clamp(snapToStep, [min, max])

    setValues((prevValues = []) => {
      const nextValues = getNextSortedValues(prevValues, nextValue, atIndex)
      if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
        valueIndexToChangeRef.current = nextValues.indexOf(nextValue)
        const hasChanged = String(nextValues) !== String(prevValues)
        if (hasChanged && commit) onValueCommit(nextValues)
        return hasChanged ? nextValues : prevValues
      } else {
        return prevValues
      }
    })
  }

  return (
    <SliderProvider
      scope={props.__scopeSlider}
      name={name}
      disabled={disabled}
      min={min}
      max={max}
      valueIndexToChangeRef={valueIndexToChangeRef}
      thumbs={thumbRefs.current}
      values={values}
      orientation={orientation}
      dir={direction}
      form={form}>
      <Collection.Provider scope={props.__scopeSlider}>
        <Collection.Slot scope={props.__scopeSlider}>
          <SliderOrientation
            aria-disabled={disabled}
            data-disabled={disabled ? '' : undefined}
            {...sliderProps}
            dir={direction}
            ref={forwardedRef}
            onPointerDown={composeEventHandlers(sliderProps.onPointerDown, () => {
              if (!disabled) valuesBeforeSlideStartRef.current = values
            })}
            min={min}
            max={max}
            inverted={inverted}
            onSlideStart={disabled ? undefined : handleSlideStart}
            onSlideMove={disabled ? undefined : handleSlideMove}
            onSlideEnd={disabled ? undefined : handleSlideEnd}
            onHomeKeyDown={() => !disabled && updateValues(min, 0, { commit: true })}
            onEndKeyDown={() => !disabled && updateValues(max, values.length - 1, { commit: true })}
            onStepKeyDown={({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key)
                const isSkipKey = isPageKey || (event.shiftKey && ARROW_KEYS.includes(event.key))
                const multiplier = isSkipKey ? 10 : 1
                const atIndex = valueIndexToChangeRef.current
                const value = values[atIndex]
                if (value === undefined) return
                const stepInDirection = step * multiplier * stepDirection
                updateValues(value + stepInDirection, atIndex, { commit: true })
              }
            }}
          />
        </Collection.Slot>
      </Collection.Provider>
    </SliderProvider>
  )
})

Slider.displayName = SLIDER_NAME

const [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext<ISlider.IOrientationContext>(
  SLIDER_NAME,
  {
    startEdge: 'left',
    endEdge: 'right',
    size: 'width',
    direction: 1,
  },
)

type SliderHorizontalElement = SliderImplElement

const SliderHorizontal = React.forwardRef<SliderHorizontalElement, ISlider.IHorizontalProps>(
  (props: ISlider.IScoped<ISlider.IHorizontalProps>, forwardedRef) => {
    const { min, max, dir, inverted, onSlideStart, onSlideMove, onSlideEnd, onStepKeyDown, ...sliderProps } = props
    const [slider, setSlider] = React.useState<SliderImplElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node))
    const rectRef = React.useRef<DOMRect>(undefined)
    const direction = useDirection(dir)
    const isDirectionLTR = direction === 'ltr'
    const isSlidingFromLeft = (isDirectionLTR && !inverted) || (!isDirectionLTR && inverted)

    function getValueFromPointer(pointerPosition: number) {
      const rect = rectRef.current || slider?.getBoundingClientRect()
      if (!rect) return min
      const input: [number, number] = [0, rect.width]
      const output: [number, number] = isSlidingFromLeft ? [min, max] : [max, min]
      const value = linearScale(input, output)

      rectRef.current = rect
      return value(pointerPosition - rect.left)
    }

    return (
      <SliderOrientationProvider
        scope={props.__scopeSlider}
        startEdge={isSlidingFromLeft ? 'left' : 'right'}
        endEdge={isSlidingFromLeft ? 'right' : 'left'}
        direction={isSlidingFromLeft ? 1 : -1}
        size="width">
        <SliderImpl
          dir={direction}
          data-orientation="horizontal"
          {...sliderProps}
          ref={composedRefs}
          style={{
            ...sliderProps.style,
            ['--gentleduck-slider-thumb-transform' as string]: 'translateX(-50%)',
          }}
          onSlideStart={(event) => {
            const value = getValueFromPointer(event.clientX)
            onSlideStart?.(value)
          }}
          onSlideMove={(event) => {
            const value = getValueFromPointer(event.clientX)
            onSlideMove?.(value)
          }}
          onSlideEnd={() => {
            rectRef.current = undefined
            onSlideEnd?.()
          }}
          onStepKeyDown={(event) => {
            const slideDirection = isSlidingFromLeft ? 'from-left' : 'from-right'
            const isBackKey = BACK_KEYS[slideDirection].includes(event.key)
            onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 })
          }}
        />
      </SliderOrientationProvider>
    )
  },
)

SliderHorizontal.displayName = 'SliderHorizontal'

type SliderVerticalElement = SliderImplElement
const SliderVertical = React.forwardRef<SliderVerticalElement, ISlider.IVerticalProps>(
  (props: ISlider.IScoped<ISlider.IVerticalProps>, forwardedRef) => {
    const { min, max, inverted, onSlideStart, onSlideMove, onSlideEnd, onStepKeyDown, ...sliderProps } = props
    const sliderRef = React.useRef<SliderImplElement>(null)
    const ref = useComposedRefs(forwardedRef, sliderRef)
    const rectRef = React.useRef<DOMRect>(undefined)
    const isSlidingFromBottom = !inverted

    function getValueFromPointer(pointerPosition: number) {
      const rect = rectRef.current || sliderRef.current?.getBoundingClientRect()
      if (!rect) return min
      const input: [number, number] = [0, rect.height]
      const output: [number, number] = isSlidingFromBottom ? [max, min] : [min, max]
      const value = linearScale(input, output)

      rectRef.current = rect
      return value(pointerPosition - rect.top)
    }

    return (
      <SliderOrientationProvider
        scope={props.__scopeSlider}
        startEdge={isSlidingFromBottom ? 'bottom' : 'top'}
        endEdge={isSlidingFromBottom ? 'top' : 'bottom'}
        size="height"
        direction={isSlidingFromBottom ? 1 : -1}>
        <SliderImpl
          data-orientation="vertical"
          {...sliderProps}
          ref={ref}
          style={{
            ...sliderProps.style,
            ['--gentleduck-slider-thumb-transform' as string]: 'translateY(50%)',
          }}
          onSlideStart={(event) => {
            const value = getValueFromPointer(event.clientY)
            onSlideStart?.(value)
          }}
          onSlideMove={(event) => {
            const value = getValueFromPointer(event.clientY)
            onSlideMove?.(value)
          }}
          onSlideEnd={() => {
            rectRef.current = undefined
            onSlideEnd?.()
          }}
          onStepKeyDown={(event) => {
            const slideDirection = isSlidingFromBottom ? 'from-bottom' : 'from-top'
            const isBackKey = BACK_KEYS[slideDirection].includes(event.key)
            onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 })
          }}
        />
      </SliderOrientationProvider>
    )
  },
)

SliderVertical.displayName = 'SliderVertical'

type SliderImplElement = React.ComponentRef<typeof Primitive.span>

const SliderImpl = React.forwardRef<SliderImplElement, ISlider.IImplProps>(
  (props: ISlider.IScoped<ISlider.IImplProps>, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props
    const context = useSliderContext(SLIDER_NAME, __scopeSlider)

    return (
      <Primitive.span
        data-slot="slider"
        {...sliderProps}
        ref={forwardedRef}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === 'Home') {
            onHomeKeyDown(event)
            event.preventDefault()
          } else if (event.key === 'End') {
            onEndKeyDown(event)
            event.preventDefault()
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            onStepKeyDown(event)
            event.preventDefault()
          }
        })}
        onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target as HTMLElement
          target.setPointerCapture(event.pointerId)
          event.preventDefault()
          if (context.thumbs.has(target)) {
            target.focus()
          } else {
            onSlideStart(event)
          }
        })}
        onPointerMove={composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target as HTMLElement
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event)
        })}
        onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target as HTMLElement
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId)
            onSlideEnd(event)
          }
        })}
      />
    )
  },
)

SliderImpl.displayName = 'SliderImpl'

export { Collection, createSliderScope, Slider, useCollection, useSliderContext, useSliderOrientationContext }
