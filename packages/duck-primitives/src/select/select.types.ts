import type * as React from 'react'
import type { IDirection } from '../direction'
import type { DismissableLayer } from '../dismissable-layer'
import type { FocusScope } from '../focus-scope'
import type { Scope } from '../libs/create-context'
import type * as PopperPrimitive from '../popper'
import type { Portal as PortalPrimitive } from '../portal'
import type { Primitive } from '../primitive-elements'

export namespace ISelect {
  export type IScoped<TProps> = TProps & { __scopeSelect?: Scope }

  export type INativeOption = React.ReactElement<React.ComponentProps<'option'>>

  export interface IItemData {
    value: string
    disabled: boolean
    textValue: string
  }

  export interface IContext {
    trigger: HTMLButtonElement | null
    onTriggerChange(node: HTMLButtonElement | null): void
    valueNode: HTMLSpanElement | null
    onValueNodeChange(node: HTMLSpanElement | null): void
    valueNodeHasChildren: boolean
    onValueNodeHasChildrenChange(hasChildren: boolean): void
    contentId: string
    value: string | undefined
    onValueChange(value: string): void
    open: boolean
    required?: boolean | undefined
    onOpenChange(open: boolean): void
    dir: IDirection.Kind
    triggerPointerDownPosRef: React.RefObject<{ x: number; y: number } | null>
    disabled?: boolean | undefined
  }

  export interface INativeOptionsContext {
    onNativeOptionAdd(option: INativeOption): void
    onNativeOptionRemove(option: INativeOption): void
  }

  export interface IContentContext {
    content?: HTMLDivElement | null
    viewport?: HTMLDivElement | null
    onViewportChange?: (node: HTMLDivElement | null) => void
    itemRefCallback?: (node: HTMLDivElement | null, value: string, disabled: boolean) => void
    selectedItem?: HTMLDivElement | null
    onItemLeave?: () => void
    itemTextRefCallback?: (node: HTMLSpanElement | null, value: string, disabled: boolean) => void
    focusSelectedItem?: () => void
    selectedItemText?: HTMLSpanElement | null
    position?: 'item-aligned' | 'popper'
    isPositioned?: boolean
    searchRef?: React.RefObject<string>
    allowTextPortal?: boolean
  }

  export interface IViewportContext {
    contentWrapper?: HTMLDivElement | null
    shouldExpandOnScrollRef?: React.RefObject<boolean>
    onScrollButtonChange?: (node: HTMLDivElement | null) => void
  }

  export interface IItemContext {
    value: string
    disabled: boolean
    textId: string
    isSelected: boolean
    onItemTextChange(node: HTMLSpanElement | null): void
  }

  export interface IGroupContext {
    id: string
  }

  type PrimitiveDivProps = React.ComponentPropsWithRef<typeof Primitive.div>
  type PrimitiveButtonProps = React.ComponentPropsWithRef<typeof Primitive.button>
  type PrimitiveSpanProps = React.ComponentPropsWithRef<typeof Primitive.span>
  type PopperArrowProps = React.ComponentPropsWithRef<typeof PopperPrimitive.Arrow>
  type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>
  type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
  type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>
  type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>

  export interface ISharedProps {
    children?: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?(open: boolean): void
    dir?: IDirection.Kind
    name?: string
    autoComplete?: string
    disabled?: boolean
    required?: boolean
    form?: string
  }

  export type IProps = ISharedProps & {
    value?: string
    defaultValue?: string
    onValueChange?(value: string): void
  }

  export interface IArrowProps extends PopperArrowProps {}
  export interface IGroupProps extends PrimitiveDivProps {}
  export interface IIconProps extends PrimitiveSpanProps {}
  export interface IItemIndicatorProps extends PrimitiveSpanProps {}
  export interface IItemTextProps extends PrimitiveSpanProps {}
  export interface ILabelProps extends PrimitiveDivProps {}
  export interface ISeparatorProps extends PrimitiveDivProps {}
  export interface ITriggerProps extends PrimitiveButtonProps {}
  export interface IViewportProps extends PrimitiveDivProps {
    nonce?: string
  }

  export interface IValueProps extends Omit<PrimitiveSpanProps, 'placeholder'> {
    placeholder?: React.ReactNode
  }

  export interface IItemProps extends PrimitiveDivProps {
    value: string
    disabled?: boolean
    textValue?: string
  }

  export interface IPortalProps {
    children?: React.ReactNode | undefined
    container?: PortalProps['container'] | undefined
  }

  export interface IScrollUpButtonProps extends Omit<PrimitiveDivProps, 'onAutoScroll'> {}
  export interface IScrollDownButtonProps extends Omit<PrimitiveDivProps, 'onAutoScroll'> {}

  export interface IScrollButtonImplProps extends PrimitiveDivProps {
    onAutoScroll(): void
  }

  export interface IPopperPrivateProps {
    onPlaced?: PopperContentProps['onPlaced']
  }

  export interface IItemAlignedPositionProps extends PrimitiveDivProps {
    onPlaced?: () => void
  }

  export interface IPopperPositionProps extends PopperContentProps {
    onPlaced?: () => void
  }

  export interface IContentImplProps
    extends Omit<IPopperPositionProps, keyof IPopperPrivateProps>,
      Omit<IItemAlignedPositionProps, keyof IPopperPrivateProps> {
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown']
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside']
    onFocusOutside?: DismissableLayerProps['onFocusOutside']
    position?: 'item-aligned' | 'popper'
    disableOutsidePointerEvents?: boolean
    trapFocus?: boolean
    lockScroll?: boolean
  }

  export interface IContentProps extends IContentImplProps {
    forceMount?: true
  }
}
