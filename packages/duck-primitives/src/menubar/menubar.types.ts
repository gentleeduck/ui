import type * as React from 'react'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type * as MenuPrimitive from '../menu'
import type { Primitive } from '../primitive-elements'
import type * as RovingFocusGroup from '../roving-focus'

export namespace IMenubar {
  export type IScoped<TProps> = TProps & { __scopeMenubar?: Scope }

  export type TriggerElement = React.ComponentRef<typeof Primitive.button>

  export interface IItemData {
    value: string
    disabled: boolean
  }

  export interface IContext {
    value: string
    dir: IDirection.Kind
    loop: boolean
    onMenuOpen(value: string): void
    onMenuClose(): void
    onMenuToggle(value: string): void
  }

  export interface IMenuContext {
    value: string
    triggerId: string
    triggerRef: React.RefObject<TriggerElement | null>
    contentId: string
    wasKeyboardTriggerOpenRef: React.RefObject<boolean>
  }

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
  type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
  type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>
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

  export interface IProps extends PrimitiveDivProps {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    loop?: RovingFocusGroupProps['loop']
    dir?: RovingFocusGroupProps['dir']
  }

  export interface IMenuProps {
    children?: React.ReactNode
    value?: string
    onOpenChange?: (open: boolean) => void
  }

  export interface ITriggerProps extends PrimitiveButtonProps {}
  export interface IContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {}
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
