import * as React from 'react'
import { createContextScope, type Scope } from '../libs/create-context'
import type { IMeasurable } from '../libs/observe-element-rect'

export const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
export const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export type ScopedProps<P> = P & { __scopePopper?: Scope }

export type Boundary = Element | null
export type CollisionPadding = number | Partial<Record<Side, number>>

const POPPER_NAME = 'Popper'
export const [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME)

type PopperContextValue = {
  anchor: IMeasurable | null
  onAnchorChange(anchor: IMeasurable | null): void
}

export const [PopperProvider, usePopperContext] = createPopperContext<PopperContextValue>(POPPER_NAME)

export function Popper(
  props: ScopedProps<{
    children?: React.ReactNode
  }>,
) {
  const { __scopePopper, children } = props
  const [anchor, setAnchor] = React.useState<IMeasurable | null>(null)

  return (
    <PopperProvider scope={__scopePopper} anchor={anchor} onAnchorChange={setAnchor}>
      {children}
    </PopperProvider>
  )
}

Popper.displayName = POPPER_NAME
