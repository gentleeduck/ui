import type * as React from 'react'
import type { IDirection } from '../direction'
import type { DismissableLayer } from '../dismissable-layer'
import type { Scope } from '../libs/create-context'
import type * as PopperPrimitive from '../popper'
import type { Portal as PortalPrimitive } from '../portal'
import type { Primitive } from '../primitive-elements'

export namespace ITooltip {
  export type IScoped<TProps = {}> = TProps & { __scopeTooltip?: Scope }

  type TooltipTriggerElement = React.ComponentRef<'button'>

  export interface IContext {
    contentId: string
    open: boolean
    stateAttribute: 'closed' | 'delayed-open' | 'instant-open'
    trigger: TooltipTriggerElement | null
    onTriggerChange(trigger: TooltipTriggerElement | null): void
    onTriggerEnter(): void
    onTriggerLeave(): void
    onOpen(): void
    onClose(): void
    disableHoverableContent: boolean
    dir: IDirection.Kind
  }

  export interface IProviderContext {
    isOpenDelayedRef: React.RefObject<boolean>
    delayDuration: number
    onOpen(): void
    onClose(): void
    onPointerInTransitChange(inTransit: boolean): void
    isPointerInTransitRef: React.RefObject<boolean>
    disableHoverableContent: boolean
  }

  export interface IPortalContext {
    forceMount?: true | undefined
  }

  export interface IProps {
    children?: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    delayDuration?: number
    disableHoverableContent?: boolean
    dir?: IDirection.Kind
  }

  export interface IProviderProps {
    children: React.ReactNode
    delayDuration?: number
    skipDelayDuration?: number
    disableHoverableContent?: boolean
  }

  type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperAnchor>
  type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperArrow>
  type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.PopperContent>
  type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
  type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>

  export interface IArrowProps extends PopperArrowProps {}

  export interface IContentImplProps extends Omit<PopperContentProps, 'onPlaced'> {
    'aria-label'?: string
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown']
    onPointerDownOutside?: DismissableLayerProps['onPointerDownOutside']
  }

  export interface IContentHoverableProps extends IContentImplProps {}

  export interface IContentProps extends IContentImplProps {
    forceMount?: true
  }

  type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>

  export interface IPortalProps {
    children?: React.ReactNode | undefined
    container?: PortalProps['container'] | undefined
    forceMount?: true | undefined
  }

  export interface ITriggerProps extends PrimitiveButtonProps {
    disableCloseOnClick?: boolean
  }
}
