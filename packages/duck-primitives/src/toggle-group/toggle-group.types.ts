import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'
import type * as RovingFocusGroup from '../roving-focus'

export namespace IToggleGroup {
  export type IScoped<TProps> = TProps & { __scopeToggleGroup?: Scope }

  export interface IContext {
    type: 'single' | 'multiple'
    value: string[]
    onItemActivate(value: string): void
    onItemDeactivate(value: string): void
    rovingFocus: boolean
    disabled: boolean
    dir: IDirection.Kind
  }

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
  type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
  type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>

  export interface IImpl extends PrimitiveDivProps {
    type: 'single' | 'multiple'
    rovingFocus?: boolean
    disabled?: boolean
    orientation?: RovingFocusGroupProps['orientation']
    dir?: RovingFocusGroupProps['dir']
    loop?: RovingFocusGroupProps['loop']
  }

  export interface ISingle extends IImpl {
    type: 'single'
    value?: string
    defaultValue?: string
    onValueChange?(value: string): void
  }

  export interface IMultiple extends IImpl {
    type: 'multiple'
    value?: string[]
    defaultValue?: string[]
    onValueChange?(value: string[]): void
  }

  export interface IImplPrivate extends IImpl {
    value: string[]
    onItemActivate(value: string): void
    onItemDeactivate(value: string): void
  }

  export type IProps = ISingle | IMultiple

  export interface IItemProps extends PrimitiveButtonProps {
    value: string
  }
}
