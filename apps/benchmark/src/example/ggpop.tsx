'use client'
import { AnimDialogVariants, AnimVariants } from '@gentleduck/motion/anim'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps } from '@gentleduck/variants'
import { atom, useAtom, useAtomValue, useSetAtom } from '@gentleduck/state/primitive'
import { autoUpdate, computePosition, flip, offset, Placement, platform } from '@gentleduck/duck-float/dom'
import { ShouldRender } from '../../../../packages/aria-feather/src/dialog/dialog'

const open = atom(false)
const refs = atom<{
  trigger: HTMLElement | HTMLButtonElement | null
  content: HTMLDialogElement | null
  wrapper: HTMLDivElement | null
}>({ trigger: null, content: null, wrapper: null })

const Popover = ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement | HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDialogElement | null>(null)
  const [openValue, setOpen] = useAtom(open)
  const setRefs = useSetAtom(refs)

  React.useLayoutEffect(() => {
    if (!wrapperRef.current) return
    triggerRef.current = wrapperRef?.current.querySelector('[duck-popover-trigger]')
    contentRef.current = wrapperRef?.current.querySelector('[duck-popover-content]')
    if (!triggerRef.current || !contentRef.current) return

    setRefs({ trigger: triggerRef.current, content: contentRef.current, wrapper: wrapperRef.current })
    return () => setRefs({ trigger: null, content: null, wrapper: null })
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
  return (
    <Button
      {...props}
      variant={variant}
      asChild={asChild}
      popoverTarget="duck"
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
}

function PopoverContent({
  children,
  className,
  placement = 'bottom',
  animation = 'default',
  overlay = 'nothing',
  sideOffset = 4,
  alignOffset = 0,
  ...props
}: PopoverContentProps): React.JSX.Element {
  const openValue = useAtomValue(open)
  const { wrapper, trigger, content } = useAtomValue(refs)

  React.useLayoutEffect(() => {
    if (!trigger || !content) return

    const cleanup = autoUpdate(trigger, content, () => {
      computePosition(trigger, content, {
        placement: placement,
        middleware: [
          offset({
            mainAxis: 4,
            crossAxis: alignOffset,
          }),
          flip({
            // fallbackPlacements: ['top', 'bottom', 'right', 'left'],
          }),
          // size({
          //   apply({ availableHeight, rects, elements }) {
          //     Object.assign(elements.floating.style, {
          //       minWidth: `${rects.reference.width}px`,
          //       maxHeight: `${Math.max(0, availableHeight)}px`,
          //       maxWidth: `100%`,
          //     })
          //   },
          // }),
        ],
        platform,
      }).then(({ x, y }) => {
        Object.assign(content.style, {
          left: `${x}px`,
          top: `${y}px`,
          position: 'absolute',
          transformOrigin: 'bottom',
        })
      })
    })

    return () => cleanup()
  }, [trigger])

  return (
    <dialog
      duck-popover-content=""
      popover="auto"
      role="dialog"
      className={cn(
        AnimVariants({ overlay }),
        AnimDialogVariants({ animation }),
        ``,
        `origin-top 
bg-popover text-popover-foreground inset-auto 
absolute max-h-none p-4 w-fit z-50 
 -translate-y-[4px]
opacity-0
`,
        className,
      )}
      id="duck"
      open={true}
      data-open={openValue}
      {...props}>
      <ShouldRender open={openValue} ref={content as never}>
        {children}
      </ShouldRender>
    </dialog>
  )
}

const PopoverClose = PopoverTrigger

export { Popover, PopoverTrigger, PopoverContent, PopoverClose }
