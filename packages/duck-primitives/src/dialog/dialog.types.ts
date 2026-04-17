import type * as React from 'react'
import type { IDirection } from '../direction'
import type { DismissableLayer } from '../dismissable-layer'
import type { FocusScope } from '../focus-scope'
import type { Scope } from '../libs/create-context'
import type { Portal as PortalPrimitive } from '../portal'
import type { Primitive } from '../primitive-elements'

export namespace IDialog {
  export type IScoped<TProps> = TProps & { __scopeDialog?: Scope }

  export type DialogContentElement = HTMLDivElement

  export interface IContext {
    triggerRef: React.RefObject<HTMLButtonElement | null>
    contentRef: React.RefObject<DialogContentElement | null>
    contentId: string
    titleId: string
    descriptionId: string
    open: boolean
    onOpenChange(open: boolean): void
    onOpenToggle(): void
    modal: boolean
    dir: IDirection.Kind
  }

  export interface IProps {
    children?: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?(open: boolean): void
    modal?: boolean
    dir?: IDirection.Kind
  }

  type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>
  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
  type PrimitiveHeading2Props = React.ComponentPropsWithoutRef<typeof Primitive.h2>
  type PrimitiveParagraphProps = React.ComponentPropsWithoutRef<typeof Primitive.p>

  export interface ICloseProps extends PrimitiveButtonProps {}
  export interface ITriggerProps extends PrimitiveButtonProps {}
  export interface ITitleProps extends PrimitiveHeading2Props {}
  export interface IDescriptionProps extends PrimitiveParagraphProps {}

  type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
  type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>

  export interface IContentImplProps extends Omit<DismissableLayerProps, 'onDismiss'> {
    trapFocus?: FocusScopeProps['trapped']
    onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']
    onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']
  }

  export interface IContentTypeProps extends Omit<IContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
    trapFocus?: FocusScopeProps['trapped']
    disableOutsidePointerEvents?: DismissableLayerProps['disableOutsidePointerEvents']
  }

  export interface IContentProps extends IContentTypeProps {
    forceMount?: true
  }

  export interface IOverlayImplProps extends PrimitiveDivProps {
    lockScroll?: boolean
  }

  export interface IOverlayProps extends IOverlayImplProps {
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
