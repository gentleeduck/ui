import type * as React from 'react'
import type { IDirection } from '../direction'
import type { DismissableLayer } from '../dismissable-layer'
import type { Scope } from '../libs/create-context'
import type { Primitive } from '../primitive-elements'
import type * as VisuallyHiddenPrimitive from '../visibility-hidden'

export namespace INavigationMenu {
  export type IScoped<TProps> = TProps & { __scopeNavigationMenu?: Scope }

  export type Orientation = 'vertical' | 'horizontal'

  export type NavigationMenuElement = React.ComponentRef<typeof Primitive.nav>
  export type NavigationMenuTriggerElement = React.ComponentRef<typeof Primitive.button>
  export type FocusGroupItemElement = React.ComponentRef<typeof Primitive.button>
  export type NavigationMenuContentImplElement = React.ComponentRef<typeof DismissableLayer>
  export type NavigationMenuViewportElement = React.ComponentRef<typeof Primitive.div>
  export type FocusProxyElement = React.ComponentRef<typeof VisuallyHiddenPrimitive.Root>

  type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>
  type PrimitiveNavProps = React.ComponentPropsWithoutRef<typeof Primitive.nav>
  type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>

  export interface IContentImplPrivateProps {
    value: string
    triggerRef: React.RefObject<NavigationMenuTriggerElement | null>
    focusProxyRef: React.RefObject<FocusProxyElement | null>
    wasEscapeCloseRef: React.RefObject<boolean>
    onContentFocusOutside(): void
    onRootContentClose(): void
  }

  export interface IContentImplProps
    extends Omit<DismissableLayerProps, 'onDismiss' | 'disableOutsidePointerEvents'>,
      IContentImplPrivateProps {}

  export interface IViewportContentMounterProps extends IContentImplProps {
    forceMount?: true
  }

  export type ViewportContentMounterElement = NavigationMenuContentImplElement

  export type IContentData = {
    ref?: React.Ref<ViewportContentMounterElement>
  } & IViewportContentMounterProps

  export interface IContext {
    isRootMenu: boolean
    value: string
    previousValue: string
    baseId: string
    dir: IDirection.Kind
    orientation: Orientation
    rootNavigationMenu: NavigationMenuElement | null
    indicatorTrack: HTMLDivElement | null
    onIndicatorTrackChange(indicatorTrack: HTMLDivElement | null): void
    viewport: NavigationMenuViewportElement | null
    onViewportChange(viewport: NavigationMenuViewportElement | null): void
    onViewportContentChange(contentValue: string, contentData: IContentData): void
    onViewportContentRemove(contentValue: string): void
    onTriggerEnter(itemValue: string): void
    onTriggerLeave(): void
    onContentEnter(): void
    onContentLeave(): void
    onItemSelect(itemValue: string): void
    onItemDismiss(): void
  }

  export interface IItemContext {
    value: string
    triggerRef: React.RefObject<NavigationMenuTriggerElement | null>
    contentRef: React.RefObject<NavigationMenuContentImplElement | null>
    focusProxyRef: React.RefObject<FocusProxyElement | null>
    wasEscapeCloseRef: React.RefObject<boolean>
    onEntryKeyDown(): void
    onFocusProxyEnter(side: 'start' | 'end'): void
    onRootContentClose(): void
    onContentFocusOutside(): void
  }

  export interface IProviderPrivateProps {
    isRootMenu: boolean
    scope: Scope
    children: React.ReactNode
    orientation: Orientation
    dir: IDirection.Kind
    rootNavigationMenu: NavigationMenuElement | null
    value: string
    onTriggerEnter(itemValue: string): void
    onTriggerLeave?(): void
    onContentEnter?(): void
    onContentLeave?(): void
    onItemSelect(itemValue: string): void
    onItemDismiss(): void
  }

  export interface IProviderProps extends IProviderPrivateProps {}

  export interface IProps extends Omit<IProviderProps, keyof IProviderPrivateProps>, PrimitiveNavProps {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    dir?: IDirection.Kind
    orientation?: Orientation
    delayDuration?: number
    skipDelayDuration?: number
  }

  export interface ISubProps extends Omit<IProviderProps, keyof IProviderPrivateProps>, PrimitiveDivProps {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    orientation?: Orientation
  }
}
