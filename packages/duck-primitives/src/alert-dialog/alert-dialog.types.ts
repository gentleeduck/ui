import type * as React from 'react'
import type * as DialogPrimitive from '../dialog'
import type { Scope } from '../libs/create-context'

export namespace IAlertDialog {
  export type IScoped<TProps> = TProps & { __scopeAlertDialog?: Scope }

  type DialogProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
  export interface IProps extends Omit<DialogProps, 'modal'> {}

  type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
  export interface IActionProps extends DialogCloseProps {}
  export interface ICancelProps extends DialogCloseProps {}

  type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
  export interface IContentProps extends Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'> {}

  type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
  export interface IDescriptionProps extends DialogDescriptionProps {}

  type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
  export interface IOverlayProps extends DialogOverlayProps {}

  type DialogPortalProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>
  export interface IPortalProps extends DialogPortalProps {}

  type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
  export interface ITitleProps extends DialogTitleProps {}

  type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
  export interface ITriggerProps extends DialogTriggerProps {}

  export interface IContentContextValue {
    cancelRef: React.RefObject<React.ComponentRef<typeof DialogPrimitive.Close> | null>
  }
}
