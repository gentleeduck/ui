import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'

export namespace ICommand {
  export type IScoped<TProps> = TProps & { __scopeCommand?: Scope }

  export interface IItemData {
    value: string
    disabled: boolean
    textValue: string
  }

  export interface IContext {
    search: string
    onSearchChange: (search: string) => void
    dir: IDirection.Kind
    listId: string
    inputRef: React.RefObject<HTMLInputElement | null>
    typeaheadSearchRef: React.RefObject<string>
    selectedItem: HTMLLIElement | null
    setSelectedItem: (item: HTMLLIElement | null) => void
    selectedValue: string | null
    selectedText: string | null
    shouldFilter: boolean
  }

  export interface IListContext {
    onItemLeave?: (() => void) | undefined
    listRef: React.RefObject<HTMLUListElement | null>
    emptyRef: React.RefObject<HTMLDivElement | null>
  }

  export interface IItemContext {
    value: string
    disabled: boolean
    textId: string
    onItemTextChange(node: HTMLElement | null): void
  }

  export interface IGroupContext {
    id: string
  }

  type PrimitiveDivProps = React.ComponentPropsWithRef<typeof Primitive.div>
  type PrimitiveInputProps = React.ComponentPropsWithRef<typeof Primitive.input>
  type PrimitiveUlProps = React.ComponentPropsWithRef<typeof Primitive.ul>
  type PrimitiveLiProps = React.ComponentPropsWithRef<typeof Primitive.li>

  export interface IProps extends PrimitiveDivProps {
    dir?: IDirection.Kind
    shouldFilter?: boolean
  }

  export interface IEmptyProps extends PrimitiveDivProps {}
  export interface IGroupProps extends PrimitiveDivProps {
    heading?: React.ReactNode
  }

  export interface IInputProps extends PrimitiveInputProps {}
  export interface IListProps extends PrimitiveUlProps {}
  export interface ISeparatorProps extends PrimitiveDivProps {}

  export interface IItemProps extends Omit<PrimitiveLiProps, 'onSelect'> {
    value?: string
    disabled?: boolean
    textValue?: string
    onSelect?: (value: string) => void
  }
}
