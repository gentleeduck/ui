import * as React from 'react'
import { createTooltipContext, type ScopedProps } from './tooltip.libs'

const PROVIDER_NAME = 'TooltipProvider'
const DEFAULT_DELAY_DURATION = 700

type TooltipProviderContextValue = {
  isOpenDelayedRef: React.RefObject<boolean>
  delayDuration: number
  onOpen(): void
  onClose(): void
  onPointerInTransitChange(inTransit: boolean): void
  isPointerInTransitRef: React.RefObject<boolean>
  disableHoverableContent: boolean
}

export const [TooltipProviderContextProvider, useTooltipProviderContext] =
  createTooltipContext<TooltipProviderContextValue>(PROVIDER_NAME)

export interface ITooltipProviderProps {
  children: React.ReactNode
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened.
   * @defaultValue 700
   */
  delayDuration?: number
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   * @defaultValue 300
   */
  skipDelayDuration?: number
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   * @defaultValue false
   */
  disableHoverableContent?: boolean
}

export const TooltipProvider: React.FC<ITooltipProviderProps> = (props: ScopedProps<ITooltipProviderProps>) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children,
  } = props
  const isOpenDelayedRef = React.useRef(true)
  const isPointerInTransitRef = React.useRef(false)
  const skipDelayTimerRef = React.useRef(0)

  React.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current
    return () => window.clearTimeout(skipDelayTimer)
  }, [])

  return (
    <TooltipProviderContextProvider
      scope={__scopeTooltip}
      isOpenDelayedRef={isOpenDelayedRef}
      delayDuration={delayDuration}
      onOpen={React.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current)
        isOpenDelayedRef.current = false
      }, [])}
      onClose={React.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current)
        skipDelayTimerRef.current = window.setTimeout(() => (isOpenDelayedRef.current = true), skipDelayDuration)
      }, [skipDelayDuration])}
      isPointerInTransitRef={isPointerInTransitRef}
      onPointerInTransitChange={React.useCallback((inTransit: boolean) => {
        isPointerInTransitRef.current = inTransit
      }, [])}
      disableHoverableContent={disableHoverableContent}>
      {children}
    </TooltipProviderContextProvider>
  )
}

TooltipProvider.displayName = PROVIDER_NAME
