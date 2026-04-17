import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'

export namespace IAccordion {
  export type IScoped<TProps> = TProps & { __scopeAccordion?: Scope }

  export interface IContext {
    type: 'single' | 'multiple'
    openItems: string[]
    onItemOpenChange(value: string): void
    collapsible: boolean
    dir: IDirection.Kind
  }

  export interface IImpl extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
    dir?: IDirection.Kind
  }

  export interface ISingle extends IImpl {
    type?: 'single'
    value?: string
    defaultValue?: string
    onValueChange?(value: string): void
    collapsible?: boolean
  }

  export interface IMultiple extends IImpl {
    type: 'multiple'
    value?: string[]
    defaultValue?: string[]
    onValueChange?(value: string[]): void
    collapsible?: never
  }

  export interface IImplPrivate extends IImpl {
    type: 'single' | 'multiple'
    openItems: string[]
    onItemOpenChange(value: string): void
    collapsible: boolean
  }

  export type IProps = ISingle | IMultiple

  export interface IItemProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
    value?: string
    disabled?: boolean
  }

  export interface IItemContext {
    value: string
    open: boolean
    disabled: boolean
    triggerId: string
    contentId: string
  }

  export interface IContentProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
    forceMount?: boolean
  }

  export interface ITriggerProps extends React.ComponentPropsWithoutRef<typeof Primitive.button> {}
}
