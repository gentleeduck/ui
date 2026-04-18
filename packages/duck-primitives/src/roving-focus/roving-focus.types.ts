import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'

export namespace IRovingFocus {
  export type IScoped<TProps> = TProps & { __scopeRovingFocusGroup?: Scope }

  export type Orientation = React.AriaAttributes['aria-orientation']
  export type FocusIntent = 'first' | 'last' | 'prev' | 'next'

  export interface IOptions {
    orientation?: Orientation
    dir?: IDirection.Kind
    loop?: boolean
  }

  export interface IContext extends IOptions {
    currentTabStopId: string | null
    onItemFocus(tabStopId: string): void
    onItemShiftTab(): void
    onFocusableItemAdd(): void
    onFocusableItemRemove(): void
  }

  export interface IItemData {
    id: string
    focusable: boolean
    active: boolean
  }

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
  type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>

  export interface IGroupImplProps extends Omit<PrimitiveDivProps, 'dir'>, IOptions {
    currentTabStopId?: string | null
    defaultCurrentTabStopId?: string
    onCurrentTabStopIdChange?: (tabStopId: string | null) => void
    onEntryFocus?: (event: Event) => void
    preventScrollOnEntryFocus?: boolean
  }

  export interface IGroupProps extends IGroupImplProps {}

  export interface IItemProps extends PrimitiveSpanProps {
    tabStopId?: string
    focusable?: boolean
    active?: boolean
  }
}
