import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { composeRefs, useComposedRefs } from '../libs/compose-ref'
import { Presence } from '../presence'
import { Primitive } from '../primitive-elements'
import { NavigationMenuContentImpl } from './content'
import type {
  NavigationMenuContentImplElement,
  NavigationMenuViewportElement,
  PrimitiveDivProps,
  ScopedProps,
} from './navigation-menu'
import { useNavigationMenuContext, useViewportContentContext } from './navigation-menu'
import { getOpenState, useResizeObserver, whenMouse } from './navigation-menu.libs'

const VIEWPORT_NAME = 'NavigationMenuViewport'
const CONTENT_NAME = 'NavigationMenuContent'

type NavigationMenuViewportImplElement = React.ComponentRef<typeof Primitive.div>
interface INavigationMenuViewportImplProps extends PrimitiveDivProps {}

interface INavigationMenuViewportProps extends Omit<INavigationMenuViewportImplProps, 'activeContentValue'> {
  forceMount?: true
}

const NavigationMenuViewport = React.forwardRef<NavigationMenuViewportElement, INavigationMenuViewportProps>(
  (props: ScopedProps<INavigationMenuViewportProps>, forwardedRef) => {
    const { forceMount, ...viewportProps } = props
    const context = useNavigationMenuContext(VIEWPORT_NAME, props.__scopeNavigationMenu)
    const open = Boolean(context.value)

    return (
      <Presence present={forceMount || open}>
        <NavigationMenuViewportImpl {...viewportProps} ref={forwardedRef} />
      </Presence>
    )
  },
)

NavigationMenuViewport.displayName = VIEWPORT_NAME

/* ----- NavigationMenuViewportImpl (internal) ----- */

const NavigationMenuViewportImpl = React.forwardRef<
  NavigationMenuViewportImplElement,
  INavigationMenuViewportImplProps
>((props: ScopedProps<INavigationMenuViewportImplProps>, forwardedRef) => {
  const { __scopeNavigationMenu, children, ...viewportImplProps } = props
  const context = useNavigationMenuContext(VIEWPORT_NAME, __scopeNavigationMenu)
  const composedRefs = useComposedRefs(forwardedRef, context.onViewportChange)
  const viewportContentContext = useViewportContentContext(CONTENT_NAME, props.__scopeNavigationMenu)
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null)
  const [content, setContent] = React.useState<NavigationMenuContentImplElement | null>(null)
  const viewportWidth = size ? `${size?.width}px` : undefined
  const viewportHeight = size ? `${size?.height}px` : undefined
  const open = Boolean(context.value)
  // We persist the last active content value as the viewport may be animating out
  // and we want the content to remain mounted for the lifecycle of the viewport.
  const activeContentValue = open ? context.value : context.previousValue

  /**
   * Update viewport size to match the active content node.
   * We prefer offset dimensions over `getBoundingClientRect` as the latter respects CSS transform.
   * For example, if content animates in from `scale(0.5)` the dimensions would be anything
   * from `0.5` to `1` of the intended size.
   */
  const handleSizeChange = () => {
    if (content) setSize({ width: content.offsetWidth, height: content.offsetHeight })
  }
  useResizeObserver(content, handleSizeChange)

  return (
    <Primitive.div
      data-slot="navigation-menu-viewport"
      data-state={getOpenState(open)}
      data-orientation={context.orientation}
      {...viewportImplProps}
      ref={composedRefs}
      style={{
        // Prevent interaction when animating out
        pointerEvents: !open && context.isRootMenu ? 'none' : undefined,
        ['--radix-navigation-menu-viewport-width' as string]: viewportWidth,
        ['--radix-navigation-menu-viewport-height' as string]: viewportHeight,
        ...viewportImplProps.style,
      }}
      onPointerEnter={composeEventHandlers(props.onPointerEnter, context.onContentEnter)}
      onPointerLeave={composeEventHandlers(props.onPointerLeave, whenMouse(context.onContentLeave))}>
      {Array.from(viewportContentContext.items).map(([value, { ref, forceMount, ...props }]) => {
        const isActive = activeContentValue === value
        return (
          <Presence key={value} present={forceMount || isActive}>
            <NavigationMenuContentImpl
              {...props}
              ref={composeRefs(ref, (node) => {
                // We only want to update the stored node when another is available
                // as we need to smoothly transition between them.
                if (isActive && node) setContent(node)
              })}
            />
          </Presence>
        )
      })}
    </Primitive.div>
  )
})

NavigationMenuViewportImpl.displayName = 'NavigationMenuViewportImpl'

export type { INavigationMenuViewportProps }
export { NavigationMenuViewport }
