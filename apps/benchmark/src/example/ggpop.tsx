'use client'
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  Placement,
  platform,
  shift,
} from '@gentleduck/duck-float/dom'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { atom, Provider as DuckStateProvider, useAtom, useAtomValue, useSetAtom } from '@gentleduck/state/primitive'
import { VariantProps } from '@gentleduck/variants'
import React, { createContext, useId } from 'react'
import { cn } from '@/lib/utils'
import { ShouldRender } from '../../../../packages/aria-feather/src/dialog/dialog'

const PopoverContext = createContext<{ id: string }>({ id: '' })

function Popover({ children, ...props }: React.HTMLProps<HTMLDivElement>) {
  const id = useId()
  return (
    <DuckStateProvider>
      <PopoverContext.Provider value={{ id }}>
        <PopoverInternal {...props}>{children}</PopoverInternal>
      </PopoverContext.Provider>
    </DuckStateProvider>
  )
}

function usePopoverId() {
  const ctx = React.useContext(PopoverContext)
  if (!ctx.id) throw new Error('Popover components must be wrapped in <Popover>')
  return ctx.id
}

const open = atom(false)
const refs = atom<{
  trigger: HTMLElement | HTMLButtonElement | null
  content: HTMLDialogElement | null
  wrapper: HTMLDivElement | null
  arrow: HTMLDivElement | null
}>({ trigger: null, content: null, wrapper: null, arrow: null })

const PopoverInternal = ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement | HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDialogElement | null>(null)
  const arrowRef = React.useRef<HTMLDivElement>(null)
  const [openValue, setOpen] = useAtom(open)
  const setRefs = useSetAtom(refs)

  React.useLayoutEffect(() => {
    if (!wrapperRef.current) return
    triggerRef.current = wrapperRef?.current.querySelector('[duck-popover-trigger]')
    contentRef.current = wrapperRef?.current.querySelector('[duck-popover-content]')
    arrowRef.current = wrapperRef?.current.querySelector('[duck-popover-arrow]')
    if (!triggerRef.current || !contentRef.current) return

    setRefs({
      trigger: triggerRef.current,
      content: contentRef.current,
      wrapper: wrapperRef.current,
      arrow: arrowRef.current,
    })
    return () => setRefs({ trigger: null, content: null, wrapper: null, arrow: null })
  }, [])

  React.useEffect(() => {
    // if (mouseEnter || mouseExist || openProp === undefined) return
    // if (lockScroll) lockScrollbar(open)

    handleOpenChange(openValue)
  }, [openValue])

  function handleOpenChange(state: boolean) {
    if (!contentRef.current) return

    try {
      state ? contentRef.current.showPopover() : contentRef.current.hidePopover()
    } catch (e) {
      console.warn('Popover failed to toggle', e)
    }

    setOpen(state)
    // onOpenChange?.(state)
  }

  React.useEffect(() => {
    // if (mouseEnter || mouseExist) return
    // if (lockScroll) lockScrollbar(open)

    const handleClose = (event: Event) =>
      handleOpenChange((event as Event & { newState: 'open' | 'close' }).newState === 'open')

    contentRef.current?.addEventListener('toggle', handleClose)
    return () => contentRef.current?.removeEventListener('toggle', handleClose)
  }, [])

  return (
    <div {...props} ref={wrapperRef}>
      {children}
    </div>
  )
}

function PopoverTrigger({
  children,
  variant = 'outline',
  asChild = false,
  ...props
}: React.ComponentPropsWithRef<typeof Button>) {
  const Id = usePopoverId()

  return (
    <Button
      {...props}
      variant={variant}
      asChild={asChild}
      popoverTarget={Id}
      popoverTargetAction="toggle"
      duck-popover-trigger="">
      {children}
    </Button>
  )
}

type PopoverContentProps = React.HTMLProps<HTMLDialogElement> & {
  sideOffset?: number
  alignOffset?: number
  placement?: Placement
  animation?: VariantProps<typeof AnimDialogVariants>['animation']
  overlay?: VariantProps<typeof AnimVariants>['overlay']
  renderOnce?: boolean
  rerender?: boolean
}

function PopoverContent({
  children,
  className,
  placement = 'bottom',
  animation = 'default',
  overlay = 'nothing',
  sideOffset = 4,
  alignOffset = 0,
  style,
  renderOnce = true,
  rerender = false,
  ...props
}: PopoverContentProps): React.JSX.Element {
  const openValue = useAtomValue(open)
  const { trigger, content, arrow: _arrow } = useAtomValue(refs)

  const Id = usePopoverId()
  React.useLayoutEffect(() => {
    if (!trigger || !content || !_arrow) return

    // measure the arrow’s dimensions
    const arrowRect = _arrow.getBoundingClientRect()
    const arrowSize = Math.max(arrowRect.width, arrowRect.height)

    const cleanup = autoUpdate(trigger, content, () => {
      computePosition(trigger, content, {
        placement,
        platform: platform,
        middleware: [
          offset({ mainAxis: sideOffset + arrowRect.height / 2, crossAxis: alignOffset }),
          flip(),
          shift({ padding: 8 }),
          arrow({ element: _arrow, padding: 8 }),
        ],
      }).then(({ x, y, middlewareData }) => {
        // position the container
        Object.assign(content.style, { left: `${x}px`, top: `${y}px` })

        // position the arrow itself
        if (middlewareData.arrow) {
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
  }, [trigger, placement, sideOffset, alignOffset])

  React.useEffect(() => {
    if (content && openValue) {
      const focusable = content.querySelector<HTMLElement>(
        'input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], area[href], [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    }
  }, [content])

  return (
    <dialog
      duck-popover-content=""
      popover="auto"
      role="dialog"
      className={cn(
        AnimVariants({ overlay }),
        AnimDialogVariants({ animation }),
        'bg-popover text-popover-foreground absolute max-h-fit p-4 w-fit z-50 overflow-visible',
        className,
      )}
      id={Id}
      open={true}
      style={
        {
          transoformOrigin: placement.split('-')[0],
          ...style,
        } as React.CSSProperties
      }
      data-open={openValue}
      {...props}>
      <div
        id="arrow"
        className="absolute [clip-path:polygon(50%_100%,0_0,100%_0)] z-3 w-4 h-2 g-popover rotate-180"
        duck-popover-arrow=""
      />
      <ShouldRender open={openValue} ref={content} once={renderOnce}>
        {children}
      </ShouldRender>
    </dialog>
  )
}

const PopoverClose = PopoverTrigger

export { Popover, PopoverTrigger, PopoverContent, PopoverClose }
