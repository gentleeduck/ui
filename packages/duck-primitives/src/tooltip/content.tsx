import * as React from 'react'
import { DismissableLayer } from '../dismissable-layer'
import { useComposedRefs } from '../libs/compose-ref'
import * as PopperPrimitive from '../popper'
import { Presence } from '../presence'
import { createSlottable } from '../slot'
import * as VisuallyHiddenPrimitive from '../visibility-hidden'
import { usePortalContext } from './portal'
import { useTooltipProviderContext } from './provider'
import { useTooltipContext } from './tooltip'
import type { Polygon } from './tooltip.libs'
import {
  createTooltipContext,
  getExitSideFromRect,
  getHull,
  getPaddedExitPoints,
  getPointsFromRect,
  isPointInPolygon,
  TOOLTIP_OPEN,
  usePopperScope,
} from './tooltip.libs'
import type { ITooltip } from './tooltip.types'

const CONTENT_NAME = 'TooltipContent'
const TOOLTIP_NAME = 'Tooltip'

export const [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(
  TOOLTIP_NAME,
  { isInside: false },
)

type TooltipContentImplElement = React.ComponentRef<typeof PopperPrimitive.PopperContent>
type TooltipContentElement = TooltipContentImplElement

export const TooltipContent = React.forwardRef<TooltipContentElement, ITooltip.IContentProps>(
  (props: ITooltip.IScoped<ITooltip.IContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeTooltip)
    const { forceMount = portalContext.forceMount, side = 'top', ...contentProps } = props
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip)

    return (
      <Presence present={forceMount || context.open}>
        {context.disableHoverableContent ? (
          <TooltipContentImpl side={side} {...contentProps} ref={forwardedRef} />
        ) : (
          <TooltipContentHoverable side={side} {...contentProps} ref={forwardedRef} />
        )}
      </Presence>
    )
  },
)

TooltipContent.displayName = CONTENT_NAME

type TooltipContentHoverableElement = TooltipContentImplElement

const TooltipContentHoverable = React.forwardRef<TooltipContentHoverableElement, ITooltip.IContentHoverableProps>(
  (props: ITooltip.IScoped<ITooltip.IContentHoverableProps>, forwardedRef) => {
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip)
    const providerContext = useTooltipProviderContext(CONTENT_NAME, props.__scopeTooltip)
    const ref = React.useRef<TooltipContentHoverableElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)
    const [pointerGraceArea, setPointerGraceArea] = React.useState<Polygon | null>(null)

    const { trigger, onClose } = context
    const content = ref.current

    const { onPointerInTransitChange } = providerContext

    const handleRemoveGraceArea = React.useCallback(() => {
      setPointerGraceArea(null)
      onPointerInTransitChange(false)
    }, [onPointerInTransitChange])

    const handleCreateGraceArea = React.useCallback(
      (event: PointerEvent, hoverTarget: HTMLElement) => {
        const currentTarget = event.currentTarget as HTMLElement
        const exitPoint = { x: event.clientX, y: event.clientY }
        const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect())
        const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide)
        const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect())
        const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints])
        setPointerGraceArea(graceArea)
        onPointerInTransitChange(true)
      },
      [onPointerInTransitChange],
    )

    React.useEffect(() => {
      return () => handleRemoveGraceArea()
    }, [handleRemoveGraceArea])

    React.useEffect(() => {
      if (trigger && content) {
        const handleTriggerLeave = (event: PointerEvent) => handleCreateGraceArea(event, content)
        const handleContentLeave = (event: PointerEvent) => handleCreateGraceArea(event, trigger)

        trigger.addEventListener('pointerleave', handleTriggerLeave)
        content.addEventListener('pointerleave', handleContentLeave)
        return () => {
          trigger.removeEventListener('pointerleave', handleTriggerLeave)
          content.removeEventListener('pointerleave', handleContentLeave)
        }
      }
    }, [trigger, content, handleCreateGraceArea])

    React.useEffect(() => {
      if (pointerGraceArea) {
        const handleTrackPointerGrace = (event: PointerEvent) => {
          const target = event.target as HTMLElement
          const pointerPosition = { x: event.clientX, y: event.clientY }
          const hasEnteredTarget = trigger?.contains(target) || content?.contains(target)
          const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea)

          if (hasEnteredTarget) {
            handleRemoveGraceArea()
          } else if (isPointerOutsideGraceArea) {
            handleRemoveGraceArea()
            onClose()
          }
        }
        document.addEventListener('pointermove', handleTrackPointerGrace)
        return () => document.removeEventListener('pointermove', handleTrackPointerGrace)
      }
    }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea])

    return <TooltipContentImpl {...props} ref={composedRefs} />
  },
)

TooltipContentHoverable.displayName = `${CONTENT_NAME}Hoverable`

const Slottable = createSlottable('TooltipContent')

const TooltipContentImpl = React.forwardRef<TooltipContentImplElement, ITooltip.IContentImplProps>(
  (props: ITooltip.IScoped<ITooltip.IContentImplProps>, forwardedRef) => {
    const {
      __scopeTooltip,
      children,
      'aria-label': ariaLabel,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props
    const context = useTooltipContext(CONTENT_NAME, __scopeTooltip)
    const popperScope = usePopperScope(__scopeTooltip)
    const { onClose } = context

    // Close this tooltip if another one opens
    React.useEffect(() => {
      document.addEventListener(TOOLTIP_OPEN, onClose)
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose)
    }, [onClose])

    // Close the tooltip if the trigger is scrolled
    React.useEffect(() => {
      if (context.trigger) {
        const handleScroll = (event: Event) => {
          const target = event.target as HTMLElement
          if (target?.contains(context.trigger)) onClose()
        }
        window.addEventListener('scroll', handleScroll, { capture: true })
        return () => window.removeEventListener('scroll', handleScroll, { capture: true })
      }
    }, [context.trigger, onClose])

    return (
      <DismissableLayer
        asChild
        disableOutsidePointerEvents={false}
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={onPointerDownOutside}
        onFocusOutside={(event) => event.preventDefault()}
        onDismiss={onClose}>
        <PopperPrimitive.PopperContent
          data-slot="tooltip-content"
          data-state={context.stateAttribute}
          dir={context.dir}
          {...popperScope}
          {...contentProps}
          ref={forwardedRef}
          style={{
            ...contentProps.style,
            // expose popper custom props under tooltip-* namespace
            ...({
              '--gentleduck-tooltip-content-transform-origin': 'var(--gentleduck-popper-transform-origin)',
              '--gentleduck-tooltip-content-available-width': 'var(--gentleduck-popper-available-width)',
              '--gentleduck-tooltip-content-available-height': 'var(--gentleduck-popper-available-height)',
              '--gentleduck-tooltip-trigger-width': 'var(--gentleduck-popper-anchor-width)',
              '--gentleduck-tooltip-trigger-height': 'var(--gentleduck-popper-anchor-height)',
            } as React.CSSProperties),
          }}>
          <Slottable>{children}</Slottable>
          <VisuallyHiddenContentContextProvider scope={__scopeTooltip} isInside={true}>
            <VisuallyHiddenPrimitive.Root id={context.contentId} role="tooltip">
              {ariaLabel || children}
            </VisuallyHiddenPrimitive.Root>
          </VisuallyHiddenContentContextProvider>
        </PopperPrimitive.PopperContent>
      </DismissableLayer>
    )
  },
)

TooltipContentImpl.displayName = `${CONTENT_NAME}Impl`
