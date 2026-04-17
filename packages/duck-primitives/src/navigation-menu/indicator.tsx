import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Presence } from '../presence'
import { Primitive } from '../primitive-elements'
import { useCollection, useNavigationMenuContext } from './navigation-menu'
import type { INavigationMenu } from './navigation-menu.types'

type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>
import { useResizeObserver } from './navigation-menu.libs'

const INDICATOR_NAME = 'NavigationMenuIndicator'

type NavigationMenuIndicatorElement = NavigationMenuIndicatorImplElement
interface INavigationMenuIndicatorProps extends INavigationMenuIndicatorImplProps {
  forceMount?: true
}

const NavigationMenuIndicator = React.forwardRef<NavigationMenuIndicatorElement, INavigationMenuIndicatorProps>(
  (props: INavigationMenu.IScoped<INavigationMenuIndicatorProps>, forwardedRef) => {
    const { forceMount, ...indicatorProps } = props
    const context = useNavigationMenuContext(INDICATOR_NAME, props.__scopeNavigationMenu)
    const isVisible = Boolean(context.value)

    return context.indicatorTrack
      ? ReactDOM.createPortal(
          <Presence present={forceMount || isVisible}>
            <NavigationMenuIndicatorImpl {...indicatorProps} ref={forwardedRef} />
          </Presence>,
          context.indicatorTrack,
        )
      : null
  },
)

NavigationMenuIndicator.displayName = INDICATOR_NAME

type NavigationMenuIndicatorImplElement = React.ComponentRef<typeof Primitive.div>
interface INavigationMenuIndicatorImplProps extends PrimitiveDivProps {}

const NavigationMenuIndicatorImpl = React.forwardRef<
  NavigationMenuIndicatorImplElement,
  INavigationMenuIndicatorImplProps
>((props: INavigationMenu.IScoped<INavigationMenuIndicatorImplProps>, forwardedRef) => {
  const { __scopeNavigationMenu, ...indicatorProps } = props
  const context = useNavigationMenuContext(INDICATOR_NAME, __scopeNavigationMenu)
  const getItems = useCollection(__scopeNavigationMenu)
  const [activeTrigger, setActiveTrigger] = React.useState<INavigationMenu.NavigationMenuTriggerElement | null>(null)
  const [position, setPosition] = React.useState<{ size: number; offset: number } | null>(null)
  const isHorizontal = context.orientation === 'horizontal'
  const isVisible = Boolean(context.value)

  React.useEffect(() => {
    const items = getItems()
    const triggerNode = items.find((item) => item.value === context.value)?.ref.current
    if (triggerNode) setActiveTrigger(triggerNode)
  }, [getItems, context.value])

  /**
   * Update position when the indicator or parent track size changes
   */
  const handlePositionChange = () => {
    if (activeTrigger) {
      setPosition({
        size: isHorizontal ? activeTrigger.offsetWidth : activeTrigger.offsetHeight,
        offset: isHorizontal ? activeTrigger.offsetLeft : activeTrigger.offsetTop,
      })
    }
  }
  useResizeObserver(activeTrigger, handlePositionChange)
  useResizeObserver(context.indicatorTrack, handlePositionChange)

  // We need to wait for the indicator position to be available before rendering to
  // snap immediately into position rather than transitioning from initial
  return position ? (
    <Primitive.div
      data-slot="navigation-menu-indicator"
      aria-hidden
      data-state={isVisible ? 'visible' : 'hidden'}
      data-orientation={context.orientation}
      {...indicatorProps}
      ref={forwardedRef}
      style={{
        position: 'absolute',
        ...(isHorizontal
          ? {
              left: 0,
              width: `${position.size}px`,
              transform: `translateX(${position.offset}px)`,
            }
          : {
              top: 0,
              height: `${position.size}px`,
              transform: `translateY(${position.offset}px)`,
            }),
        ...indicatorProps.style,
      }}
    />
  ) : null
})

NavigationMenuIndicatorImpl.displayName = 'NavigationMenuIndicatorImpl'

export type { INavigationMenuIndicatorProps }
export { NavigationMenuIndicator }
