import type { Middleware, Placement } from '@floating-ui/react-dom'
import {
  autoUpdate,
  flip,
  arrow as floatingUIarrow,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom'
import * as React from 'react'
import { useCallbackRef } from '../hooks/use-callback-ref'
import { useLayoutEffect } from '../hooks/use-layout-effect'
import { useSize } from '../hooks/use-size'
import { useComposedRefs } from '../libs/compose-ref'
import { Primitive } from '../primitive-elements'
import {
  type Align,
  type Boundary,
  type CollisionPadding,
  createPopperContext,
  type ScopedProps,
  type Side,
  usePopperContext,
} from './popper'

const CONTENT_NAME = 'PopperContent'

type PopperContentContextValue = {
  placedSide: Side
  onArrowChange(arrow: HTMLSpanElement | null): void
  arrowX?: number
  arrowY?: number
  shouldHideArrow: boolean
}

export const [PopperContentProvider, useContentContext] = createPopperContext<PopperContentContextValue>(CONTENT_NAME)

type PrimitiveDivProps = React.ComponentPropsWithRef<typeof Primitive.div>

export interface IPopperContentProps extends PrimitiveDivProps {
  side?: Side
  sideOffset?: number
  align?: Align
  alignOffset?: number
  arrowPadding?: number
  avoidCollisions?: boolean
  collisionBoundary?: Boundary | Boundary[]
  collisionPadding?: CollisionPadding
  sticky?: 'partial' | 'always'
  hideWhenDetached?: boolean
  updatePositionStrategy?: 'optimized' | 'always'
  onPlaced?: () => void
}

export const PopperContent = ({ ref: forwardedRef, ...props }: ScopedProps<IPopperContentProps>) => {
  const {
    __scopePopper,
    side = 'bottom',
    sideOffset = 0,
    align = 'center',
    alignOffset = 0,
    arrowPadding = 0,
    avoidCollisions = true,
    collisionBoundary = [],
    collisionPadding: collisionPaddingProp = 0,
    sticky = 'partial',
    hideWhenDetached = false,
    updatePositionStrategy = 'optimized',
    onPlaced,
    ...contentProps
  } = props

  const context = usePopperContext(CONTENT_NAME, __scopePopper)

  const [content, setContent] = React.useState<HTMLDivElement | null>(null)
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node))

  const [arrow, setArrow] = React.useState<HTMLSpanElement | null>(null)
  const arrowSize = useSize(arrow)
  const arrowWidth = arrowSize?.width ?? 0
  const arrowHeight = arrowSize?.height ?? 0

  const desiredPlacement = (side + (align !== 'center' ? `-${align}` : '')) as Placement

  const collisionPadding =
    typeof collisionPaddingProp === 'number'
      ? collisionPaddingProp
      : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp }

  const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary]
  const hasExplicitBoundaries = boundary.length > 0

  const detectOverflowOptions = {
    padding: collisionPadding,
    boundary: boundary.filter(isNotNull),
    altBoundary: hasExplicitBoundaries,
  }

  const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
    strategy: 'fixed',
    placement: desiredPlacement,
    whileElementsMounted: (...args) =>
      autoUpdate(...args, {
        animationFrame: updatePositionStrategy === 'always',
      }),
    elements: { reference: context.anchor },
    middleware: [
      offset({
        mainAxis: sideOffset + arrowHeight,
        alignmentAxis: alignOffset,
      }),
      avoidCollisions &&
        shift({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === 'partial' ? limitShift() : undefined,
          ...detectOverflowOptions,
        }),
      avoidCollisions && flip({ ...detectOverflowOptions }),
      size({
        ...detectOverflowOptions,
        apply: ({ elements, rects, availableWidth, availableHeight }) => {
          const { width: anchorWidth, height: anchorHeight } = rects.reference
          const contentStyle = elements.floating.style

          contentStyle.setProperty('--gentleduck-popper-available-width', `${availableWidth}px`)
          contentStyle.setProperty('--gentleduck-popper-available-height', `${availableHeight}px`)
          contentStyle.setProperty('--gentleduck-popper-anchor-width', `${anchorWidth}px`)
          contentStyle.setProperty('--gentleduck-popper-anchor-height', `${anchorHeight}px`)
        },
      }),
      arrow && floatingUIarrow({ element: arrow, padding: arrowPadding }),
      transformOrigin({ arrowWidth, arrowHeight }),
      hideWhenDetached && hide({ strategy: 'referenceHidden', ...detectOverflowOptions }),
    ],
  })

  const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement)

  const handlePlaced = useCallbackRef(onPlaced)
  useLayoutEffect(() => {
    if (isPositioned) handlePlaced?.()
  }, [isPositioned, handlePlaced])

  const arrowX = middlewareData.arrow?.x
  const arrowY = middlewareData.arrow?.y
  const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0

  const [contentZIndex, setContentZIndex] = React.useState<string>()
  useLayoutEffect(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex)
  }, [content])

  return (
    <Primitive.div
      ref={refs.setFloating}
      data-slot="popper-content-wrapper"
      style={
        {
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : 'translate(0, -200%)',
          minWidth: 'max-content',
          zIndex: contentZIndex,
          '--gentleduck-popper-transform-origin': [
            middlewareData.transformOrigin?.x,
            middlewareData.transformOrigin?.y,
          ].join(' '),
          ...(middlewareData.hide?.referenceHidden && {
            visibility: 'hidden',
            pointerEvents: 'none',
          }),
        } as React.CSSProperties
      }
      // Floating UI computes logical alignment from `dir`. Ensure it exists on the wrapper too.
      dir={props.dir}>
      <PopperContentProvider
        scope={__scopePopper}
        placedSide={placedSide}
        onArrowChange={setArrow}
        arrowX={arrowX}
        arrowY={arrowY}
        shouldHideArrow={cannotCenterArrow}>
        <Primitive.div
          data-slot="popper-content"
          data-side={placedSide}
          data-align={placedAlign}
          {...contentProps}
          ref={composedRefs}
          style={{
            ...contentProps.style,
            animation: !isPositioned ? 'none' : undefined,
          }}
        />
      </PopperContentProvider>
    </Primitive.div>
  )
}

PopperContent.displayName = CONTENT_NAME

function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

const transformOrigin = (options: { arrowWidth: number; arrowHeight: number }): Middleware => ({
  name: 'transformOrigin',
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data

    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0
    const isArrowHidden = cannotCenterArrow

    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight

    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement)
    const noArrowAlign = { start: '0%', center: '50%', end: '100%' }[placedAlign]

    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2

    let x = ''
    let y = ''

    if (placedSide === 'bottom') {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`
      y = `${-arrowHeight}px`
    } else if (placedSide === 'top') {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`
      y = `${rects.floating.height + arrowHeight}px`
    } else if (placedSide === 'right') {
      x = `${-arrowHeight}px`
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`
    } else if (placedSide === 'left') {
      x = `${rects.floating.width + arrowHeight}px`
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`
    }

    return { data: { x, y } }
  },
})

export function getSideAndAlignFromPlacement(placement: Placement) {
  const [side, align = 'center'] = placement.split('-')
  return [side as Side, align as Align] as const
}
