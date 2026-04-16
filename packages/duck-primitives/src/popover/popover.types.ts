import type * as React from 'react'
import type { DismissableLayer } from '../dismissable-layer'
import type { FocusScope } from '../focus-scope'
import type { IDirection } from '../direction'
import type { Scope } from '../libs/create-context'
import type * as PopperPrimitive from '../popper'
import type { Portal as PortalPrimitive } from '../portal'
import type { Primitive } from '../primitive-elements'

export namespace IPopover {
  export type IScoped<TProps> = TProps & { __scopePopover?: Scope }

  export interface IContext {
    triggerRef: React.RefObject<HTMLButtonElement | null>
    contentId: string
    open: boolean
    onOpenChange(open: boolean): void
    onOpenToggle(): void
    hasCustomAnchor: boolean
    onCustomAnchorAdd(): void
    onCustomAnchorRemove(): void
    modal: boolean
    dir: IDirection.Kind
  }

  export interface IProps {
    children?: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    modal?: boolean
    dir?: IDirection.Kind
  }

  type PrimitiveButtonProps = React.ComponentPropsWithRef<typeof Primitive.button>
  type PopperAnchorProps = React.ComponentPropsWithRef<typeof PopperPrimitive.PopperAnchor>
  type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperContent>
  type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>
  type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>

  export interface IAnchorProps extends PopperAnchorProps {}
  export interface IArrowProps extends PopperAnchorProps {}
  export interface ITriggerProps extends PrimitiveButtonProps {}
  export interface ICloseProps extends ITriggerProps {}

  export interface IContentImplProps
    extends Omit<PopperContentProps, 'onPlaced'>,
      Omit<DismissableLayerProps, 'onDismiss'> {
    trapFocus?: FocusScopeProps['trapped']
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']
  }

  export interface IContentTypeProps
    extends Omit<IContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
    trapFocus?: FocusScopeProps['trapped']
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents']
    lockScroll?: boolean
  }

  export interface IContentProps extends IContentTypeProps {
    forceMount?: true
  }

  type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>

  export interface IPortalProps {
    children?: React.ReactNode
    container?: PortalProps['container']
    forceMount?: true
  }

  export interface IPortalContext {
    forceMount?: true
  }
}
