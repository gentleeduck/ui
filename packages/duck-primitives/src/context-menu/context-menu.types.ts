import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type * as MenuPrimitive from '../menu'
import type { Primitive } from '../primitive-elements'

export namespace IContextMenu {
  export type IScoped<TProps> = TProps & { __scopeContextMenu?: Scope }

  export interface IContext {
    open: boolean
    onOpenChange(open: boolean): void
    dir: IDirection.Kind
    modal: boolean
  }

  type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>
  type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>
  type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>
  type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
  type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
  type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
  type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>
  type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>
  type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
  type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
  type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>
  type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>
  type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>
  type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>

  export interface IProps {
    children?: React.ReactNode
    onOpenChange?(open: boolean): void
    dir?: IDirection.Kind
    modal?: boolean
  }

  export interface ITriggerProps extends PrimitiveSpanProps {
    disabled?: boolean
  }

  export interface IContentProps extends Omit<MenuContentProps, 'onEntryFocus' | 'side' | 'sideOffset' | 'align'> {}
  export interface IItemIndicatorProps extends MenuItemIndicatorProps {}
  export interface IItemProps extends MenuItemProps {}
  export interface ICheckboxItemProps extends MenuCheckboxItemProps {}
  export interface IGroupProps extends MenuGroupProps {}
  export interface IPortalProps extends MenuPortalProps {}
  export interface IRadioGroupProps extends MenuRadioGroupProps {}
  export interface IRadioItemProps extends MenuRadioItemProps {}
  export interface ISeparatorProps extends MenuSeparatorProps {}
  export interface ISubContentProps extends MenuSubContentProps {}
  export interface ISubTriggerProps extends MenuSubTriggerProps {}
  export interface IArrowProps extends MenuArrowProps {}
  export interface ILabelProps extends MenuLabelProps {}

  export interface ISubProps {
    children?: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?(open: boolean): void
  }
}
