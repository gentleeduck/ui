import type * as React from 'react'
import type { Arrow } from '../arrow'
import type { Scope } from '../libs/create-context'
import type { IMeasurable } from '../libs/observe-element-rect'
import type { Primitive } from '../primitive-elements'

declare module '@floating-ui/react-dom' {
  interface MiddlewareData {
    transformOrigin?: { x: string; y: string }
  }
}

export namespace IPopper {
  export type IScoped<TProps> = TProps & { __scopePopper?: Scope }

  export type Side = 'top' | 'right' | 'bottom' | 'left'
  export type Align = 'start' | 'center' | 'end'
  export type Boundary = Element | null
  export type CollisionPadding = number | Partial<Record<Side, number>>

  export interface IContext {
    anchor: IMeasurable | null
    onAnchorChange(anchor: IMeasurable | null): void
  }

  export interface IContentContext {
    placedSide: Side
    onArrowChange(arrow: HTMLSpanElement | null): void
    arrowX?: number | undefined
    arrowY?: number | undefined
    shouldHideArrow: boolean
  }

  export interface IProps {
    children?: React.ReactNode
  }

  type PrimitiveDivProps = React.ComponentPropsWithRef<typeof Primitive.div>

  export interface IAnchorProps extends PrimitiveDivProps {
    virtualRef?: React.RefObject<IMeasurable>
  }

  export interface IArrowProps extends React.ComponentPropsWithRef<typeof Arrow> {}

  export interface IContentProps extends PrimitiveDivProps {
    side?: Side | undefined
    sideOffset?: number | undefined
    align?: Align | undefined
    alignOffset?: number | undefined
    arrowPadding?: number | undefined
    avoidCollisions?: boolean | undefined
    collisionBoundary?: Boundary | Boundary[] | undefined
    collisionPadding?: CollisionPadding | undefined
    sticky?: 'partial' | 'always' | undefined
    hideWhenDetached?: boolean | undefined
    updatePositionStrategy?: 'optimized' | 'always' | undefined
    onPlaced?: (() => void) | undefined
  }
}
