import * as React from 'react'
import { composeEventHandlers } from '../libs/compose-event-handler'
import { composeRefs, useComposedRefs } from '../libs/compose-ref'
import { Presence } from '../presence'
import { Primitive } from '../primitive-elements'
import { NavigationMenuContentImpl } from './content'
import { useNavigationMenuContext, useViewportContentContext } from './navigation-menu'
import { getOpenState, useResizeObserver, whenMouse } from './navigation-menu.libs'
import type { INavigationMenu } from './navigation-menu.types'

const VIEWPORT_NAME = 'NavigationMenuViewport'
const CONTENT_NAME = 'NavigationMenuContent'

type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
type NavigationMenuViewportImplElement = React.ComponentRef<typeof Primitive.div>
interface INavigationMenuViewportImplProps extends PrimitiveDivProps {}

interface INavigationMenuViewportProps extends Omit<INavigationMenuViewportImplProps, 'activeContentValue'> {
  forceMount?: true
}

const NavigationMenuViewport = React.forwardRef<
  INavigationMenu.NavigationMenuViewportElement,
  INavigationMenuViewportProps
>((props: INavigationMenu.IScoped<INavigationMenuViewportProps>, forwardedRef) => {
  const { forceMount, ...viewportProps } = props
  const context = useNavigationMenuContext(VIEWPORT_NAME, props.__scopeNavigationMenu)
  const open = Boolean(context.value)

  return (
    <Presence present={forceMount || open}>
      <NavigationMenuViewportImpl {...viewportProps} ref={forwardedRef} />
    </Presence>
  )
})

NavigationMenuViewport.displayName = VIEWPORT_NAME

const NavigationMenuViewportImpl = React.forwardRef<
  NavigationMenuViewportImplElement,
  INavigationMenuViewportImplProps
>((props: INavigationMenu.IScoped<INavigationMenuViewportImplProps>, forwardedRef) => {
  const { __scopeNavigationMenu, children, ...viewportImplProps } = props
  const context = useNavigationMenuContext(VIEWPORT_NAME, __scopeNavigationMenu)
  const composedRefs = useComposedRefs(forwardedRef, context.onViewportChange)
  const viewportContentContext = useViewportContentContext(CONTENT_NAME, props.__scopeNavigationMenu)
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null)
  const [content, setContent] = React.useState<INavigationMenu.NavigationMenuContentImplElement | null>(null)
  const viewportWidth = size ? `${size?.width}px` : undefined
  const viewportHeight = size ? `${size?.height}px` : undefined
  const open = Boolean(context.value)
  // keep the previously active value mounted while the viewport animates out
  const activeContentValue = open ? context.value : context.previousValue

  // use offset* not getBoundingClientRect: rect is affected by CSS transforms,
  // so an animating-in scale(0.5) would report intermediate sizes
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
        // block pointer events while animating out
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
                // only swap measured node when a new active node is mounted; otherwise
                // the old size collapses to 0 before the exit animation finishes
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
