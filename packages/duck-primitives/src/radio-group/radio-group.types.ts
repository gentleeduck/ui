import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'
import type * as RovingFocusGroup from '../roving-focus'

export namespace IRadioGroup {
  export type IScoped<TProps> = TProps & { __scopeRadioGroup?: Scope }

  export interface INavigationItem {
    node: HTMLElement
    value: string
    textValue: string
  }

  export interface IContext {
    value: string
    onValueChange(value: string): void
    disabled: boolean
    required: boolean
    name?: string | undefined
    dir: IDirection.Kind
    isNavigationKeyPressedRef: React.RefObject<boolean>
  }

  export interface IItemContext {
    checked: boolean
    disabled: boolean
  }

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
  type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
  type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>
  type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>

  export interface IProps extends PrimitiveDivProps {
    value?: string
    defaultValue?: string
    onValueChange?(value: string): void
    disabled?: boolean
    required?: boolean
    name?: string
    dir?: IDirection.Kind
    orientation?: RovingFocusGroupProps['orientation']
    loop?: RovingFocusGroupProps['loop']
  }

  export interface IItemProps extends PrimitiveButtonProps {
    value: string
    textValue?: string
  }

  export interface IIndicatorProps extends PrimitiveSpanProps {
    forceMount?: true
  }

  export interface IBubbleInputProps {
    name: string
    value: string
    checked: boolean
    disabled: boolean
  }
}
