import type * as React from 'react'
import type { IDirection } from '../direction'
import type { DismissableLayer } from '../dismissable-layer'
import type { Scope } from '../libs/create-context'
import type * as PopperPrimitive from '../popper'
import type { Portal as PortalPrimitive } from '../portal'
import type { Primitive } from '../primitive-elements'

export namespace IHoverCard {
  export type IScoped<TProps> = TProps & { __scopeHoverCard?: Scope }

  export interface IContext {
    open: boolean
    onOpenChange(open: boolean): void
    onOpen(): void
    onClose(): void
    onDismiss(): void
    hasSelectionRef: React.RefObject<boolean>
    isPointerDownOnContentRef: React.RefObject<boolean>
    dir: IDirection.Kind
  }

  export interface IPortalContext {
    forceMount?: true
  }

  export interface IProps {
    children?: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    openDelay?: number
    closeDelay?: number
    dir?: IDirection.Kind
  }

  type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>
  type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>
  type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
  type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>
  type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>

  export interface IArrowProps extends PopperArrowProps {}

  export interface IContentImplProps extends Omit<PopperContentProps, 'onPlaced'> {
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown']
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside']
    onFocusOutside?: DismissableLayerProps['onFocusOutside']
    onInteractOutside?: DismissableLayerProps['onInteractOutside']
  }

  export interface IContentProps extends IContentImplProps {
    forceMount?: true
  }

  export interface IPortalProps {
    children?: React.ReactNode
    container?: PortalProps['container']
    forceMount?: true
  }

  export interface ITriggerProps extends PrimitiveLinkProps {}
}
