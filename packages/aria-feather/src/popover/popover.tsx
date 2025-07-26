'use client'

import { arrow, autoUpdate, computePosition, flip, offset, platform, shift, size } from '@gentleduck/duck-float/dom'
import { Provider as DuckStateProvider, useAtomValue } from '@gentleduck/state/react'
import React, { createContext, useId } from 'react'
import { ShouldRender } from '../../../../packages/aria-feather/src/dialog/dialog'
import { Slot } from '../slot'
import { popoverOpen, popoverRefs } from './popover.atoms'
import { usePopover, usePopoverContext } from './popover.hooks'
import type { PopoverContentProps, PopoverContextType } from './popover.types'

export const PopoverContext = createContext<PopoverContextType | null>(null)

function Root({ children, ...props }: React.ComponentPropsWithoutRef<typeof PopoverInternal>) {
  return (
    <DuckStateProvider>
      <PopoverInternal {...props}>{children}</PopoverInternal>
    </DuckStateProvider>
  )
}

const PopoverInternal = ({
  children,
  open: openProp,
  onOpenChange,
  skipDelayDuration,
  delayDuration,
  mouseEnter,
  mouseExist,
  contextMenu,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, 'contextMenu'> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  skipDelayDuration?: number
  delayDuration?: number
  mouseEnter?: boolean
  mouseExist?: boolean
  contextMenu?: boolean
}) => {
  const id = useId()
  const {
    wrapperRef,
    open,
    contentRef,
    arrowRef,
    triggerRef,
    onOpenChange: _onOpenChange,
  } = usePopover({
    openProp,
    onOpenChange,
    skipDelayDuration,
    delayDuration,
    mouseEnter,
    mouseExist,
    contextMenu,
  })

  return (
    <PopoverContext.Provider
      value={{ id, wrapperRef, open, contentRef, arrowRef, triggerRef, onOpenChange: _onOpenChange }}>
      <div {...props} ref={wrapperRef}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

function Trigger({ asChild = false, ...props }: React.ComponentPropsWithRef<typeof Slot>) {
  const { id } = usePopoverContext()
  return <Slot {...props} asChild={asChild} duck-popover-trigger="" id={id} />
}

function Content({
  children,
  placement = 'bottom',
  sideOffset = 4,
  alignOffset = 0,
  renderOnce = true,
  rerender = false,
  withArrow = false,
  matchWidth = false,
  ...props
}: PopoverContentProps): React.JSX.Element {
  const openValue = useAtomValue(popoverOpen)
  const { trigger, content, arrow: _arrow } = useAtomValue(popoverRefs)

  const { id } = usePopoverContext()
  React.useLayoutEffect(() => {
    if (!trigger || !content || !_arrow) return

    const arrowRect = _arrow.getBoundingClientRect()
    const arrowSize = Math.max(arrowRect.width, arrowRect.height)

    const cleanup = autoUpdate(trigger, content, () => {
      computePosition(trigger, content, {
        placement,
        platform,
        middleware: [
          offset({ mainAxis: withArrow ? sideOffset + arrowRect.height / 2 : sideOffset, crossAxis: alignOffset }),
          flip(),
          size({
            apply({ rects, elements }) {
              if (matchWidth) {
                elements.floating.style.width = `${rects.reference.width}px`
              }
            },
          }),
          shift({ padding: 8 }),
          arrow({ element: _arrow, padding: 8 }),
        ],
      }).then(({ x, y, middlewareData, placement }) => {
        // console.log(x, y, placement)
        Object.assign(content.style, { left: `${x}px`, top: `${y}px`, transform: 'translate(0, 0)' })

        if (middlewareData.arrow && withArrow) {
          const { x: arrowX, y: arrowY } = middlewareData.arrow
          Object.assign(_arrow.style, {
            left:
              arrowX != null
                ? `${arrowX}px`
                : middlewareData.offset?.placement === 'left'
                  ? '98.9%'
                  : `-${arrowSize / 1.22}px`,
            top:
              arrowY != null
                ? `${arrowY}px`
                : middlewareData.offset?.placement === 'top'
                  ? '100%'
                  : `-${arrowSize / 1.6}px`,
            transform:
              middlewareData.offset?.placement === 'top'
                ? 'rotate(180deg)'
                : middlewareData.offset?.placement === 'bottom'
                  ? 'rotate(0deg)'
                  : middlewareData.offset?.placement === 'right'
                    ? 'rotate(-90deg)'
                    : 'rotate(90deg)',
          })
        }
      })
    })

    return () => cleanup()
  }, [trigger, placement, sideOffset, alignOffset, withArrow, openValue])

  React.useEffect(() => {
    if (content) {
      const triggerRect = trigger?.getBoundingClientRect()

      if (placement.includes('bottom')) {
        content.style.left = `50%`
        content.style.transform = `translate(-50%,${triggerRect.bottom + sideOffset}px)`
      }

      if (placement.includes('top')) {
        content.style.left = `50%`
        content.style.transform = `translate(-50%,${triggerRect.bottom - content.offsetHeight - triggerRect.height - sideOffset}px)`
      }

      if (placement.includes('right')) {
        content.style.top = `50%`
        content.style.transform = `translate(${triggerRect.right + sideOffset}px,-50%) scale(.97)`
      }

      if (placement.includes('left')) {
        content.style.top = `50%`
        content.style.transform = `translate(${triggerRect.left - content.offsetWidth - sideOffset}px,-50%) `
      }

      content.style.transformOrigin = placement.includes('left')
        ? 'right'
        : placement.includes('right')
          ? 'left'
          : placement.includes('top')
            ? 'bottom'
            : placement.includes('bottom')
              ? 'top'
              : 'center'
    }
  }, [content])

  return (
    <dialog duck-popover-content="" tabIndex={-1} popover="auto" id={id} open={true} data-open={openValue} {...props}>
      <div
        id="arrow"
        className={
          withArrow
            ? 'absolute z-3 h-2 w-4 rotate-180 bg-popover bg-red-500 [clip-path:polygon(50%_100%,0_0,100%_0)]'
            : 'hidden'
        }
        duck-popover-arrow=""
      />
      {rerender ? (
        <ShouldRender open={openValue} ref={content} forceMount={renderOnce}>
          {children}
        </ShouldRender>
      ) : (
        children
      )}
    </dialog>
  )
}

export { Root, Trigger, Content }
