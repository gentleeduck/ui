import type * as React from 'react'
import type { IDirection } from '../direction'
import type { DismissableLayer } from '../dismissable-layer'
import type { FocusScope } from '../focus-scope'
import type { Scope } from '../libs/create-context'
import type * as PopperPrimitive from '../popper'
import type { Portal as PortalPrimitive } from '../portal'
import type { Primitive } from '../primitive-elements'
import type * as RovingFocusGroup from '../roving-focus'
import type { CheckedState } from './menu.libs'

export namespace IMenu {
  export type IScoped<TProps> = TProps & { __scopeMenu?: Scope }

  export type MenuContentElement = React.ComponentRef<typeof PopperPrimitive.Content>
  export type MenuItemElement = React.ComponentRef<typeof Primitive.div>
  export type MenuSubTriggerElement = React.ComponentRef<typeof Primitive.div>

  export interface IItemData {
    disabled: boolean
    textValue: string
  }

  export interface IContext {
    open: boolean
    onOpenChange(open: boolean): void
    content: MenuContentElement | null
    onContentChange(content: MenuContentElement | null): void
  }

  export interface IRootContext {
    onClose(): void
    isUsingKeyboardRef: React.RefObject<boolean>
    dir: IDirection.Kind
    modal: boolean
  }

  export interface IPortalContext {
    forceMount?: true | undefined
  }

  export interface ISubContext {
    contentId: string
    triggerId: string
    trigger: MenuSubTriggerElement | null
    onTriggerChange(trigger: MenuSubTriggerElement | null): void
  }

  export interface IProps {
    children?: React.ReactNode
    open?: boolean
    onOpenChange?(open: boolean): void
    dir?: IDirection.Kind
    modal?: boolean
  }

  export interface ISubProps {
    children?: React.ReactNode
    open?: boolean
    onOpenChange?(open: boolean): void
  }

  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
  type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>
  type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Anchor>
  type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>
  type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>
  type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>
  type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
  type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>
  type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>

  export interface IAnchorProps extends PopperAnchorProps {}
  export interface IArrowProps extends PopperArrowProps {}
  export interface IGroupProps extends PrimitiveDivProps {}
  export interface ILabelProps extends PrimitiveDivProps {}
  export interface ISeparatorProps extends PrimitiveDivProps {}

  export interface IPortalProps {
    children?: React.ReactNode | undefined
    container?: PortalProps['container'] | undefined
    forceMount?: true | undefined
  }

  export interface IItemImplProps extends PrimitiveDivProps {
    disabled?: boolean
    textValue?: string
  }

  export interface IItemProps extends Omit<IItemImplProps, 'onSelect'> {
    onSelect?: (event: Event) => void
  }

  export interface ICheckboxItemProps extends IItemProps {
    checked?: CheckedState
    onCheckedChange?: (checked: boolean) => void
  }

  export interface ICheckboxContext {
    checked: CheckedState
  }

  export interface IItemIndicatorProps extends PrimitiveSpanProps {
    forceMount?: true
  }

  export interface IRadioGroupProps extends IGroupProps {
    value?: string | undefined
    onValueChange?: ((value: string) => void) | undefined
  }

  export interface IRadioItemProps extends IItemProps {
    value: string
  }

  export interface IContentImplPrivateProps {
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']
    onDismiss?: DismissableLayerProps['onDismiss']
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents']
    disableOutsideScroll?: boolean
    trapFocus?: FocusScopeProps['trapped']
  }

  export interface IContentImplProps extends IContentImplPrivateProps, Omit<PopperContentProps, 'dir' | 'onPlaced'> {
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']
    loop?: RovingFocusGroupProps['loop']
    onEntryFocus?: RovingFocusGroupProps['onEntryFocus']
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown']
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside']
    onFocusOutside?: DismissableLayerProps['onFocusOutside']
    onInteractOutside?: DismissableLayerProps['onInteractOutside']
  }

  export interface IRootContentTypeProps extends Omit<IContentImplProps, keyof IContentImplPrivateProps> {
    trapFocus?: FocusScopeProps['trapped']
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents']
    disableOutsideScroll?: boolean
  }

  export interface IContentProps extends IRootContentTypeProps {
    forceMount?: true
  }

  export interface ISubContentProps
    extends Omit<
      IContentImplProps,
      keyof IContentImplPrivateProps | 'onCloseAutoFocus' | 'onEntryFocus' | 'side' | 'align'
    > {
    forceMount?: true
  }

  export interface ISubTriggerProps extends IItemImplProps {}
}
